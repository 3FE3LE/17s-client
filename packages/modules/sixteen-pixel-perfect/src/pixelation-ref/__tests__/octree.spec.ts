import { describe, expect, it } from 'vitest';
import { octreeQuantize } from '../algorithms/octree';

function fillPseudoRandom(data: Uint8ClampedArray, seed: number): void {
  // xorshift32 — deterministic across runs.
  let s = seed | 0 || 1;
  for (let i = 0; i < data.length; i += 4) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    const v = s >>> 0;
    data[i] = v & 0xff;
    data[i + 1] = (v >>> 8) & 0xff;
    data[i + 2] = (v >>> 16) & 0xff;
    data[i + 3] = 255;
  }
}

describe('octree quantization', () => {
  it('returns ≤ maxColors entries', () => {
    const data = new Uint8ClampedArray(40 * 40 * 4);
    fillPseudoRandom(data, 42);
    const palette = octreeQuantize(data, 8);
    expect(palette.length).toBeLessThanOrEqual(8);
  });

  it('is deterministic across runs', () => {
    const a = new Uint8ClampedArray(30 * 30 * 4);
    const b = new Uint8ClampedArray(30 * 30 * 4);
    fillPseudoRandom(a, 7);
    fillPseudoRandom(b, 7);
    expect(octreeQuantize(a, 16)).toEqual(octreeQuantize(b, 16));
  });

  it('handles monochrome input', () => {
    const data = new Uint8ClampedArray(5 * 5 * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 12;
      data[i + 1] = 200;
      data[i + 2] = 80;
      data[i + 3] = 255;
    }
    const palette = octreeQuantize(data, 16);
    expect(palette).toEqual([[12, 200, 80]]);
  });

  it('returns [0,0,0] for all-transparent input', () => {
    const data = new Uint8ClampedArray(4 * 4 * 4);
    for (let i = 0; i < data.length; i += 4) data[i + 3] = 0;
    expect(octreeQuantize(data, 8)).toEqual([[0, 0, 0]]);
  });

  it('produces ≥ 2 entries on multi-color input', () => {
    const data = new Uint8ClampedArray(20 * 20 * 4);
    for (let i = 0; i < data.length; i += 4) {
      // Two clusters: warm and cool.
      data[i] = i % 8 === 0 ? 255 : 0;
      data[i + 1] = i % 8 === 0 ? 0 : 255;
      data[i + 2] = i % 8 === 0 ? 0 : 255;
      data[i + 3] = 255;
    }
    const palette = octreeQuantize(data, 4);
    expect(palette.length).toBeGreaterThanOrEqual(2);
  });

  it('sorted by L* desc', () => {
    const data = new Uint8ClampedArray(3 * 1 * 4);
    data[0] = 30;
    data[1] = 30;
    data[2] = 30;
    data[3] = 255;
    data[4] = 200;
    data[5] = 200;
    data[6] = 200;
    data[7] = 255;
    data[8] = 100;
    data[9] = 100;
    data[10] = 100;
    data[11] = 255;
    const palette = octreeQuantize(data, 3);
    expect(palette[0]![0]).toBeGreaterThanOrEqual(palette[1]![0]);
    expect(palette[1]![0]).toBeGreaterThanOrEqual(palette[2]![0]);
  });
});
