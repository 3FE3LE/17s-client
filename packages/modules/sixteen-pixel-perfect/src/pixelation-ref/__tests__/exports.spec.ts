import { describe, expect, it } from 'vitest';
import { renderHex, encodeHexBytes } from '../exports/hex';
import { renderGpl, encodeGplBytes } from '../exports/gpl';
import { renderPalettePng, encodePalettePng } from '../exports/palette-png';
import { parseRecipeJson, serializeRecipeJson } from '../exports/recipe-io';
import { encodePng } from '../../export/png';
import type { PaletteColor } from '../domain/palette';
import type { ProcessingConfig } from '../domain/config';

const SAMPLE_PALETTE: PaletteColor[] = [
  { rgb: [255, 0, 0], count: 100, index: 0 },
  { rgb: [0, 255, 0], count: 50, index: 1 },
  { rgb: [0, 0, 255], count: 10, index: 2 },
];

describe('palette PNG', () => {
  it('renders a grid covering all colors', () => {
    const buf = renderPalettePng(SAMPLE_PALETTE, { cellSize: 16 });
    // 3 colors ⇒ ceil(sqrt(3)) = 2 cols ⇒ width = 32.
    expect(buf.width).toBe(32);
    expect(buf.height).toBe(32);
  });

  it('encodes to a valid PNG (magic + dimensions)', () => {
    const bytes = encodePalettePng(SAMPLE_PALETTE, { cellSize: 8 });
    expect(bytes[0]).toBe(0x89);
    expect(bytes[1]).toBe(0x50);
    // First chunk after signature is IHDR with width/height at offsets 16, 20 (big endian).
    const w = ((bytes[16]! << 24) | (bytes[17]! << 16) | (bytes[18]! << 8) | bytes[19]!) >>> 0;
    expect(w).toBeGreaterThan(0);
  });

  it('chip pixels match their palette entry', () => {
    const buf = renderPalettePng(SAMPLE_PALETTE, { cellSize: 4, cellsPerRow: 3 });
    // Top-left chip should be red (255, 0, 0).
    expect(buf.data[0]).toBe(255);
    expect(buf.data[1]).toBe(0);
    expect(buf.data[2]).toBe(0);
  });
});

describe('GPL palette', () => {
  it('starts with the canonical header', () => {
    const gpl = renderGpl(SAMPLE_PALETTE);
    expect(gpl.startsWith('GIMP Palette\nName: pixelation-ref\nColumns: 0\n#\n')).toBe(true);
  });

  it('contains one line per color with tab-separated RGB', () => {
    const gpl = renderGpl(SAMPLE_PALETTE);
    const lines = gpl.trimEnd().split('\n');
    expect(lines.length).toBe(SAMPLE_PALETTE.length + 4);
    expect(lines[4]).toContain('255\t0\t0');
  });

  it('byte encoding round-trips', () => {
    const bytes = encodeGplBytes(SAMPLE_PALETTE, 'unit-test');
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain('Name: unit-test');
  });
});

describe('HEX/TXT palette', () => {
  it('lists each color with hex and count', () => {
    const text = renderHex(SAMPLE_PALETTE);
    expect(text).toContain('#FF0000 (100 pixels)');
    expect(text).toContain('#00FF00 (50 pixels)');
    expect(text).toContain('#0000FF (10 pixels)');
  });

  it('byte output is deterministic across calls', () => {
    const a = encodeHexBytes(SAMPLE_PALETTE);
    const b = encodeHexBytes(SAMPLE_PALETTE);
    expect(Array.from(a)).toEqual(Array.from(b));
  });
});

describe('recipe JSON round-trip', () => {
  it('preserves the full ProcessingConfig across serialize/parse', () => {
    const sample: ProcessingConfig = {
      version: 1,
      canvas: { w: 320, h: 180, mode: 'fit' },
      logical: { w: 80, h: 45, mode: 'manual' },
      pixelation: { mode: 'median' },
      quantization: { algorithm: 'median-cut', maxColors: 32, seed: 0 },
      normalization: { mode: 'down-to-8' },
      dithering: { mode: 'floyd-steinberg', strength: 1 },
    };
    const bytes = serializeRecipeJson(sample);
    const text = new TextDecoder().decode(bytes);
    expect(text.trim().endsWith('}')).toBe(true);
    const reloaded = parseRecipeJson(bytes);
    expect(reloaded).toEqual(sample);
  });

  it('rejects malformed JSON', () => {
    expect(() => parseRecipeJson(new TextEncoder().encode('not json'))).toThrow();
  });
});

describe('exports determinism', () => {
  it('encodePng import is reachable from pipeline', () => {
    expect(typeof encodePng).toBe('function');
  });

  it('PNG encoder stable input ⇒ stable output', () => {
    const dummy = { width: 4, height: 4, data: new Uint8ClampedArray(64) };
    for (let i = 3; i < dummy.data.length; i += 4) dummy.data[i] = 255;
    for (let i = 0; i < dummy.data.length; i += 4) dummy.data[i] = i;
    const a = Array.from(encodePng(dummy));
    const b = Array.from(encodePng(dummy));
    expect(a).toEqual(b);
  });
});
