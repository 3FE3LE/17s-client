import type { PixelBuffer } from '../../render/pixel-buffer';
import type { BlockMode } from '../domain/config';

/**
 * Block-mode resampler. Maps `src` (typically the canvas-fitted buffer) onto
 * `dstW × dstH` by aggregating each destination pixel's footprint. Three
 * modes share the same control flow to keep output predictable:
 *
 *   - `average`   — arithmetic mean per channel; alpha is weighted by
 *                    non-zero coverage (transparent pixels are excluded
 *                    from the RGB sum but counted for the alpha).
 *   - `median`    — per-channel percentile-50. Faster than geometric
 *                    median; slight desaturation on high-chroma blocks is
 *                    acceptable for the pixel-art reference use case. UI
 *                    notes the trade-off.
 *   - `dominant`  — quantization to 5-bit per channel + argmax frequency.
 *
 * Pure: no I/O, no allocations beyond the output buffer.
 */

export function resample(
  src: PixelBuffer,
  dstW: number,
  dstH: number,
  mode: BlockMode,
): PixelBuffer {
  const out = new Uint8ClampedArray(dstW * dstH * 4);
  const srcW = src.width;
  const srcH = src.height;
  const blockW = srcW / dstW;
  const blockH = srcH / dstH;
  for (let dy = 0; dy < dstH; dy += 1) {
    const y0 = Math.floor(dy * blockH);
    const y1 = Math.max(y0 + 1, Math.ceil((dy + 1) * blockH));
    for (let dx = 0; dx < dstW; dx += 1) {
      const x0 = Math.floor(dx * blockW);
      const x1 = Math.max(x0 + 1, Math.ceil((dx + 1) * blockW));
      const di = (dy * dstW + dx) * 4;
      if (mode === 'average') {
        averageBlock(src, x0, y0, x1, y1, srcW, out, di);
      } else if (mode === 'median') {
        medianBlock(src, x0, y0, x1, y1, srcW, out, di);
      } else {
        dominantBlock(src, x0, y0, x1, y1, srcW, out, di);
      }
    }
  }
  return { width: dstW, height: dstH, data: out };
}

function averageBlock(
  src: PixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  srcW: number,
  out: Uint8ClampedArray,
  di: number,
): void {
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let aSum = 0;
  let total = 0;
  let visibleTotal = 0;
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const si = (y * srcW + x) * 4;
      const r = src.data[si]!;
      const g = src.data[si + 1]!;
      const b = src.data[si + 2]!;
      const a = src.data[si + 3]!;
      total += 1;
      if (a > 0) {
        rSum += r * a;
        gSum += g * a;
        bSum += b * a;
        visibleTotal += a;
      }
      aSum += a;
    }
  }
  const alpha = Math.round(aSum / Math.max(1, total));
  if (visibleTotal === 0 || alpha === 0) {
    out[di] = 0;
    out[di + 1] = 0;
    out[di + 2] = 0;
    out[di + 3] = 0;
    return;
  }
  out[di] = Math.round(rSum / visibleTotal);
  out[di + 1] = Math.round(gSum / visibleTotal);
  out[di + 2] = Math.round(bSum / visibleTotal);
  out[di + 3] = alpha;
}

function medianBlock(
  src: PixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  srcW: number,
  out: Uint8ClampedArray,
  di: number,
): void {
  const rs: number[] = [];
  const gs: number[] = [];
  const bs: number[] = [];
  const as: number[] = [];
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const si = (y * srcW + x) * 4;
      rs.push(src.data[si]!);
      gs.push(src.data[si + 1]!);
      bs.push(src.data[si + 2]!);
      as.push(src.data[si + 3]!);
    }
  }
  rs.sort((a, b) => a - b);
  gs.sort((a, b) => a - b);
  bs.sort((a, b) => a - b);
  as.sort((a, b) => a - b);
  const m = Math.floor(rs.length / 2);
  out[di] = rs[m]!;
  out[di + 1] = gs[m]!;
  out[di + 2] = bs[m]!;
  out[di + 3] = as[m]!;
}

/** 5-bit quantization key, used by `dominant` to bucket similar colors. */
function dominantKey(r: number, g: number, b: number): number {
  return ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
}

function dominantBlock(
  src: PixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  srcW: number,
  out: Uint8ClampedArray,
  di: number,
): void {
  const buckets = new Map<number, { r: number; g: number; b: number; a: number; n: number }>();
  let total = 0;
  let aSum = 0;
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const si = (y * srcW + x) * 4;
      const r = src.data[si]!;
      const g = src.data[si + 1]!;
      const b = src.data[si + 2]!;
      const a = src.data[si + 3]!;
      aSum += a;
      total += 1;
      if (a === 0) continue;
      const k = dominantKey(r, g, b);
      const entry = buckets.get(k);
      if (entry) {
        entry.r += r * a;
        entry.g += g * a;
        entry.b += b * a;
        entry.a += a;
        entry.n += 1;
      } else {
        buckets.set(k, { r: r * a, g: g * a, b: b * a, a, n: 1 });
      }
    }
  }
  const alpha = Math.round(aSum / Math.max(1, total));
  if (buckets.size === 0) {
    out[di] = 0;
    out[di + 1] = 0;
    out[di + 2] = 0;
    out[di + 3] = 0;
    return;
  }
  let bestN = -1;
  let bestEntry: { r: number; g: number; b: number; a: number; n: number } | null = null;
  for (const entry of buckets.values()) {
    if (entry.n > bestN) {
      bestN = entry.n;
      bestEntry = entry;
    }
  }
  const e = bestEntry!;
  out[di] = Math.round(e.r / e.a);
  out[di + 1] = Math.round(e.g / e.a);
  out[di + 2] = Math.round(e.b / e.a);
  out[di + 3] = alpha;
}
