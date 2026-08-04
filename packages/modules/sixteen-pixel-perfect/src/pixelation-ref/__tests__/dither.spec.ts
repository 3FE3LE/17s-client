import { describe, expect, it } from 'vitest';
import { dither } from '../algorithms/dither';
import { createPixelBuffer } from '../../render/pixel-buffer';
import { TRANSPARENT_INDEX } from '../domain/palette';
import type { Rgb } from '../domain/config';

describe('dithering', () => {
  it('none mode produces stable nearest-color indices', () => {
    const src = createPixelBuffer(2, 2);
    src.data[0] = 100;
    src.data[1] = 100;
    src.data[2] = 100;
    src.data[3] = 255;
    src.data[4] = 100;
    src.data[5] = 100;
    src.data[6] = 100;
    src.data[7] = 255;
    src.data[8] = 100;
    src.data[9] = 100;
    src.data[10] = 100;
    src.data[11] = 255;
    src.data[12] = 100;
    src.data[13] = 100;
    src.data[14] = 100;
    src.data[15] = 255;
    const palette: Rgb[] = [
      [0, 0, 0],
      [255, 255, 255],
    ];
    const idx = dither(src, palette, 'none');
    expect(idx.width).toBe(2);
    expect(idx.height).toBe(2);
    expect(idx.indices.length).toBe(4);
    expect(idx.indices[0]).toBe(0);
  });

  it('floyd-steinberg differs from none on a gradient', () => {
    const src = createPixelBuffer(16, 1);
    for (let x = 0; x < 16; x += 1) {
      const v = Math.round((x / 15) * 255);
      const i = x * 4;
      src.data[i] = v;
      src.data[i + 1] = v;
      src.data[i + 2] = v;
      src.data[i + 3] = 255;
    }
    const palette: Rgb[] = [
      [0, 0, 0],
      [255, 255, 255],
    ];
    const none = dither(src, palette, 'none');
    const fs = dither(src, palette, 'floyd-steinberg');
    let anyDiff = false;
    for (let i = 0; i < none.indices.length; i += 1) {
      if (none.indices[i] !== fs.indices[i]) anyDiff = true;
    }
    expect(anyDiff).toBe(true);
  });

  it('bayer differs from none', () => {
    const src = createPixelBuffer(8, 8);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 128;
      src.data[i + 1] = 128;
      src.data[i + 2] = 128;
      src.data[i + 3] = 255;
    }
    const palette: Rgb[] = [
      [0, 0, 0],
      [255, 255, 255],
    ];
    const none = dither(src, palette, 'none');
    const bayer = dither(src, palette, 'bayer');
    // 50% gray maps to one or the other depending on threshold modulation.
    let anyDiff = false;
    for (let i = 0; i < none.indices.length; i += 1) {
      if (none.indices[i] !== bayer.indices[i]) anyDiff = true;
    }
    expect(anyDiff).toBe(true);
  });

  it('transparent pixels keep the sentinel', () => {
    const src = createPixelBuffer(4, 1);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 100;
      src.data[i + 3] = 0; // fully transparent
    }
    const palette: Rgb[] = [[10, 20, 30]];
    const idx = dither(src, palette, 'none');
    for (let i = 0; i < idx.indices.length; i += 1) {
      expect(idx.indices[i]).toBe(TRANSPARENT_INDEX);
    }
  });

  it('produces identical output across runs (deterministic)', () => {
    const src = createPixelBuffer(16, 16);
    let s = 1234;
    for (let i = 0; i < src.data.length; i += 4) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      src.data[i] = s & 0xff;
      src.data[i + 1] = (s >>> 8) & 0xff;
      src.data[i + 2] = (s >>> 16) & 0xff;
      src.data[i + 3] = 255;
    }
    const palette: Rgb[] = [
      [0, 0, 0],
      [128, 128, 128],
      [255, 255, 255],
    ];
    const a = dither(src, palette, 'floyd-steinberg');
    const b = dither(src, palette, 'floyd-steinberg');
    expect(Array.from(a.indices)).toEqual(Array.from(b.indices));
  });
});
