import { describe, expect, it } from 'vitest';
import { resample } from '../algorithms/resample';
import { createPixelBuffer } from '../../render/pixel-buffer';

function fillGradient(buf: ReturnType<typeof createPixelBuffer>): void {
  for (let y = 0; y < buf.height; y += 1) {
    for (let x = 0; x < buf.width; x += 1) {
      const i = (y * buf.width + x) * 4;
      buf.data[i] = Math.round((x / buf.width) * 255);
      buf.data[i + 1] = Math.round((y / buf.height) * 255);
      buf.data[i + 2] = 128;
      buf.data[i + 3] = 255;
    }
  }
}

describe('block resampler', () => {
  it('average mode preserves mean of a gradient', () => {
    const src = createPixelBuffer(64, 64);
    fillGradient(src);
    const out = resample(src, 8, 8, 'average');
    expect(out.width).toBe(8);
    expect(out.height).toBe(8);
    const i = (4 * out.width + 4) * 4;
    expect(out.data[i]).toBeGreaterThan(100);
    expect(out.data[i]).toBeLessThan(180);
  });

  it('median mode preserves median on a salt-and-pepper image', () => {
    const src = createPixelBuffer(20, 20);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 128;
      src.data[i + 1] = 128;
      src.data[i + 2] = 128;
      src.data[i + 3] = 255;
    }
    src.data[0] = 0;
    src.data[1] = 0;
    src.data[2] = 0;
    src.data[4] = 255;
    src.data[5] = 255;
    src.data[6] = 255;
    src.data[8] = 0;
    src.data[9] = 0;
    src.data[10] = 0;
    const out = resample(src, 4, 4, 'median');
    expect(out.data[0]).toBe(128);
  });

  it('dominant mode picks most frequent color', () => {
    const src = createPixelBuffer(10, 10);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 200;
      src.data[i + 1] = 100;
      src.data[i + 2] = 50;
      src.data[i + 3] = 255;
    }
    src.data[0] = 0;
    src.data[1] = 0;
    src.data[2] = 0;
    const out = resample(src, 1, 1, 'dominant');
    expect(out.data[0]).toBe(200);
  });

  it('three modes produce different outputs on the same input', () => {
    const src = createPixelBuffer(20, 20);
    fillGradient(src);
    const a = resample(src, 5, 5, 'average');
    const b = resample(src, 5, 5, 'median');
    const c = resample(src, 5, 5, 'dominant');
    let anyDiffAB = false;
    let anyDiffBC = false;
    for (let i = 0; i < a.data.length; i += 1) {
      if (a.data[i] !== b.data[i]) anyDiffAB = true;
      if (b.data[i] !== c.data[i]) anyDiffBC = true;
    }
    expect(anyDiffAB).toBe(true);
    expect(anyDiffBC).toBe(true);
  });

  it('respects exact logical dimensions', () => {
    const src = createPixelBuffer(100, 100);
    fillGradient(src);
    const out = resample(src, 16, 9, 'average');
    expect(out.width).toBe(16);
    expect(out.height).toBe(9);
    expect(out.data.length).toBe(16 * 9 * 4);
  });
});
