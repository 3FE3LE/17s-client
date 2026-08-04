/**
 * Pixelation Reference Tool — barrel exports.
 *
 * Public surface for the web app and consumer tooling. Internal algorithm
 * modules are reachable via sub-paths if needed but most consumers should
 * only need the pipeline + exporters.
 */

export type {
  ProcessingConfig,
  Normalization,
  FitMode,
  FocalPoint,
  LogicalMode,
  BlockMode,
  QuantAlgorithm,
  DitherMode,
  Rgb,
} from './domain/config';
export {
  DEFAULT_FOCAL_POINT,
  LOGICAL_PRESETS,
  LOGICAL_PRESETS_16_9,
  LOGICAL_PRESETS_1_1,
  PROCESSING_CONFIG_SCHEMA,
  PROCESSING_CONFIG_VERSION,
  maxColorsAutoForLogical,
  safeParseProcessingConfig,
  validateProcessingConfig,
} from './domain/config';

export type { PaletteColor } from './domain/palette';
export {
  TRANSPARENT_INDEX,
  countTransparentPixels,
  extractPalette,
  withRgb,
} from './domain/palette';

export type { IndexedImage, ResultImageSet } from './domain/result';

export type { DitherMode as DitherModeAlgo } from './algorithms/dither';

export { dither } from './algorithms/dither';
export { resample } from './algorithms/resample';
export { medianCut } from './algorithms/median-cut';
export { octreeQuantize } from './algorithms/octree';
export { normalize } from './algorithms/normalize';
export { materializeIndexed, nearestScale, remap } from './algorithms/remap';
export { applyFit, computeFit } from './algorithms/fit';
export { fillLabFromRgba, labFromSrgb, labOf } from './algorithms/color/lab';

export {
  runPipeline,
  runFullPipeline,
  fittedCanvas,
  resolvedFitForCanvas,
  type PipelineInput,
  type PipelineOutput,
} from './pipeline/index';

export { renderPalettePng, encodePalettePng } from './exports/palette-png';
export { renderGpl, encodeGplBytes } from './exports/gpl';
export { renderHex, encodeHexBytes } from './exports/hex';
export { parseRecipeJson, serializeRecipeJson } from './exports/recipe-io';
export { buildPixelationBundle, type BundleInput } from './exports/bundle';
