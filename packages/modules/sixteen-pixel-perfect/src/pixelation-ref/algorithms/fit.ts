import type { FitMode } from '../domain/config';
import type { PixelBuffer } from '../../render/pixel-buffer';

/**
 * Fit engine — adapts a source image into the configured canvas before
 * downstream pipeline stages see it. Pure: caller passes the source
 * pixels and an explicit `FitSpec`. Result either describes a centered fit
 * with possible padding (transparent), or a stretch.
 *
 * Invariants:
 *  - Output canvas always equals `canvas` dimensions.
 *  - `scale` is computed so neither axis ever overflows (fit) or so the
 *    smaller axis exactly fills (cover).
 *  - For `cover`, excess pixels along the longer axis are cropped centrally.
 *  - For `stretch`, the source is resampled freely; UI warns about distortion.
 */

export interface FitSpec {
  readonly canvas: { readonly w: number; readonly h: number };
  readonly source: { readonly w: number; readonly h: number };
  readonly mode: FitMode;
}

export type FitResult =
  | {
      readonly mode: 'fit' | 'cover';
      readonly scale: number;
      readonly offsetX: number;
      readonly offsetY: number;
      readonly crop: {
        readonly x: number;
        readonly y: number;
        readonly w: number;
        readonly h: number;
      };
      readonly placedW: number;
      readonly placedH: number;
    }
  | {
      readonly mode: 'stretch';
      readonly placedW: number;
      readonly placedH: number;
    };

/** Compute fit geometry. Pure: no allocations. */
export function computeFit(spec: FitSpec): FitResult {
  const { canvas, source, mode } = spec;
  if (mode === 'stretch') {
    return { mode: 'stretch', placedW: canvas.w, placedH: canvas.h };
  }
  const sourceAspect = source.w / source.h;
  const canvasAspect = canvas.w / canvas.h;
  let placedW: number;
  let placedH: number;
  if (mode === 'fit') {
    if (sourceAspect > canvasAspect) {
      placedW = canvas.w;
      placedH = Math.max(1, Math.round(canvas.w / sourceAspect));
    } else {
      placedH = canvas.h;
      placedW = Math.max(1, Math.round(canvas.h * sourceAspect));
    }
  } else {
    // cover — fill canvas, may crop source.
    if (sourceAspect > canvasAspect) {
      placedH = canvas.h;
      placedW = Math.max(1, Math.round(canvas.h * sourceAspect));
    } else {
      placedW = canvas.w;
      placedH = Math.max(1, Math.round(canvas.w / sourceAspect));
    }
  }
  const scale = placedW / source.w;
  const offsetX = Math.floor((canvas.w - placedW) / 2);
  const offsetY = Math.floor((canvas.h - placedH) / 2);
  // For cover, also report the source crop rectangle that feeds the placement.
  const cropSourceW = canvas.w / scale;
  const cropSourceH = canvas.h / scale;
  const cropX = Math.floor((source.w - cropSourceW) / 2);
  const cropY = Math.floor((source.h - cropSourceH) / 2);
  return {
    mode: 'fit' === mode ? 'fit' : 'cover',
    scale,
    offsetX,
    offsetY,
    crop: { x: cropX, y: cropY, w: Math.round(cropSourceW), h: Math.round(cropSourceH) },
    placedW,
    placedH,
  };
}

/**
 * Apply a `FitResult` to a source `PixelBuffer`, producing a canvas-sized
 * buffer. Transparent pixels fill unused canvas area (fit) or crop area
 * (cover — no padding because cover always fills).
 *
 * Uses nearest-neighbor resampling; the resampler in `./resample` handles
 * the higher-quality reduction to logical size, so this step stays simple
 * and fast.
 */
export function applyFit(
  source: PixelBuffer,
  fit: FitResult,
  canvas: { w: number; h: number },
): PixelBuffer {
  const out = createTransparent(canvas.w, canvas.h);
  if (fit.mode === 'stretch') {
    for (let y = 0; y < canvas.h; y += 1) {
      const sy = Math.min(source.height - 1, Math.floor((y / canvas.h) * source.height));
      for (let x = 0; x < canvas.w; x += 1) {
        const sx = Math.min(source.width - 1, Math.floor((x / canvas.w) * source.width));
        copyPixel(source, sx, sy, out, x, y);
      }
    }
    return out;
  }
  // fit or cover: source is sampled within `fit.crop` and placed at (offsetX, offsetY).
  const { crop, offsetX, offsetY, placedW, placedH } = fit;
  for (let y = 0; y < placedH; y += 1) {
    const syRaw = crop.y + (crop.h > 1 ? Math.floor((y / placedH) * crop.h) : 0);
    const sy = Math.min(source.height - 1, Math.max(0, syRaw));
    const dy = offsetY + y;
    for (let x = 0; x < placedW; x += 1) {
      const sxRaw = crop.x + (crop.w > 1 ? Math.floor((x / placedW) * crop.w) : 0);
      const sx = Math.min(source.width - 1, Math.max(0, sxRaw));
      const dx = offsetX + x;
      copyPixel(source, sx, sy, out, dx, dy);
    }
  }
  return out;
}

function copyPixel(
  src: PixelBuffer,
  sx: number,
  sy: number,
  dst: PixelBuffer,
  dx: number,
  dy: number,
): void {
  if (dx < 0 || dy < 0 || dx >= dst.width || dy >= dst.height) return;
  const si = (sy * src.width + sx) * 4;
  const di = (dy * dst.width + dx) * 4;
  dst.data[di] = src.data[si]!;
  dst.data[di + 1] = src.data[si + 1]!;
  dst.data[di + 2] = src.data[si + 2]!;
  dst.data[di + 3] = src.data[si + 3]!;
}

function createTransparent(w: number, h: number): PixelBuffer {
  return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
}
