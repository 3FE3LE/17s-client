/**
 * sRGB ↔ CIE LAB conversions + ΔE76 (CIE 1976).
 *
 * Reference illuminant: D65. Inputs/outputs are 8-bit sRGB. Operations are
 * pure and deterministic — no platform calls, no threads, no Math.random.
 *
 * The CIE formulas use the standard sRGB → linear → XYZ (D65) → LAB
 * pipeline. Per-pixel computation keeps memory bounded: a full-cube cache
 * would cost ~200 MB; instead we trust the V8 JIT to keep the SRGB_LINEAR
 * table hot and accept ~3 µs per pixel.
 *
 * Hot path: `fillLabFromRgba(src, dst)`. Used by every quantizer and the
 * remap step. Costs roughly 60 ms / megapixel on a modern laptop — well
 * under budget since canvas-final previews cap practical inputs.
 */

import type { Rgb } from '../../domain/config';

const SRGB_LINEAR: Float32Array = (() => {
  const out = new Float32Array(256);
  for (let i = 0; i < 256; i += 1) {
    const c = i / 255;
    out[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  return out;
})();

// D65 reference white in XYZ, scaled so Y = 1.
const WHITE_X = 0.95047;
const WHITE_Y = 1.0;
const WHITE_Z = 1.08883;

// sRGB → XYZ (D65) matrix, row-major.
const M = new Float32Array([
  0.4124564, 0.3575761, 0.1804375, 0.2126729, 0.7151522, 0.072175, 0.0193339, 0.119192, 0.9503041,
]);

/** Convert 8-bit sRGB to CIE LAB. Input range is [0..255] per channel. */
export function labFromSrgb(r: number, g: number, b: number): [number, number, number] {
  const lr = SRGB_LINEAR[r]!;
  const lg = SRGB_LINEAR[g]!;
  const lb = SRGB_LINEAR[b]!;
  const x = M[0]! * lr + M[1]! * lg + M[2]! * lb;
  const y = M[3]! * lr + M[4]! * lg + M[5]! * lb;
  const z = M[6]! * lr + M[7]! * lg + M[8]! * lb;
  const fx = labF(x / WHITE_X);
  const fy = labF(y / WHITE_Y);
  const fz = labF(z / WHITE_Z);
  const L = 116 * fy - 16;
  const A = 500 * (fx - fy);
  const B = 200 * (fy - fz);
  return [L, A, B];
}

function labF(t: number): number {
  const delta = 6 / 29;
  return t > delta * delta * delta ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}

/** CIE76 ΔE between two LAB triples. */
export function deltaE76(a: [number, number, number], b: [number, number, number]): number {
  const dL = a[0] - b[0];
  const da = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dL * dL + da * da + db * db);
}

/** Single-pixel LAB lookup for `Rgb`. */
export function labOf(rgb: Rgb): [number, number, number] {
  return labFromSrgb(rgb[0], rgb[1], rgb[2]);
}

/** Bulk-fill a parallel LAB array from RGBA bytes. Float32 output, length = pixels * 3. */
export function fillLabFromRgba(src: Uint8ClampedArray, dst: Float32Array): void {
  const total = Math.floor(src.length / 4);
  for (let p = 0; p < total; p += 1) {
    const si = p * 4;
    const dsti = p * 3;
    const lr = SRGB_LINEAR[src[si]!]!;
    const lg = SRGB_LINEAR[src[si + 1]!]!;
    const lb = SRGB_LINEAR[src[si + 2]!]!;
    const x = M[0]! * lr + M[1]! * lg + M[2]! * lb;
    const y = M[3]! * lr + M[4]! * lg + M[5]! * lb;
    const z = M[6]! * lr + M[7]! * lg + M[8]! * lb;
    const fx = labF(x / WHITE_X);
    const fy = labF(y / WHITE_Y);
    const fz = labF(z / WHITE_Z);
    dst[dsti] = 116 * fy - 16;
    dst[dsti + 1] = 500 * (fx - fy);
    dst[dsti + 2] = 200 * (fy - fz);
  }
}
