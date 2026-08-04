import type { PixelBuffer } from '../../render/pixel-buffer';
import type { ProcessingConfig } from './config';
import type { PaletteColor } from './palette';

/**
 * Pipeline output artifacts. Every field is required and matches a defined
 * invariant:
 *  - `pixelated` = the image at the logical (target) resolution.
 *  - `preview` = the image scaled to the canvas size (nearest-neighbor only).
 *  - `palette` = extracted color table with stable indices + counts.
 *  - `indexed` = logical image expressed as palette indices; preserves alpha
 *    via the sentinel defined in `./palette`.
 */
export interface ResultImageSet {
  readonly pixelated: PixelBuffer;
  readonly preview: PixelBuffer;
  readonly palette: readonly PaletteColor[];
  readonly indexed: IndexedImage;
  /** The exact config the pipeline ran with (post-normalization, post-clamp). */
  readonly recipe: ProcessingConfig;
}

/**
 * Logical-resolution image expressed as palette indices. Indices reference
 * `recipe.quantization.maxColors` slots; the transparent sentinel
 * `TRANSPARENT_INDEX` (0xffffffff) is reserved for alpha = 0 pixels and
 * never collides with a real palette slot.
 */
export interface IndexedImage {
  readonly width: number;
  readonly height: number;
  readonly indices: Uint32Array;
}
