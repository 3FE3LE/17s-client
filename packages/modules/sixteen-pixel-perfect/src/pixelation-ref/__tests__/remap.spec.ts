import { describe, expect, it } from 'vitest';
import { materializeIndexed, nearestScale, remap } from '../algorithms/remap';
import {
  extractPalette,
  withRgb,
  countTransparentPixels,
  TRANSPARENT_INDEX,
} from '../domain/palette';
import { createPixelBuffer } from '../../render/pixel-buffer';
import type { Rgb } from '../domain/config';

describe('remap + extract + scale', () => {
  it('remap assigns correct palette slots', () => {
    const src = createPixelBuffer(2, 2);
    src.data[0] = 0;
    src.data[1] = 0;
    src.data[2] = 0;
    src.data[3] = 255;
    src.data[4] = 255;
    src.data[5] = 255;
    src.data[6] = 255;
    src.data[7] = 255;
    src.data[8] = 128;
    src.data[9] = 0;
    src.data[10] = 0;
    src.data[11] = 255;
    src.data[12] = 0;
    src.data[13] = 128;
    src.data[14] = 0;
    src.data[15] = 255;
    const palette: Rgb[] = [
      [0, 0, 0],
      [255, 255, 255],
    ];
    const idx = remap(src, palette);
    expect(idx.indices[0]).toBe(0);
    expect(idx.indices[1]).toBe(1);
  });

  it('transparent pixels map to sentinel, never a palette slot', () => {
    const src = createPixelBuffer(1, 1);
    src.data[3] = 0;
    const palette: Rgb[] = [[10, 20, 30]];
    const idx = remap(src, palette);
    expect(idx.indices[0]).toBe(TRANSPARENT_INDEX);
  });

  it('materializeIndexed writes palette RGBA into a buffer', () => {
    const src = createPixelBuffer(1, 1);
    src.data[0] = 255;
    src.data[1] = 255;
    src.data[2] = 0;
    src.data[3] = 255;
    const palette: Rgb[] = [
      [0, 0, 0],
      [255, 255, 0],
    ];
    const idx = remap(src, palette);
    const mat = materializeIndexed(idx, palette);
    expect(mat.data[0]).toBe(255);
    expect(mat.data[1]).toBe(255);
    expect(mat.data[2]).toBe(0);
    expect(mat.data[3]).toBe(255);
  });

  it('extractPalette sums counts equal to non-transparent pixel count', () => {
    const src = createPixelBuffer(2, 2);
    // 3 red, 1 transparent.
    src.data[0] = 255;
    src.data[1] = 0;
    src.data[2] = 0;
    src.data[3] = 255;
    src.data[4] = 255;
    src.data[5] = 0;
    src.data[6] = 0;
    src.data[7] = 255;
    src.data[8] = 255;
    src.data[9] = 0;
    src.data[10] = 0;
    src.data[11] = 255;
    src.data[15] = 0;
    const palette: Rgb[] = [
      [255, 0, 0],
      [0, 0, 0],
    ];
    const idx = remap(src, palette);
    const ext = withRgb(extractPalette(idx), palette);
    const total = ext.reduce((s, e) => s + e.count, 0);
    expect(total).toBe(3);
    expect(countTransparentPixels(idx)).toBe(1);
  });

  it('extractPalette sort: count desc, index asc on ties', () => {
    const indices = new Uint32Array([0, 1, 1, 2, 2, 2]);
    const idx = { width: 6, height: 1, indices };
    const ext = extractPalette(idx);
    expect(ext[0]!.index).toBe(2);
    expect(ext[1]!.index).toBe(1);
    expect(ext[2]!.index).toBe(0);
  });

  it('nearestScale preserves pixel boundaries (no smoothing)', () => {
    const src = createPixelBuffer(2, 2);
    // Source layout: [red, black; black, red]
    src.data[0] = 255;
    src.data[3] = 255; // (0,0) red
    src.data[4] = 0;
    src.data[7] = 255; // (1,0) black
    src.data[8] = 0;
    src.data[11] = 255; // (0,1) black
    src.data[12] = 255;
    src.data[15] = 255; // (1,1) red
    const out = nearestScale(src, 4, 4);
    expect(out.width).toBe(4);
    expect(out.height).toBe(4);
    // dst (0,0) ⇒ src floor((0/4)*2)=0 ⇒ red.
    expect(out.data[0]).toBe(255);
    // dst (1,0) ⇒ src (0,0) red.
    expect(out.data[(4 + 1) * 4]).toBe(255);
    // dst (2,1) ⇒ src (1,0) black.
    expect(out.data[(4 + 2) * 4]).toBe(0);
    // dst (3,3) ⇒ src (1,1) red.
    expect(out.data[(12 + 3) * 4]).toBe(255);
  });

  it('nearestScale from 1x1 to 8x8 fills whole buffer with the source color', () => {
    const src = createPixelBuffer(1, 1);
    src.data[0] = 80;
    src.data[1] = 40;
    src.data[2] = 200;
    src.data[3] = 255;
    const out = nearestScale(src, 8, 8);
    for (let i = 0; i < out.data.length; i += 4) {
      expect(out.data[i]).toBe(80);
      expect(out.data[i + 1]).toBe(40);
      expect(out.data[i + 2]).toBe(200);
    }
  });
});
