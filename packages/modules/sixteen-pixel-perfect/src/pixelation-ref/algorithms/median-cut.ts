import type { Rgb } from '../domain/config';

/**
 * Median-Cut color quantization (Heckbert 1982).
 *
 *   1. Pre-quantize every unique input color to 5-bit per channel. Roughly
 *      collapses 32× duplicates, keeping per-bucket counts manageable.
 *   2. Maintain a list of buckets. Each bucket carries: the set of distinct
 *      quantized colors it owns, the pixel indices that fall into them,
 *      and the min/max per channel.
 *   3. Repeatedly split the bucket with the longest axis at that axis's
 *      midpoint, until `maxColors` buckets exist.
 *   4. Average each bucket's pixel RGB (weighted by original pixel, not
 *      quantized) for the final palette color.
 *
 * Output: ≤ `maxColors` distinct RGB triples. Sorted by L* descending so
 * later stages see a perceptually ordered palette.
 *
 * Pure. Deterministic. Stable for a given (pixels, maxColors) pair.
 */

type Bucket = {
  pixels: number[]; // pixel indices in `src`
  rMin: number;
  rMax: number;
  gMin: number;
  gMax: number;
  bMin: number;
  bMax: number;
};

const QUANT_SHIFT = 3; // 8-bit → 5-bit (right shift by 3)

export function medianCut(src: Uint8ClampedArray, maxColors: number): Rgb[] {
  if (maxColors < 2) return [meanColor(src)];
  const total = Math.floor(src.length / 4);
  if (total === 0) return [[0, 0, 0]];

  // Bucket pixels by 5-bit quantized color to reduce splitter work.
  const bucketsByColor = new Map<number, number[]>();
  for (let i = 0; i < total; i += 1) {
    const si = i * 4;
    const r = src[si]! >> QUANT_SHIFT;
    const g = src[si + 1]! >> QUANT_SHIFT;
    const b = src[si + 2]! >> QUANT_SHIFT;
    // Skip fully transparent pixels — they map to the sentinel, not a palette slot.
    if (src[si + 3] === 0) continue;
    const key = (r << 10) | (g << 5) | b;
    let arr = bucketsByColor.get(key);
    if (!arr) {
      arr = [];
      bucketsByColor.set(key, arr);
    }
    arr.push(i);
  }
  if (bucketsByColor.size === 0) return [[0, 0, 0]];

  // Initialize one bucket containing all pixels.
  const allPixels: number[] = [];
  for (const arr of bucketsByColor.values()) {
    for (const p of arr) allPixels.push(p);
  }
  const initial: Bucket = computeBounds(src, allPixels);
  let buckets: Bucket[] = [initial];

  while (buckets.length < maxColors) {
    const target = pickSplitTarget(buckets);
    if (!target) break; // no splittable bucket remains
    const split = splitBucket(src, target);
    if (!split) break;
    buckets = buckets.filter((b) => b !== target).concat(split);
  }

  const palette: Rgb[] = buckets.map((b) => meanOfBucket(src, b));
  palette.sort((a, b) => luminance(b) - luminance(a));
  return palette;
}

function computeBounds(src: Uint8ClampedArray, pixels: number[]): Bucket {
  let rMin = 255;
  let rMax = 0;
  let gMin = 255;
  let gMax = 0;
  let bMin = 255;
  let bMax = 0;
  for (const i of pixels) {
    const si = i * 4;
    const r = src[si]!;
    const g = src[si + 1]!;
    const b = src[si + 2]!;
    if (r < rMin) rMin = r;
    if (r > rMax) rMax = r;
    if (g < gMin) gMin = g;
    if (g > gMax) gMax = g;
    if (b < bMin) bMin = b;
    if (b > bMax) bMax = b;
  }
  return { pixels, rMin, rMax, gMin, gMax, bMin, bMax };
}

function pickSplitTarget(buckets: Bucket[]): Bucket | null {
  let best: Bucket | null = null;
  let bestRange = 0;
  for (const b of buckets) {
    const range = Math.max(b.rMax - b.rMin, b.gMax - b.gMin, b.bMax - b.bMin);
    if (range > bestRange && b.pixels.length > 1) {
      bestRange = range;
      best = b;
    }
  }
  return best;
}

function splitBucket(src: Uint8ClampedArray, bucket: Bucket): [Bucket, Bucket] | null {
  const rangeR = bucket.rMax - bucket.rMin;
  const rangeG = bucket.gMax - bucket.gMin;
  const rangeB = bucket.bMax - bucket.bMin;
  const axis = Math.max(rangeR, rangeG, rangeB);
  if (axis === 0) return null;
  // Median-split along the chosen axis. Sort indices by the channel value.
  const sorted = bucket.pixels.slice().sort((a, b) => {
    const si = a * 4;
    const sb = b * 4;
    if (axis === rangeR) return src[si]! - src[sb]!;
    if (axis === rangeG) return src[si + 1]! - src[sb + 1]!;
    return src[si + 2]! - src[sb + 2]!;
  });
  const mid = Math.floor(sorted.length / 2);
  const left = sorted.slice(0, mid);
  const right = sorted.slice(mid);
  if (left.length === 0 || right.length === 0) return null;
  return [computeBounds(src, left), computeBounds(src, right)];
}

function meanOfBucket(src: Uint8ClampedArray, bucket: Bucket): Rgb {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (const i of bucket.pixels) {
    const si = i * 4;
    r += src[si]!;
    g += src[si + 1]!;
    b += src[si + 2]!;
    n += 1;
  }
  if (n === 0) return [0, 0, 0];
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

function meanColor(src: Uint8ClampedArray): Rgb {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const total = Math.floor(src.length / 4);
  for (let i = 0; i < total; i += 1) {
    const si = i * 4;
    if (src[si + 3] === 0) continue;
    r += src[si]!;
    g += src[si + 1]!;
    b += src[si + 2]!;
    n += 1;
  }
  if (n === 0) return [0, 0, 0];
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

function luminance(rgb: Rgb): number {
  // Approx sRGB L*: 0.2126 R + 0.7152 G + 0.0722 B. Cheap and order-stable.
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
