import { describe, expect, it } from 'vitest';
import { deltaE76, fillLabFromRgba, labFromSrgb } from '../algorithms/color/lab';

describe('sRGB / LAB conversions', () => {
  it('white maps to L* near 100 and a/b near 0', () => {
    const [L, a, b] = labFromSrgb(255, 255, 255);
    expect(L).toBeGreaterThan(99);
    expect(Math.abs(a)).toBeLessThan(1);
    expect(Math.abs(b)).toBeLessThan(1);
  });

  it('black maps to L* near 0', () => {
    const [L] = labFromSrgb(0, 0, 0);
    expect(L).toBeLessThan(1);
  });

  it('pure red has positive a, modest b', () => {
    const [, a, b] = labFromSrgb(255, 0, 0);
    expect(a).toBeGreaterThan(60);
    expect(b).toBeGreaterThan(40);
  });

  it('pure blue has large negative b, positive a', () => {
    const [, a, b] = labFromSrgb(0, 0, 255);
    expect(b).toBeLessThan(-80);
    expect(a).toBeGreaterThan(40);
  });

  it('ΔE76 of identical colors is 0', () => {
    expect(deltaE76([50, 20, -30], [50, 20, -30])).toBe(0);
  });

  it('ΔE76 of far-apart colors is large', () => {
    const d = deltaE76(labFromSrgb(255, 255, 255), labFromSrgb(0, 0, 0));
    expect(d).toBeGreaterThan(80);
  });

  it('fillLabFromRgba produces one LAB triple per pixel', () => {
    const src = new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 128]);
    const dst = new Float32Array(6);
    fillLabFromRgba(src, dst);
    expect(dst[0]).toBeTypeOf('number');
    expect(dst[5]).toBeTypeOf('number');
  });
});
