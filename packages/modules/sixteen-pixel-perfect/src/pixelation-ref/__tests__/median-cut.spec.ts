import { describe, expect, it } from 'vitest';
import { medianCut } from '../algorithms/median-cut';

describe('median-cut quantization', () => {
  it('returns at most maxColors entries', () => {
    const data = new Uint8ClampedArray(64 * 64 * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = (i * 7) % 256;
      data[i + 1] = (i * 11) % 256;
      data[i + 2] = (i * 13) % 256;
      data[i + 3] = 255;
    }
    const palette = medianCut(data, 8);
    expect(palette.length).toBeLessThanOrEqual(8);
    expect(palette.length).toBeGreaterThan(1);
  });

  it('produces deterministic output across runs', () => {
    const data = new Uint8ClampedArray(50 * 50 * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(Math.random() * 256);
      data[i + 1] = Math.floor(Math.random() * 256);
      data[i + 2] = Math.floor(Math.random() * 256);
      data[i + 3] = 255;
    }
    const a = medianCut(data, 16);
    const b = medianCut(data, 16);
    expect(a).toEqual(b);
  });

  it('honors maxColors = 2', () => {
    const data = new Uint8ClampedArray(8 * 8 * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = i % 256;
      data[i + 1] = i % 256;
      data[i + 2] = i % 256;
      data[i + 3] = 255;
    }
    const palette = medianCut(data, 2);
    expect(palette.length).toBe(2);
  });

  it('returns single color for monochrome input', () => {
    const data = new Uint8ClampedArray(10 * 10 * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 200;
      data[i + 1] = 100;
      data[i + 2] = 50;
      data[i + 3] = 255;
    }
    const palette = medianCut(data, 16);
    expect(palette.length).toBe(1);
    expect(palette[0]).toEqual([200, 100, 50]);
  });

  it('skips transparent pixels for color sampling', () => {
    const data = new Uint8ClampedArray(2 * 2 * 4);
    data[3] = 0;
    data[7] = 0;
    data[11] = 0;
    data[15] = 0;
    const palette = medianCut(data, 4);
    expect(palette).toEqual([[0, 0, 0]]);
  });

  it('sorts output by L* descending', () => {
    const data = new Uint8ClampedArray(3 * 1 * 4);
    data[0] = 50;
    data[1] = 50;
    data[2] = 50;
    data[3] = 255;
    data[4] = 200;
    data[5] = 200;
    data[6] = 200;
    data[7] = 255;
    data[8] = 100;
    data[9] = 100;
    data[10] = 100;
    data[11] = 255;
    const palette = medianCut(data, 3);
    expect(palette[0]![0]).toBeGreaterThanOrEqual(palette[1]![0]);
    expect(palette[1]![0]).toBeGreaterThanOrEqual(palette[2]![0]);
  });
});
