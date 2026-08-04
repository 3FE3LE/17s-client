/**
 * Generates logical pixel-grid options that are integer subsamples of the
 * given canvas dimensions. Used by the LogicalGrid step to surface preset
 * choices that already guarantee clean upscaling back to canvas size.
 *
 * Strategy: enumerate divisors in a sensible range, keep only the ones
 * that produce integer W and H. Sort ascending by absolute size so the
 * smallest logical (sharpest pixel art) appears first.
 *
 * For 1280×720 the surface set is roughly:
 *   128×72, 160×90, 256×144, 320×180, 640×360, plus a couple out-of-pattern sizes.
 *
 * Range tuned so a 16:9 canvas with 720p height yields options from very
 * coarse (320×180) to soft (80×45).
 */
export interface LogicalPreset {
  /** Pixel-art grid resolution. */
  readonly w: number;
  readonly h: number;
  /** Integer upscale factor canvas = factor × logical. */
  readonly factor: number;
  /** Total pixel count; surface ordering is by this ascending. */
  readonly total: number;
}

export function deriveLogicalPresets(canvasW: number, canvasH: number): LogicalPreset[] {
  if (canvasW < 8 || canvasH < 8) return [];
  const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20];
  const presets: LogicalPreset[] = [];
  for (const factor of candidates) {
    const w = Math.round(canvasW / factor);
    const h = Math.round(canvasH / factor);
    if (w * factor !== canvasW) continue;
    if (h * factor !== canvasH) continue;
    if (w < 8 || h < 8) continue;
    presets.push({ w, h, factor, total: w * h });
  }
  presets.sort((a, b) => a.total - b.total);
  return presets;
}

/**
 * How much information is potentially lost when going from the source
 * image down to the chosen logical grid. Returns an approximate
 * downsampling factor (source pixels per logical pixel).
 *
 *   1.0   → no downscaling.
 *   > 4   → aggressive, expect blurred detail loss.
 *   > 16  → very lossy, expect colour bleed.
 */
export function sourceToLogicalLoss(
  source: { w: number; h: number } | null,
  logical: { w: number; h: number },
): number {
  if (!source || !source.w || !source.h || !logical.w || !logical.h) return 0;
  return (source.w * source.h) / (logical.w * logical.h);
}

export function lossTier(loss: number): {
  label: string;
  tone: 'emerald' | 'amber' | 'red';
  detail: string;
} {
  if (loss <= 1.5) {
    return { label: 'sin pérdida', tone: 'emerald', detail: 'logical ≈ source' };
  }
  if (loss <= 4) {
    return { label: 'pérdida baja', tone: 'emerald', detail: 'detalle fino se conserva' };
  }
  if (loss <= 16) {
    return { label: 'pérdida media', tone: 'amber', detail: 'se pierden detalles pequeños' };
  }
  if (loss <= 64) {
    return { label: 'pérdida alta', tone: 'amber', detail: 'detalle grueso se mezcla' };
  }
  return { label: 'pérdida muy alta', tone: 'red', detail: 'mucho color se sangra entre píxeles' };
}
