import { describe, expect, it } from 'vitest';
import { normalize } from '../algorithms/normalize';
import type { Rgb } from '../domain/config';

function rgb(n: number): Rgb {
  return [n & 0xff, (n * 7) & 0xff, (n * 11) & 0xff];
}

describe('palette normalization', () => {
  it('off mode returns identical palette (cloned)', () => {
    const pal: Rgb[] = [
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90],
    ];
    const out = normalize(pal, { mode: 'off' });
    expect(out).toEqual([
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90],
    ]);
  });

  it('down-to-8: produces a multiple of 8', () => {
    const pal: Rgb[] = [];
    for (let i = 0; i < 18; i += 1) pal.push(rgb(i * 10));
    const out = normalize(pal, { mode: 'down-to-8' });
    expect(out.length % 8).toBe(0);
    expect(out.length).toBeLessThanOrEqual(pal.length);
  });

  it('idempotent: applying twice produces same result', () => {
    const pal: Rgb[] = [];
    for (let i = 0; i < 20; i += 1) pal.push(rgb(i * 12));
    const once = normalize(pal, { mode: 'down-to-8' });
    const twice = normalize(once, { mode: 'down-to-8' });
    expect(twice).toEqual(once);
  });

  it('down-to step 4 yields multiple of 4', () => {
    const pal: Rgb[] = [];
    for (let i = 0; i < 9; i += 1) pal.push([i * 25, 0, 200 - i * 25]);
    const out = normalize(pal, { mode: 'down-to', step: 4 });
    expect(out.length % 4).toBe(0);
  });

  it('skips when palette already ≤ step', () => {
    const pal: Rgb[] = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const out = normalize(pal, { mode: 'down-to', step: 8 });
    expect(out).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it('merges closest pair first (smallest ΔE)', () => {
    const pal: Rgb[] = [
      [10, 10, 10],
      [11, 12, 13],
      [200, 50, 50],
    ];
    const out = normalize(pal, { mode: 'down-to', step: 2 });
    expect(out.length).toBe(2);
    const reds = out.find((c) => c[0] >= 150);
    expect(reds).toBeDefined();
  });
});
