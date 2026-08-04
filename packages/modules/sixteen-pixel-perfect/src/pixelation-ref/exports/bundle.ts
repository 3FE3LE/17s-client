import { encodeZip, type ZipEntry } from '../../export/zip';
import { encodePng } from '../../export/png';
import { encodePalettePng } from './palette-png';
import { encodeGplBytes } from './gpl';
import { encodeHexBytes } from './hex';
import { serializeRecipeJson } from './recipe-io';
import type { ProcessingConfig } from '../domain/config';
import type { PaletteColor } from '../domain/palette';
import type { PixelBuffer } from '../../render/pixel-buffer';

/**
 * Compose the final Pixelation Reference bundle ZIP — six files, no
 * compression (mirrors Godot bundle layout):
 *
 *   pixelated.png        — image at logical resolution.
 *   preview.png          — nearest-neighbor scaled to canvas size.
 *   palette.png          — visual palette grid.
 *   palette.gpl          — GIMP palette format (for Aseprite / GIMP).
 *   palette.hex          — TXT/HEX listing with per-color pixel counts.
 *   recipe.json          — full ProcessingConfig (round-trippable).
 *
 * Filenames are stable so consumers can hash by name. Output is byte-
 * deterministic for a given payload (PNG encoder + ZIP encoder are both
 * STORE-only).
 *
 * Pure. Caller owns file I/O.
 */

export interface BundleInput {
  readonly config: ProcessingConfig;
  readonly pixelated: PixelBuffer;
  readonly preview: PixelBuffer;
  readonly palette: readonly PaletteColor[];
  readonly bundleName?: string;
}

export function buildPixelationBundle(input: BundleInput): Uint8Array {
  const name = input.bundleName ?? 'pixelation-ref';
  const entries: ZipEntry[] = [
    { path: 'pixelated.png', bytes: encodePng(input.pixelated) },
    { path: 'preview.png', bytes: encodePng(input.preview) },
    { path: 'palette.png', bytes: encodePalettePng(input.palette) },
    { path: 'palette.gpl', bytes: encodeGplBytes(input.palette, name) },
    { path: 'palette.hex', bytes: encodeHexBytes(input.palette) },
    { path: 'recipe.json', bytes: serializeRecipeJson(input.config) },
  ];
  return encodeZip(entries);
}
