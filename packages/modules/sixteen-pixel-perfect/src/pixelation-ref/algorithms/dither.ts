import type { Rgb } from '../domain/config';
import type { IndexedImage } from '../domain/result';
import type { PixelBuffer } from '../../render/pixel-buffer';
import { TRANSPARENT_INDEX } from '../domain/palette';
import { deltaE76, labFromSrgb } from './color/lab';

/**
 * Error-diffusion dithering. Operates on a logical-resolution RGB image
 * (post-resample, pre-quantize) and produces an `IndexedImage` referencing
 * the supplied palette.
 *
 * Modes:
 *  - `none` — nearest-color only (no error diffusion).
 *  - `floyd-steinberg` — 4-tap coefficients [7,3,5,1]/16 with serpentine
 *    row order. Strong diffusion, looks "videojuego 16-bit".
 *  - `bayer` — ordered dithering with a 4×4 matrix.
 *
 * Error is accumulated in a parallel `Float32Array` (one float per pixel
 * per channel) so clamping doesn't bleed across pixels. Output indices
 * resolve against the supplied palette via CIE76 ΔE.
 *
 * Pure: caller passes the source `PixelBuffer` and palette; result is
 * returned as `IndexedImage`.
 */

export type DitherMode = 'none' | 'floyd-steinberg' | 'bayer';

export function dither(src: PixelBuffer, palette: readonly Rgb[], mode: DitherMode): IndexedImage {
  const { width: W, height: H, data: srcBytes } = src;
  const total = W * H;
  const indices = new Uint32Array(total);

  // Precompute LAB for every palette entry (cheap: ≤ 256 calls).
  const labPal: Array<[number, number, number]> = palette.map((p) => labFromSrgb(p[0], p[1], p[2]));

  if (mode === 'none') {
    nearestFill(srcBytes, labPal, indices, W * H);
    return { width: W, height: H, indices };
  }

  const work = floatFromBytes(srcBytes, total);
  if (mode === 'floyd-steinberg') {
    floydSteinberg(work, W, H, palette, labPal, indices);
  } else {
    bayerDither(work, W, H, palette, labPal, indices);
  }
  return { width: W, height: H, indices };
}

function floatFromBytes(src: Uint8ClampedArray, total: number): Float32Array {
  const out = new Float32Array(total * 4);
  for (let i = 0; i < total; i += 1) {
    const si = i * 4;
    const di = i * 4;
    out[di] = src[si]!;
    out[di + 1] = src[si + 1]!;
    out[di + 2] = src[si + 2]!;
    out[di + 3] = src[si + 3]!;
  }
  return out;
}

function nearestFill(
  src: Uint8ClampedArray,
  labPal: Array<[number, number, number]>,
  indices: Uint32Array,
  total: number,
): void {
  for (let i = 0; i < total; i += 1) {
    const si = i * 4;
    if (src[si + 3] === 0) {
      indices[i] = TRANSPARENT_INDEX;
      continue;
    }
    indices[i] = nearestLabIndex(src[si]!, src[si + 1]!, src[si + 2]!, labPal);
  }
}

function floydSteinberg(
  work: Float32Array,
  W: number,
  H: number,
  palette: readonly Rgb[],
  labPal: Array<[number, number, number]>,
  indices: Uint32Array,
): void {
  for (let y = 0; y < H; y += 1) {
    const reverse = y % 2 === 1;
    const xStart = reverse ? W - 1 : 0;
    const xEnd = reverse ? -1 : W;
    const step = reverse ? -1 : 1;
    for (let x = xStart; x !== xEnd; x += step) {
      const idx = y * W + x;
      const di = idx * 4;
      if (work[di + 3] === 0) {
        indices[idx] = TRANSPARENT_INDEX;
        continue;
      }
      const r = clamp255(work[di]!);
      const g = clamp255(work[di + 1]!);
      const b = clamp255(work[di + 2]!);
      const chosen = nearestLabIndex(r, g, b, labPal);
      indices[idx] = chosen;
      const chosenRgb = palette[chosen]!;
      const er = r - chosenRgb[0];
      const eg = g - chosenRgb[1];
      const eb = b - chosenRgb[2];
      diffuseFS(work, W, H, x, y, step, er, eg, eb);
    }
  }
}

function diffuseFS(
  work: Float32Array,
  W: number,
  H: number,
  x: number,
  y: number,
  step: number,
  er: number,
  eg: number,
  eb: number,
): void {
  // Floyd-Steinberg 4-tap coefficients [7,3,5,1]/16. Serpentine flips the
  // horizontal offset sign so error never piles up in the same direction.
  const sx = step > 0 ? 1 : -1;
  // neighbors: (x+sx, y)    = 7/16
  //            (x-sx, y+1)  = 3/16
  //            (x,   y+1)  = 5/16
  //            (x+sx, y+1)  = 1/16
  const taps: Array<[number, number, number]> = [
    [sx, 0, 7],
    [-sx, 1, 3],
    [0, 1, 5],
    [sx, 1, 1],
  ];
  for (const [dx, dy, k] of taps) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
    const di = (ny * W + nx) * 4;
    work[di] = (work[di] ?? 0) + (er * k) / 16;
    work[di + 1] = (work[di + 1] ?? 0) + (eg * k) / 16;
    work[di + 2] = (work[di + 2] ?? 0) + (eb * k) / 16;
  }
}

const BAYER_4: readonly number[] = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function bayerDither(
  work: Float32Array,
  W: number,
  H: number,
  palette: readonly Rgb[],
  labPal: Array<[number, number, number]>,
  indices: Uint32Array,
): void {
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const idx = y * W + x;
      const di = idx * 4;
      if (work[di + 3] === 0) {
        indices[idx] = TRANSPARENT_INDEX;
        continue;
      }
      const threshold = (BAYER_4[(y % 4) * 4 + (x % 4)]! / 16 - 0.5) * 32;
      const r = clamp255((work[di] ?? 0) + threshold);
      const g = clamp255((work[di + 1] ?? 0) + threshold);
      const b = clamp255((work[di + 2] ?? 0) + threshold);
      indices[idx] = nearestLabIndex(r, g, b, labPal);
    }
  }
  // Reference parameter to keep the linter quiet (palette unused in this path now).
  void palette;
}

function nearestLabIndex(
  r: number,
  g: number,
  b: number,
  labPal: Array<[number, number, number]>,
): number {
  const target = labFromSrgb(r, g, b);
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < labPal.length; i += 1) {
    const d = deltaE76(target, labPal[i]!);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

function clamp255(v: number): number {
  if (v < 0) return 0;
  if (v > 255) return 255;
  return v;
}
