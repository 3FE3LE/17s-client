import type { PaletteColor } from '../domain/palette';
import { encodePng } from '../../export/png';
import { createPixelBuffer, type PixelBuffer } from '../../render/pixel-buffer';

/**
 * Compose a visual palette PNG: a grid of square chips with one chip per
 * palette color. Sorted by `count` desc (matches the UI default).
 *
 *   cell = 32 × 32 px
 *   cols = ceil(sqrt(n))
 *   rows = ceil(n / cols)
 *
 * Empty cells after the last color are filled with a neutral mid-gray so
 * the palette is a single complete grid even for small palettes.
 */

const CELL = 32;
const EMPTY_FILL: [number, number, number, number] = [40, 40, 40, 255];

export interface PalettePngOptions {
  readonly cellsPerRow?: number;
  readonly cellSize?: number;
}

export function renderPalettePng(
  palette: readonly PaletteColor[],
  opts: PalettePngOptions = {},
): PixelBuffer {
  const cell = opts.cellSize ?? CELL;
  const cols = opts.cellsPerRow ?? Math.max(1, Math.ceil(Math.sqrt(Math.max(1, palette.length))));
  const rows = Math.max(1, Math.ceil(Math.max(1, palette.length) / cols));
  const buf = createPixelBuffer(cols * cell, rows * cell);
  // Fill with empty marker.
  const totalBytes = buf.data.length;
  for (let i = 0; i < totalBytes; i += 4) {
    buf.data[i] = EMPTY_FILL[0];
    buf.data[i + 1] = EMPTY_FILL[1];
    buf.data[i + 2] = EMPTY_FILL[2];
    buf.data[i + 3] = EMPTY_FILL[3];
  }
  // Draw chips.
  for (let i = 0; i < palette.length; i += 1) {
    const entry = palette[i]!;
    const cx = (i % cols) * cell;
    const cy = Math.floor(i / cols) * cell;
    for (let dy = 0; dy < cell; dy += 1) {
      for (let dx = 0; dx < cell; dx += 1) {
        const di = ((cy + dy) * buf.width + (cx + dx)) * 4;
        buf.data[di] = entry.rgb[0];
        buf.data[di + 1] = entry.rgb[1];
        buf.data[di + 2] = entry.rgb[2];
        buf.data[di + 3] = 255;
      }
    }
  }
  return buf;
}

export function encodePalettePng(
  palette: readonly PaletteColor[],
  opts?: PalettePngOptions,
): Uint8Array {
  return encodePng(renderPalettePng(palette, opts));
}
