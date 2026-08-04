import { z } from 'zod';

/**
 * Pixelation Reference Tool — domain configuration.
 *
 * Self-contained and serializable: a `ProcessingConfig` JSON is enough to
 * reproduce the same result deterministically (same input image + same recipe
 * + same seed ⇒ byte-identical PNG). The module is pure: no React, no DOM,
 * no I/O. All limits are integers; everything is reproducible.
 *
 * Invariants enforced by Zod:
 *  - logical width/height ≥ 8 (sanity floor for "pixel art" granularity).
 *  - max colors ∈ [8, 256] (auto clamp) or [2, 256] (manual override).
 *  - canvas / logical aspect may differ; pipeline surfaces a warning, no
 *    rejection — non-integer pixel scaling is allowed but flagged in UI.
 */

export const RGB_SCHEMA = z.tuple([
  z.number().int().min(0).max(255),
  z.number().int().min(0).max(255),
  z.number().int().min(0).max(255),
]);
export type Rgb = z.infer<typeof RGB_SCHEMA>;

export const FIT_MODE_SCHEMA = z.enum(['fit', 'cover', 'stretch']);
export type FitMode = z.infer<typeof FIT_MODE_SCHEMA>;

/** Focal point for cover mode crop. (0,0)=top-left, (1,1)=bottom-right. */
export const FOCAL_POINT_SCHEMA = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});
export type FocalPoint = z.infer<typeof FOCAL_POINT_SCHEMA>;
export const DEFAULT_FOCAL_POINT: FocalPoint = { x: 0.5, y: 0.5 };

export const LOGICAL_MODE_SCHEMA = z.enum(['auto', 'manual']);
export type LogicalMode = z.infer<typeof LOGICAL_MODE_SCHEMA>;

export const BLOCK_MODE_SCHEMA = z.enum(['average', 'median', 'dominant']);
export type BlockMode = z.infer<typeof BLOCK_MODE_SCHEMA>;

export const QUANT_ALG_SCHEMA = z.enum(['median-cut', 'octree']);
// kmeans deliberately deferred to V2 — see memory project/sixteen-pp-pixelation-ref
export type QuantAlgorithm = z.infer<typeof QUANT_ALG_SCHEMA>;

export const DITHER_MODE_SCHEMA = z.enum(['none', 'floyd-steinberg', 'bayer']);
export type DitherMode = z.infer<typeof DITHER_MODE_SCHEMA>;

export const NORMALIZATION_SCHEMA = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('off') }),
  z.object({ mode: z.literal('down-to-8') }),
  z.object({ mode: z.literal('down-to'), step: z.number().int().min(2).max(256) }),
]);
export type Normalization = z.infer<typeof NORMALIZATION_SCHEMA>;

const integerDimension = (max: number) => z.number().int().min(8).max(max);

export const PROCESSING_CONFIG_SCHEMA = z.object({
  version: z.literal(1),
  source: z
    .object({
      mime: z.string().min(1),
      width: z.number().int().min(1).max(32768),
      height: z.number().int().min(1).max(32768),
    })
    .optional(),
  canvas: z.object({
    w: integerDimension(4096),
    h: integerDimension(4096),
    mode: FIT_MODE_SCHEMA,
    focalPoint: FOCAL_POINT_SCHEMA.optional(),
  }),
  logical: z.object({
    w: integerDimension(2048),
    h: integerDimension(2048),
    mode: LOGICAL_MODE_SCHEMA,
  }),
  pixelation: z.object({ mode: BLOCK_MODE_SCHEMA }),
  quantization: z.object({
    algorithm: QUANT_ALG_SCHEMA,
    maxColors: z.number().int().min(2).max(256),
    seed: z.number().int().min(0).default(0),
  }),
  normalization: NORMALIZATION_SCHEMA,
  dithering: z.object({
    mode: DITHER_MODE_SCHEMA,
    strength: z.number().min(0).max(1).default(1),
  }),
});
export type ProcessingConfig = z.infer<typeof PROCESSING_CONFIG_SCHEMA>;

export const PROCESSING_CONFIG_VERSION = 1 as const;

/** Validate raw input (e.g. JSON loaded from URL/storage). Throws on invalid. */
export function validateProcessingConfig(input: unknown): ProcessingConfig {
  return PROCESSING_CONFIG_SCHEMA.parse(input);
}

/** Safe-parse variant. Useful for re-hydrating URL state where partial data is OK. */
export function safeParseProcessingConfig(input: unknown) {
  return PROCESSING_CONFIG_SCHEMA.safeParse(input);
}

/**
 * `maxColorsAuto` formula: clamp(floor(min(W, H)_logical / 2), 8, 256).
 * Hard ceiling 256 keeps 8-bit RGBA palette viable. Hard floor 8 stops
 * degenerate palettes on tiny logical grids.
 */
export function maxColorsAutoForLogical(w: number, h: number): number {
  const shortest = Math.min(w, h);
  const raw = Math.floor(shortest / 2);
  return Math.min(256, Math.max(8, raw));
}

/** Suggested logical presets for a 16:9 canvas. Mirrored for vertical too. */
export const LOGICAL_PRESETS_16_9 = [
  { label: '640×360', w: 640, h: 360 },
  { label: '320×180', w: 320, h: 180 },
  { label: '256×144', w: 256, h: 144 },
  { label: '160×90', w: 160, h: 90 },
] as const;

export const LOGICAL_PRESETS_1_1 = [
  { label: '256×256', w: 256, h: 256 },
  { label: '128×128', w: 128, h: 128 },
  { label: '64×64', w: 64, h: 64 },
  { label: '32×32', w: 32, h: 32 },
] as const;

export const LOGICAL_PRESETS = [...LOGICAL_PRESETS_16_9, ...LOGICAL_PRESETS_1_1] as const;
