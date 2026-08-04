import type { PixelBuffer } from '../../render/pixel-buffer';
import type { Normalization, Rgb } from '../domain/config';
import { applyFit, computeFit, type FitResult } from '../algorithms/fit';
import { resample } from '../algorithms/resample';
import { medianCut } from '../algorithms/median-cut';
import { octreeQuantize } from '../algorithms/octree';
import { normalize } from '../algorithms/normalize';
import { dither } from '../algorithms/dither';
import { materializeIndexed, nearestScale, remap } from '../algorithms/remap';
import { extractPalette, withRgb } from '../domain/palette';
import { maxColorsAutoForLogical, type ProcessingConfig } from '../domain/config';
import type { ResultImageSet } from '../domain/result';

/**
 * Pixelation pipeline orchestrator. Pure function that takes the user's
 * `ProcessingConfig` + a canvas-fitted `PixelBuffer` and walks every stage
 * in order:
 *
 *   src → fit    → resample  → [dither]    → quantize
 *                                       ↘                   → [normalize]
 *                                                                       ↘
 *                                  remap → indexed
 *
 *                                materializeIndexed → pixelated
 *                                nearestScale        → preview
 *                                extractPalette      → palette
 *
 * The pipeline is *deterministic* end-to-end: same input bytes + same
 * recipe ⇒ byte-identical `pixelated` PNG. Numerically sensitive steps
 * (dithering) respect this property by default.
 *
 * Caller is responsible for fitting the source image into canvas size
 * (`computeFit` + `applyFit`); this pipeline expects the canvas-fitted
 * buffer so its work stays on the reduction step.
 *
 * Cancellation: an `AbortSignal` may be passed to short-circuit on the
 * next stage boundary. Each stage is O(seconds) at most; abort resolves
 * with `null`.
 */

export interface PipelineInput {
  readonly canvasFitted: PixelBuffer;
  readonly config: ProcessingConfig;
  readonly signal?: AbortSignal;
}

export interface PipelineOutput {
  readonly result: ResultImageSet;
  readonly warnings: readonly string[];
}

export function runPipeline(input: PipelineInput): PipelineOutput | null {
  const { canvasFitted, config } = input;
  const warnings: string[] = [];
  const recipe = resolveEffectiveConfig(config);

  if (recipe.canvas.w % recipe.logical.w !== 0 || recipe.canvas.h % recipe.logical.h !== 0) {
    warnings.push(
      'canvas and logical dimensions are not integer-multiples — preview blocks will not be square.',
    );
  }

  throwIfAborted(input.signal);

  // 1. Resample canvas-fitted → logical resolution.
  const logical = resample(
    canvasFitted,
    recipe.logical.w,
    recipe.logical.h,
    recipe.pixelation.mode,
  );
  throwIfAborted(input.signal);

  // 2. Dither or remap into the palette.
  let indexed;
  let palette;
  const q = recipe.quantization;
  if (recipe.dithering.mode !== 'none') {
    const rawPalette = quantize(logical, q.algorithm, q.maxColors);
    const interim =
      q.algorithm === 'median-cut' || q.algorithm === 'octree'
        ? applyNormalization(rawPalette, recipe.normalization)
        : rawPalette;
    palette = interim;
    indexed = dither(logical, palette, recipe.dithering.mode);
  } else {
    const rawPalette = quantize(logical, q.algorithm, q.maxColors);
    palette = applyNormalization(rawPalette, recipe.normalization);
    indexed = remap(logical, palette);
  }
  throwIfAborted(input.signal);

  // 3. Materialize logical image + canvas preview.
  const pixelated = materializeIndexed(indexed, palette);
  throwIfAborted(input.signal);
  const preview = nearestScale(pixelated, recipe.canvas.w, recipe.canvas.h);
  throwIfAborted(input.signal);

  // 4. Extract palette with stable per-color counts.
  const extracted = withRgb(extractPalette(indexed), palette);

  const result: ResultImageSet = {
    pixelated,
    preview,
    palette: extracted,
    indexed,
    recipe,
  };
  return { result, warnings };
}

export function resolvedFitForCanvas(
  source: { w: number; h: number },
  canvasW: number,
  canvasH: number,
  mode: 'fit' | 'cover' | 'stretch',
): FitResult {
  return computeFit({
    canvas: { w: canvasW, h: canvasH },
    source,
    mode,
  });
}

export function fittedCanvas(input: {
  source: PixelBuffer;
  canvasW: number;
  canvasH: number;
  mode: 'fit' | 'cover' | 'stretch';
}): PixelBuffer {
  const fit = computeFit({
    canvas: { w: input.canvasW, h: input.canvasH },
    source: { w: input.source.width, h: input.source.height },
    mode: input.mode,
  });
  return applyFit(input.source, fit, { w: input.canvasW, h: input.canvasH });
}

function quantize(buf: PixelBuffer, alg: 'median-cut' | 'octree', maxColors: number): Rgb[] {
  if (alg === 'median-cut') return medianCut(buf.data, maxColors);
  return octreeQuantize(buf.data, maxColors);
}

function applyNormalization(palette: Rgb[], spec: Normalization): Rgb[] {
  return normalize(palette, spec);
}

function resolveEffectiveConfig(config: ProcessingConfig): ProcessingConfig {
  // Apply maxColorsAuto if user picked auto (they could also have left it manual).
  const shortcut = maxColorsAutoForLogical(config.logical.w, config.logical.h);
  const autoBound = Math.max(2, Math.min(256, shortcut));
  const maxColors = config.quantization.maxColors > 0 ? config.quantization.maxColors : autoBound;
  // Clamp into accepted range, prefer user's explicit value when in range.
  const clamped = Math.min(256, Math.max(2, maxColors));
  if (clamped === config.quantization.maxColors) return config;
  return {
    ...config,
    quantization: { ...config.quantization, maxColors: clamped },
  };
}

function throwIfAborted(signal?: AbortSignal): void {
  if (!signal) return;
  if (signal.aborted) {
    const err = new Error('pipeline aborted');
    err.name = 'AbortError';
    throw err;
  }
}

/**
 * Convenience for callers that want both the fitted canvas and the final
 * result. Composes `fittedCanvas` + `runPipeline` and forwards the signal.
 */
export function runFullPipeline(input: {
  source: PixelBuffer;
  config: ProcessingConfig;
  signal?: AbortSignal;
}): PipelineOutput | null {
  const fitted = fittedCanvas({
    source: input.source,
    canvasW: input.config.canvas.w,
    canvasH: input.config.canvas.h,
    mode: input.config.canvas.mode,
  });
  const forwarded: PipelineInput = {
    canvasFitted: fitted,
    config: input.config,
    ...(input.signal ? { signal: input.signal } : {}),
  };
  return runPipeline(forwarded);
}
