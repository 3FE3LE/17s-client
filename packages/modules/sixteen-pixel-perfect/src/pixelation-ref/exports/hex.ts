import type { PaletteColor } from '../domain/palette';

/**
 * HEX/TXT palette exporter. One color per line, count annotated so the
 * export is also useful as a reference when repainting in Pixelorama.
 *
 *   #RRGGBB (N pixels)
 *
 * Sorted by `count` desc; explicit `#RRGGBB` upper-case per convention.
 */

export function renderHex(palette: readonly PaletteColor[]): string {
  const lines: string[] = [];
  for (const entry of palette) {
    const hex = `#${toHex(entry.rgb[0])}${toHex(entry.rgb[1])}${toHex(entry.rgb[2])}`;
    lines.push(`${hex} (${entry.count} pixels)`);
  }
  return lines.join('\n') + '\n';
}

export function encodeHexBytes(palette: readonly PaletteColor[]): Uint8Array {
  return new TextEncoder().encode(renderHex(palette));
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0').toUpperCase();
}
