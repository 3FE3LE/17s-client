import { describe, expect, it } from 'vitest';
import { applyFit, computeFit } from '../algorithms/fit';
import { createPixelBuffer } from '../../render/pixel-buffer';

describe('fit engine', () => {
  it('fit mode preserves aspect and adds padding area', () => {
    const r = computeFit({
      canvas: { w: 100, h: 100 },
      source: { w: 200, h: 50 },
      mode: 'fit',
    });
    if (r.mode === 'stretch') throw new Error('expected fit result');
    expect(r.mode).toBe('fit');
    expect(r.placedW).toBe(100);
    expect(r.placedH).toBe(25);
    expect(r.offsetY).toBeGreaterThan(0);
    expect(r.offsetX).toBe(0);
  });

  it('cover mode fills canvas with crop', () => {
    const r = computeFit({
      canvas: { w: 100, h: 100 },
      source: { w: 200, h: 50 },
      mode: 'cover',
    });
    if (r.mode === 'stretch') throw new Error('expected cover result');
    expect(r.mode).toBe('cover');
    // Source aspect > canvas aspect ⇒ scale chosen by height. placedH equals
    // canvas height; placedW may exceed canvas width (overflow is cropped).
    expect(r.placedH).toBe(100);
    expect(r.placedW).toBeGreaterThanOrEqual(100);
    expect(r.crop.w).toBeLessThan(200);
  });

  it('stretch mode covers full canvas, no crop', () => {
    const r = computeFit({
      canvas: { w: 100, h: 100 },
      source: { w: 200, h: 50 },
      mode: 'stretch',
    });
    expect(r.mode).toBe('stretch');
    expect(r.placedW).toBe(100);
    expect(r.placedH).toBe(100);
  });

  it('fit handles square source in landscape canvas', () => {
    const r = computeFit({
      canvas: { w: 320, h: 180 },
      source: { w: 100, h: 100 },
      mode: 'fit',
    });
    if (r.mode === 'stretch') throw new Error('expected fit result');
    expect(r.placedH).toBe(180);
    expect(r.placedW).toBe(180);
  });

  it('applyFit stretch lays out every pixel', () => {
    const src = createPixelBuffer(10, 5);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 200;
      src.data[i + 3] = 255;
    }
    const fit = computeFit({
      canvas: { w: 100, h: 100 },
      source: { w: 10, h: 5 },
      mode: 'stretch',
    });
    const out = applyFit(src, fit, { w: 100, h: 100 });
    expect(out.width).toBe(100);
    expect(out.height).toBe(100);
    let nonZero = 0;
    for (let i = 0; i < out.data.length; i += 1) if (out.data[i] !== 0) nonZero += 1;
    expect(nonZero).toBeGreaterThan(0);
  });

  it('applyFit on transparency leaves padding transparent', () => {
    const src = createPixelBuffer(20, 4);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 200;
      src.data[i + 3] = 255;
    }
    const fit = computeFit({ canvas: { w: 30, h: 30 }, source: { w: 20, h: 4 }, mode: 'fit' });
    const out = applyFit(src, fit, { w: 30, h: 30 });
    const cornerAlpha = out.data[3];
    expect(cornerAlpha).toBe(0);
  });
});
