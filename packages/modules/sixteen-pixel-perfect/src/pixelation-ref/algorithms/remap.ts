import type { Rgb } from '../domain/config';
import type { IndexedImage } from '../domain/result';
import type { PixelBuffer } from '../../render/pixel-buffer';
import { TRANSPARENT_INDEX } from '../domain/palette';
import { deltaE76, labFromSrgb } from './color/lab';

/**
 * Map each pixel of a logical-size image to its closest palette entry.
 * Output is an `IndexedImage` (slots reference palette positions, with a
 * sentinel for alpha = 0 pixels so the palette never needs a transparent
 * entry). Matching uses CIE76 ΔE in LAB — perceptually closer than RGB
 * Euclidean for skin tones, blues, and grays.
 *
 * Used as a separate stage from `dither.ts` (which embeds its own remap)
 * so the quantize-only path stays deterministic and testable.
 *
 * Pure. Returns a fresh `IndexedImage`.
 */

export function remap(src: PixelBuffer, palette: readonly Rgb[]): IndexedImage {
  const W = src.width;
  const H = src.height;
  const total = W * H;
  const indices = new Uint32Array(total);
  const labPal: Array<[number, number, number]> = palette.map((p) => labFromSrgb(p[0], p[1], p[2]));

  for (let i = 0; i < total; i += 1) {
    const si = i * 4;
    if (src.data[si + 3] === 0) {
      indices[i] = TRANSPARENT_INDEX;
      continue;
    }
    const target = labFromSrgb(src.data[si]!, src.data[si + 1]!, src.data[si + 2]!);
    let best = 0;
    let bestDist = Infinity;
    for (let p = 0; p < labPal.length; p += 1) {
      const d = deltaE76(target, labPal[p]!);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
    indices[i] = best;
  }
  return { width: W, height: H, indices };
}

/**
 * Materialize the logical-size pixelated buffer from `IndexedImage` + the
 * palette colors. Used to render the final pixel-art PNG and to feed
 * `nearestScale` for the canvas preview. Transparent slots are written as
 * fully transparent (alpha = 0).
 */
export function materializeIndexed(indexed: IndexedImage, palette: readonly Rgb[]): PixelBuffer {
  const W = indexed.width;
  const H = indexed.height;
  const out = new Uint8ClampedArray(W * H * 4);
  for (let i = 0; i < W * H; i += 1) {
    const di = i * 4;
    const idx = indexed.indices[i]!;
    if (idx === TRANSPARENT_INDEX) {
      out[di] = 0;
      out[di + 1] = 0;
      out[di + 2] = 0;
      out[di + 3] = 0;
      continue;
    }
    const c = palette[idx] ?? [0, 0, 0];
    out[di] = c[0];
    out[di + 1] = c[1];
    out[di + 2] = c[2];
    out[di + 3] = 255;
  }
  return { width: W, height: H, data: out };
}

/**
 * Nearest-neighbor scale a source `PixelBuffer` to `dstW × dstH`. Used to
 * produce the preview at canvas size — kept separate from `applyFit` to
 * avoid mixing scaling direction.
 */
export function nearestScale(src: PixelBuffer, dstW: number, dstH: number): PixelBuffer {
  const out = new Uint8ClampedArray(dstW * dstH * 4);
  const srcW = src.width;
  const srcH = src.height;
  for (let y = 0; y < dstH; y += 1) {
    const sy = Math.min(srcH - 1, Math.floor((y / dstH) * srcH));
    for (let x = 0; x < dstW; x += 1) {
      const sx = Math.min(srcW - 1, Math.floor((x / dstW) * srcW));
      const si = (sy * srcW + sx) * 4;
      const di = (y * dstW + x) * 4;
      out[di] = src.data[si]!;
      out[di + 1] = src.data[si + 1]!;
      out[di + 2] = src.data[si + 2]!;
      out[di + 3] = src.data[si + 3]!;
    }
  }
  return { width: dstW, height: dstH, data: out };
}
