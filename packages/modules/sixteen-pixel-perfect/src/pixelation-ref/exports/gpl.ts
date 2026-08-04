import type { PaletteColor } from '../domain/palette';

/**
 * GIMP Palette (.gpl) format exporter.
 *
 *   GIMP Palette
 *   Name: <name>
 *   Columns: 0
 *   #
 *   <R>\t<G>\t<B>\t<name?>
 *
 * Tab-separated RGB values. Header lines mandatory for the file to be
 * recognised by GIMP and Aseprite's GPL loader. `Columns: 0` lets the
 * importer decide grid layout. We use trailing whitespace to separate
 * channels for max compatibility across viewers.
 *
 * Sorted by `count` desc to match the UI default.
 */

export function renderGpl(palette: readonly PaletteColor[], name = 'pixelation-ref'): string {
  const lines: string[] = ['GIMP Palette', `Name: ${name}`, 'Columns: 0', '#'];
  for (const entry of palette) {
    lines.push(`${entry.rgb[0]}\t${entry.rgb[1]}\t${entry.rgb[2]}\t${nameableId(entry)}`);
  }
  return lines.join('\n') + '\n';
}

function nameableId(entry: PaletteColor): string {
  const hex = `#${toHex(entry.rgb[0])}${toHex(entry.rgb[1])}${toHex(entry.rgb[2])}`;
  return `${hex} (n=${entry.count})`;
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0').toUpperCase();
}

export function encodeGplBytes(palette: readonly PaletteColor[], name?: string): Uint8Array {
  return new TextEncoder().encode(renderGpl(palette, name));
}
