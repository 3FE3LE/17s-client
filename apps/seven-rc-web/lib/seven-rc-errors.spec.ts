import { SevenRcApiError } from '@17suit/module-seven-reservations-club';
import { describe, expect, it } from 'vitest';
import { describeError, isSlotConflict } from './seven-rc-errors';

const FALLBACK = 'fallback';

describe('describeError', () => {
  it('maps a known server message to Spanish copy', () => {
    expect(describeError(new Error('Timeslot is unavailable'), FALLBACK)).toMatch(
      /Otra persona acaba de reservar/,
    );
  });

  it('interpolates captured groups', () => {
    expect(
      describeError(
        new Error('Reservations can only be cancelled up to 24h before start'),
        FALLBACK,
      ),
    ).toContain('24 h antes del inicio');
  });

  it('known message wins over the HTTP status', () => {
    const error = new SevenRcApiError('Timeslot is unavailable', 409);
    expect(describeError(error, FALLBACK)).toMatch(/Otra persona acaba de reservar/);
  });

  it.each([
    [401, /sesión expiró/],
    [403, /no tiene permiso/],
    [404, /ya no existe/],
    [409, /mismo tiempo/],
    [422, /Revisa los datos/],
    [429, /Demasiados intentos/],
    [503, /servidor tuvo un problema/],
  ])('falls back to the status copy for %i', (status, expected) => {
    expect(describeError(new SevenRcApiError('opaque server text', status), FALLBACK)).toMatch(
      expected,
    );
  });

  it('returns the fallback for an unknown status', () => {
    expect(describeError(new SevenRcApiError('opaque', 418), FALLBACK)).toBe(FALLBACK);
  });

  it('returns the fallback for non-Error values', () => {
    expect(describeError('boom', FALLBACK)).toBe(FALLBACK);
    expect(describeError(undefined, FALLBACK)).toBe(FALLBACK);
  });

  it('never leaks raw server text', () => {
    expect(describeError(new Error('prisma: P2002 unique constraint'), FALLBACK)).toBe(FALLBACK);
  });

  it('treats network failures as connectivity errors', () => {
    expect(describeError(new TypeError('Failed to fetch'), FALLBACK)).toMatch(/conectar/);
  });
});

describe('isSlotConflict', () => {
  it.each([
    'Timeslot is unavailable',
    'Timeslot is blocked',
    'Slot has already started',
    'Reservation must align with configured opening slots',
  ])('is true for %s', (message) => {
    expect(isSlotConflict(new Error(message))).toBe(true);
  });

  it('is false for other errors and non-Error values', () => {
    expect(isSlotConflict(new Error('Venue not found'))).toBe(false);
    expect(isSlotConflict('Timeslot is unavailable')).toBe(false);
  });
});
