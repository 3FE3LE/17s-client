import type { Normalization, Rgb } from '../domain/config';
import { deltaE76, fillLabFromRgba } from './color/lab';

/**
 * Palette normalization. Reduces a palette to a multiple of N by merging
 * pairs until the target length is reached. Never invents colors: every
 * output entry is a fresh average of the inputs.
 *
 * Modes:
 *  - `off`         — no-op.
 *  - `down-to-8`   — target = floor(palette.length / 8) * 8.
 *  - `down-to`     — target = floor(palette.length / step) * step.
 *
 * Strategy: while palette > target, find the pair (i, j) with the smallest
 * CIE76 ΔE between them, replace them with the channel-mean RGB, and
 * continue. Idempotent: a palette already at the target length is unchanged.
 *
 * The weighted-by-usage variant is intentionally absent — count weighting
 * would let one dominant entry absorb neighbours and distort the palette.
 * Visual stability wins; counts are reported separately in the extracted
 * palette.
 */

export function normalize(palette: readonly Rgb[], spec: Normalization): Rgb[] {
  if (spec.mode === 'off') return palette.slice();
  const step = spec.mode === 'down-to-8' ? 8 : spec.step;
  if (step < 2 || palette.length <= step) return palette.slice();
  const target = Math.floor(palette.length / step) * step;
  if (palette.length <= target) return palette.slice();

  // Lab is recomputed once per merge. For small palettes (<= 256) this
  // quadratic pass dominates and stays well under budget.
  const work: Rgb[] = palette.map((p) => [p[0], p[1], p[2]]);

  while (work.length > target) {
    // Precompute LAB once per pass.
    const lab: Array<[number, number, number]> = work.map((p) => {
      const bytes = new Uint8ClampedArray([p[0], p[1], p[2], 255]);
      const out = new Float32Array(3);
      fillLabFromRgba(bytes, out);
      return [out[0]!, out[1]!, out[2]!];
    });

    let bestI = 0;
    let bestJ = 1;
    let bestDist = Infinity;
    for (let i = 0; i < work.length; i += 1) {
      const li = lab[i]!;
      for (let j = i + 1; j < work.length; j += 1) {
        const d = deltaE76(li, lab[j]!);
        if (d < bestDist) {
          bestDist = d;
          bestI = i;
          bestJ = j;
        }
      }
    }

    const a = work[bestI]!;
    const b = work[bestJ]!;
    const merged: Rgb = [
      Math.round((a[0] + b[0]) / 2),
      Math.round((a[1] + b[1]) / 2),
      Math.round((a[2] + b[2]) / 2),
    ];
    // Replace both with one merged entry. Keep order: lower index first.
    const keepIdx = Math.min(bestI, bestJ);
    const dropIdx = Math.max(bestI, bestJ);
    work.splice(dropIdx, 1);
    work[keepIdx] = merged;
  }
  return work;
}
