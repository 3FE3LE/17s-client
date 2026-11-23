import { describe, expect, it } from 'vitest';
import {
  addDaysToDateKey,
  dateKeyInTimeZone,
  DEFAULT_TIMEZONE,
  formatDuration,
  formatMoneyMinor,
  formatUpdatedAgo,
  hourInTimeZone,
  minutesBetween,
  reservationStatus,
  safeTimeZone,
  sportLabel,
  zonedTimeToInstant,
} from './seven-rc-format';

describe('safeTimeZone', () => {
  it('keeps a valid zone', () => {
    expect(safeTimeZone('America/Lima')).toBe('America/Lima');
  });

  it('falls back for invalid, empty or missing zones', () => {
    expect(safeTimeZone('Not/AZone')).toBe(DEFAULT_TIMEZONE);
    expect(safeTimeZone('')).toBe(DEFAULT_TIMEZONE);
    expect(safeTimeZone(null)).toBe(DEFAULT_TIMEZONE);
    expect(safeTimeZone(undefined)).toBe(DEFAULT_TIMEZONE);
  });
});

describe('date keys', () => {
  it('reads the venue-local date, not the UTC date', () => {
    // 2026-11-23 03:00Z is still 22 Nov at 22:00 in Bogotá (UTC-5).
    expect(dateKeyInTimeZone('2026-11-23T03:00:00Z', 'America/Bogota')).toBe('2026-11-22');
    expect(dateKeyInTimeZone('2026-11-23T03:00:00Z', 'Europe/Madrid')).toBe('2026-11-23');
  });

  it('adds days across month and year boundaries', () => {
    expect(addDaysToDateKey('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDaysToDateKey('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDaysToDateKey('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDaysToDateKey('2028-02-28', 1)).toBe('2028-02-29');
  });
});

describe('zonedTimeToInstant', () => {
  it('resolves a Bogotá wall clock (UTC-5, no DST)', () => {
    expect(zonedTimeToInstant('2026-11-22', '19:00', 'America/Bogota').toISOString()).toBe(
      '2026-11-23T00:00:00.000Z',
    );
  });

  it('respects DST in the zone', () => {
    expect(zonedTimeToInstant('2026-07-01', '12:00', 'America/New_York').toISOString()).toBe(
      '2026-07-01T16:00:00.000Z',
    );
    expect(zonedTimeToInstant('2026-12-01', '12:00', 'America/New_York').toISOString()).toBe(
      '2026-12-01T17:00:00.000Z',
    );
  });

  it('round-trips with hourInTimeZone', () => {
    const instant = zonedTimeToInstant('2026-11-22', '19:00', 'America/Bogota');
    expect(hourInTimeZone(instant.toISOString(), 'America/Bogota')).toBe(19);
  });
});

describe('durations', () => {
  it('formats minutes, hours and mixed', () => {
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(60)).toBe('1 h');
    expect(formatDuration(90)).toBe('1 h 30 min');
  });

  it('computes minutes between instants', () => {
    expect(minutesBetween('2026-11-23T00:00:00Z', '2026-11-23T01:30:00Z')).toBe(90);
  });
});

describe('formatMoneyMinor', () => {
  it('renders whole amounts without decimals', () => {
    const text = formatMoneyMinor(8_000_000, 'COP').replace(/\s/g, ' ');
    expect(text).toContain('80.000');
    expect(text).not.toMatch(/[.,]00$/);
  });

  it('keeps decimals for fractional amounts', () => {
    expect(formatMoneyMinor(1050, 'USD')).toMatch(/10,50/);
  });

  it('falls back for an invalid currency code', () => {
    expect(formatMoneyMinor(1000, 'NOPE!')).toContain('NOPE!');
  });
});

describe('labels', () => {
  it('maps known sports and passes unknown ones through', () => {
    expect(sportLabel('padel')).toBe('Pádel');
    expect(sportLabel('curling')).toBe('curling');
  });

  it('maps known statuses and humanizes unknown ones', () => {
    expect(reservationStatus('confirmed')).toEqual({ label: 'Confirmada', variant: 'success' });
    expect(reservationStatus('on_hold')).toEqual({ label: 'on hold', variant: 'neutral' });
  });
});

describe('formatUpdatedAgo', () => {
  const now = 10_000_000;
  it.each([
    [0, 'Sin actualizar todavía'],
    [now - 30_000, 'Actualizado hace un momento'],
    [now - 5 * 60_000, 'Actualizado hace 5 min'],
    [now - 60 * 60_000, 'Actualizado hace 1 h'],
    [now - 180 * 60_000, 'Actualizado hace 3 h'],
    [now + 60_000, 'Actualizado hace un momento'],
  ])('updatedAt=%i', (updatedAt, expected) => {
    expect(formatUpdatedAgo(updatedAt, now)).toBe(expected);
  });
});
