import { describe, expect, it } from 'vitest';

import { bookingStripLength, MAX_DATE_STRIP_DAYS } from './booking-horizon';

describe('bookingStripLength', () => {
  it('covers today through today + horizon', () => {
    expect(bookingStripLength(7)).toBe(8);
    expect(bookingStripLength(30)).toBe(31);
    expect(bookingStripLength(0)).toBe(1);
  });

  it('falls back to 14 days + today only when the horizon is unknown', () => {
    expect(bookingStripLength(undefined)).toBe(15);
    expect(bookingStripLength(null)).toBe(15);
  });

  it('caps very long horizons', () => {
    expect(bookingStripLength(400)).toBe(MAX_DATE_STRIP_DAYS);
  });
});
