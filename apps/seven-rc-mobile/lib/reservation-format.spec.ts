import { describe, expect, it } from 'vitest';
import {
  displayStatus,
  formatMoney,
  formatVenueDay,
  formatVenueLongDay,
  formatVenueRange,
  formatVenueTime,
  isAwaitingOwner,
  isPendingExpired,
  isReservationCancellable,
  isReservationUpcoming,
  reservationBadgeVariant,
  reservationStatusLabel,
  venueDateKey,
} from './reservation-format';
import { tEn, tEs } from './__tests__/test-translate';

const NOW = Date.parse('2026-11-22T12:00:00Z');
const HOUR = 3_600_000;
const iso = (offsetHours: number) => new Date(NOW + offsetHours * HOUR).toISOString();

describe('reservationStatusLabel', () => {
  it('translates known statuses and falls back to unknown', () => {
    expect(reservationStatusLabel('confirmed', tEn)).toBe('Confirmed');
    expect(reservationStatusLabel('no_show', tEs)).toBe(tEs('reservationStatus.no_show'));
    expect(reservationStatusLabel('mystery', tEn)).toBe('Unknown status');
  });
});

describe('reservationBadgeVariant', () => {
  it.each([
    ['confirmed', 'success'],
    ['pending_confirmation', 'warning'],
    ['rejected', 'destructive'],
    ['cancelled', 'destructive'],
    ['no_show', 'destructive'],
    ['completed', 'info'],
    ['expired', 'neutral'],
    ['other', 'neutral'],
  ])('%s -> %s', (status, variant) => {
    expect(reservationBadgeVariant(status)).toBe(variant);
  });
});

describe('isReservationCancellable', () => {
  it('only allows pending and confirmed', () => {
    expect(isReservationCancellable('cancelled', iso(5), 0, NOW)).toBe(false);
    expect(isReservationCancellable('completed', iso(5), 0, NOW)).toBe(false);
    expect(isReservationCancellable('confirmed', iso(5), 0, NOW)).toBe(true);
    expect(isReservationCancellable('pending_confirmation', iso(5), 0, NOW)).toBe(true);
  });

  it('rejects past starts and invalid dates', () => {
    expect(isReservationCancellable('confirmed', iso(-1), 0, NOW)).toBe(false);
    expect(isReservationCancellable('confirmed', 'garbage', 0, NOW)).toBe(false);
  });

  it('honors the cancellation window', () => {
    expect(isReservationCancellable('confirmed', iso(5), 4, NOW)).toBe(true);
    expect(isReservationCancellable('confirmed', iso(3), 4, NOW)).toBe(false);
    expect(isReservationCancellable('confirmed', iso(4), 4, NOW)).toBe(false);
  });
});

describe('pending expiry', () => {
  it('is false for non-pending statuses', () => {
    expect(isPendingExpired({ status: 'confirmed', startAt: iso(-5) }, NOW)).toBe(false);
  });

  it('expires when the start passed', () => {
    expect(isPendingExpired({ status: 'pending_confirmation', startAt: iso(-1) }, NOW)).toBe(true);
  });

  it('expires when the hold ran out', () => {
    const base = { status: 'pending_confirmation', startAt: iso(5) };
    expect(isPendingExpired({ ...base, holdExpiresAt: iso(-1) }, NOW)).toBe(true);
    expect(isPendingExpired({ ...base, holdExpiresAt: iso(1) }, NOW)).toBe(false);
    expect(isPendingExpired({ ...base, holdExpiresAt: null }, NOW)).toBe(false);
    expect(isPendingExpired({ ...base, holdExpiresAt: 'garbage' }, NOW)).toBe(false);
  });

  it('ignores an invalid start', () => {
    expect(isPendingExpired({ status: 'pending_confirmation', startAt: 'garbage' }, NOW)).toBe(
      false,
    );
  });

  it('derives awaiting, display status and upcoming', () => {
    const live = { status: 'pending_confirmation', startAt: iso(5) };
    const lapsed = { status: 'pending_confirmation', startAt: iso(-2) };
    expect(isAwaitingOwner(live, NOW)).toBe(true);
    expect(isAwaitingOwner(lapsed, NOW)).toBe(false);
    expect(displayStatus(lapsed, NOW)).toBe('expired');
    expect(displayStatus({ status: 'confirmed', startAt: iso(-2) }, NOW)).toBe('confirmed');
    expect(isReservationUpcoming(live, NOW)).toBe(true);
    expect(isReservationUpcoming(lapsed, NOW)).toBe(false);
    expect(isReservationUpcoming({ status: 'confirmed', startAt: iso(-2) }, NOW)).toBe(false);
  });
});

describe('venue date and time formatting', () => {
  // 2026-11-23T02:30Z is 21:30 on the 22nd in Bogota (UTC-5), still the 23rd in UTC.
  const value = '2026-11-23T02:30:00Z';

  it('formats time in the venue timezone', () => {
    expect(formatVenueTime(value, 'America/Bogota', 'es-CO')).toBe('21:30');
    expect(formatVenueTime(value, 'UTC', 'es-CO')).toBe('02:30');
  });

  it('formats the day in the venue timezone', () => {
    expect(formatVenueDay(value, 'America/Bogota', 'en-US')).toContain('22');
    expect(formatVenueDay(value, 'UTC', 'en-US')).toContain('23');
    expect(formatVenueLongDay(value, 'America/Bogota', 'en-US')).toMatch(/Sunday.*22.*2026/);
  });

  it('falls back to the raw value for invalid dates', () => {
    expect(formatVenueDay('nope', 'UTC', 'en-US')).toBe('nope');
    expect(formatVenueLongDay('nope', 'UTC', 'en-US')).toBe('nope');
    expect(formatVenueTime('nope', 'UTC', 'en-US')).toBe('nope');
  });

  it('ignores an invalid timezone instead of throwing', () => {
    expect(() => formatVenueTime(value, 'Not/AZone', 'en-US')).not.toThrow();
    expect(() => formatVenueDay(value, null, 'en-US')).not.toThrow();
  });

  it('joins day and time range', () => {
    const range = formatVenueRange(value, '2026-11-23T03:30:00Z', 'America/Bogota', 'en-US');
    expect(range).toContain('21:30–22:30');
    expect(range).toContain(' · ');
  });
});

describe('venueDateKey', () => {
  it('returns the date in the venue timezone', () => {
    expect(venueDateKey('2026-11-23T02:30:00Z', 'America/Bogota')).toBe('2026-11-22');
    expect(venueDateKey(new Date('2026-11-23T02:30:00Z'), 'UTC')).toBe('2026-11-23');
  });

  it('returns null for invalid dates and tolerates a bad zone', () => {
    expect(venueDateKey('nope')).toBeNull();
    expect(venueDateKey('2026-11-23T02:30:00Z', 'Not/AZone')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('formatMoney', () => {
  it('returns null for zero or unknown currency', () => {
    expect(formatMoney(0, 'COP', 'es-CO')).toBeNull();
    expect(formatMoney(1000, 'NOPE-X', 'es-CO')).toBeNull();
  });

  it('shows whole amounts without cents and cents when present', () => {
    expect(formatMoney(12_000_000, 'COP', 'en-US')).toBe('COP 120,000'.replace('COP ', 'COP '));
    expect(formatMoney(1050, 'USD', 'en-US')).toBe('$10.50');
    expect(formatMoney(1000, 'USD', 'en-US')).toBe('$10');
  });
});
