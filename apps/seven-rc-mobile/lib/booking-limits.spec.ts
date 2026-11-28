import { describe, expect, it } from 'vitest';

import { bookingDayChipCount, MAX_CONSECUTIVE_SLOTS } from './booking-limits';

describe('bookingDayChipCount', () => {
  it('uses the venue horizon', () => {
    expect(bookingDayChipCount(7)).toBe(7);
    expect(bookingDayChipCount(30)).toBe(30);
  });
  it('falls back to 14 only when unknown', () => {
    expect(bookingDayChipCount(null)).toBe(14);
    expect(bookingDayChipCount(undefined)).toBe(14);
  });
  it('clamps to [1, 30]', () => {
    expect(bookingDayChipCount(0)).toBe(1);
    expect(bookingDayChipCount(90)).toBe(30);
  });
});

it('matches the server cap', () => {
  expect(MAX_CONSECUTIVE_SLOTS).toBe(8);
});
