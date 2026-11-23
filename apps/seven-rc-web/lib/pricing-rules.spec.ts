import { describe, expect, it } from 'vitest';
import {
  effectiveBands,
  findOverlaps,
  resolveSlotPrice,
  validateRule,
  type PriceRuleInput,
} from './pricing-rules';

const rule = (o: Partial<PriceRuleInput> = {}): PriceRuleInput => ({
  daysOfWeek: [5, 6],
  startTime: '19:00',
  endTime: '22:00',
  priceMinor: 15_000_000,
  ...o,
});

describe('resolveSlotPrice (same cases as the server)', () => {
  const rules = [
    rule(),
    rule({ daysOfWeek: [0], startTime: '22:00', endTime: '00:00', priceMinor: 1 }),
  ];
  it('uses the rule on matching day and start, end exclusive', () => {
    expect(resolveSlotPrice(100, rules, 5, 19 * 60)).toBe(15_000_000);
    expect(resolveSlotPrice(100, rules, 5, 21 * 60 + 59)).toBe(15_000_000);
    expect(resolveSlotPrice(100, rules, 5, 22 * 60)).toBe(100);
  });
  it('falls back to base on other days or before the window', () => {
    expect(resolveSlotPrice(100, rules, 1, 20 * 60)).toBe(100);
    expect(resolveSlotPrice(100, rules, 5, 18 * 60)).toBe(100);
  });
  it('treats 00:00 end as midnight and first match wins', () => {
    expect(resolveSlotPrice(100, rules, 0, 23 * 60)).toBe(1);
    expect(
      resolveSlotPrice(100, [rule({ priceMinor: 7 }), rule({ priceMinor: 9 })], 5, 20 * 60),
    ).toBe(7);
  });
});

describe('validateRule', () => {
  it('accepts a valid rule and midnight end', () => {
    expect(validateRule(rule())).toBeNull();
    expect(validateRule(rule({ endTime: '00:00' }))).toBeNull();
  });
  it('rejects empty days, bad times, inverted range and bad price', () => {
    expect(validateRule(rule({ daysOfWeek: [] }))).toMatch(/día/);
    expect(validateRule(rule({ startTime: '' }))).toMatch(/hora/);
    expect(validateRule(rule({ endTime: '18:00' }))).toMatch(/posterior/);
    expect(validateRule(rule({ priceMinor: -1 }))).toMatch(/precio/);
  });
});

describe('findOverlaps', () => {
  it('flags same day and overlapping time only', () => {
    const rules = [
      rule(),
      rule({ daysOfWeek: [6], startTime: '21:00', endTime: '23:00' }),
      rule({ daysOfWeek: [1], startTime: '19:00', endTime: '22:00' }),
      rule({ daysOfWeek: [5], startTime: '22:00', endTime: '00:00' }),
    ];
    expect(findOverlaps(rules)).toEqual([[0, 1]]);
  });
  it('adjacent ranges do not overlap', () => {
    expect(findOverlaps([rule(), rule({ startTime: '22:00', endTime: '23:00' })])).toEqual([]);
  });
  it('midnight end overlaps late rules', () => {
    expect(
      findOverlaps([
        rule({ startTime: '22:00', endTime: '00:00' }),
        rule({ startTime: '23:00', endTime: '00:00' }),
      ]),
    ).toEqual([[0, 1]]);
  });
});

describe('effectiveBands', () => {
  it('merges consecutive slots with the same price', () => {
    const bands = effectiveBands({
      basePriceMinor: 100,
      rules: [rule({ daysOfWeek: [5], startTime: '19:00', endTime: '21:00', priceMinor: 200 })],
      dayOfWeek: 5,
      openTime: '17:00',
      closeTime: '22:00',
      slotMinutes: 60,
    });
    expect(bands).toEqual([
      { from: '17:00', to: '19:00', priceMinor: 100 },
      { from: '19:00', to: '21:00', priceMinor: 200 },
      { from: '21:00', to: '22:00', priceMinor: 100 },
    ]);
  });
  it('drops a partial last slot and handles midnight close', () => {
    expect(
      effectiveBands({
        basePriceMinor: 5,
        rules: [],
        dayOfWeek: 1,
        openTime: '22:00',
        closeTime: '00:00',
        slotMinutes: 60,
      }),
    ).toEqual([{ from: '22:00', to: '00:00', priceMinor: 5 }]);
    expect(
      effectiveBands({
        basePriceMinor: 5,
        rules: [],
        dayOfWeek: 1,
        openTime: '08:00',
        closeTime: '09:30',
        slotMinutes: 60,
      }),
    ).toEqual([{ from: '08:00', to: '09:00', priceMinor: 5 }]);
  });
});
