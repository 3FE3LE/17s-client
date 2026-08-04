import type { Rgb } from './config';
import type { IndexedImage } from './result';

/**
 * One entry in an extracted palette. `index` is the slot in the original
 * palette (kept stable through normalization so consumers can map back to
 * an `IndexedImage`). Sort by `count` desc for default UI ordering.
 */
export interface PaletteColor {
  /** Stable palette index — survives normalization. */
  readonly index: number;
  readonly rgb: Rgb;
  /** Number of pixels in the logical image that map to this color. */
  readonly count: number;
}

/**
 * Transparent sentinel index. `IndexedImage.indices` uses this exact value
 * for pixels where alpha = 0. Never appears in `PaletteColor[].index`.
 */
export const TRANSPARENT_INDEX = 0xffffffff;

/**
 * Aggregate an indexed image into a palette with per-color counts. Stable
 * sort: ties on `count` broken by lowest `index` first (deterministic).
 *
 * Transparent pixels (sentinel) are excluded from the palette — the index
 * has no associated RGB. Caller may compute transparent count separately.
 */
export function extractPalette(indexed: IndexedImage): PaletteColor[] {
  const { indices, width, height } = indexed;
  const counts = new Map<number, number>();
  const total = width * height;
  for (let i = 0; i < total; i += 1) {
    const idx = indices[i]!;
    if (idx === TRANSPARENT_INDEX) continue;
    counts.set(idx, (counts.get(idx) ?? 0) + 1);
  }
  const out: PaletteColor[] = [];
  for (const [index, count] of counts) {
    out.push({ index, rgb: [0, 0, 0], count });
  }
  // Stable sort: count desc, then index asc.
  out.sort((a, b) => b.count - a.count || a.index - b.index);
  return out;
}

/** Attach actual RGB values to an extracted palette (e.g. after remap). */
export function withRgb(palette: PaletteColor[], colors: readonly Rgb[]): PaletteColor[] {
  return palette.map((entry) => ({
    ...entry,
    rgb: colors[entry.index] ?? [0, 0, 0],
  }));
}

/** Count of fully transparent pixels in an indexed image (sentinel slots). */
export function countTransparentPixels(indexed: IndexedImage): number {
  const { indices, width, height } = indexed;
  const total = width * height;
  let n = 0;
  for (let i = 0; i < total; i += 1) {
    if (indices[i] === TRANSPARENT_INDEX) n += 1;
  }
  return n;
}
