import { describe, expect, it, vi } from 'vitest';

vi.mock('expo-router', () => ({ useLocalSearchParams: vi.fn() }));
vi.mock('./player-queries', () => ({ usePlayerVenueQuery: vi.fn() }));

import {
  bookingPolicyLine,
  isValidTimeZone,
  venueRouteParams,
  type VenueSnapshot,
} from './venue-params';
import { tEn, tEs } from './__tests__/test-translate';

const venue = (over: Partial<VenueSnapshot> = {}): VenueSnapshot => ({
  id: 'v1',
  name: 'Norte',
  address: 'Calle 1',
  timezone: 'America/Bogota',
  bookingHorizonDays: 30,
  depositPercent: 30,
  cancellationWindowHours: 24,
  holdMinutes: 60,
  contactPhone: '+573001234567',
  currency: 'COP',
  ...over,
});

describe('isValidTimeZone', () => {
  it('validates IANA zones', () => {
    expect(isValidTimeZone('America/Bogota')).toBe(true);
    expect(isValidTimeZone('Not/AZone')).toBe(false);
    expect(isValidTimeZone('')).toBe(false);
    expect(isValidTimeZone(null)).toBe(false);
    expect(isValidTimeZone(undefined)).toBe(false);
  });
});

describe('venueRouteParams', () => {
  it('serializes every field', () => {
    expect(venueRouteParams({ ...venue(), id: 'v1' })).toEqual({
      venueId: 'v1',
      vName: 'Norte',
      vAddr: 'Calle 1',
      vTz: 'America/Bogota',
      vHorizon: '30',
      vDeposit: '30',
      vCancelH: '24',
      vHoldMin: '60',
      vPhone: '+573001234567',
      vCur: 'COP',
    });
  });

  it('serializes unknown rules as empty strings, not "null"', () => {
    const params = venueRouteParams({
      id: 'v1',
      name: 'Norte',
      address: null,
      timezone: 'UTC',
    });
    expect(params.vAddr).toBe('');
    expect(params.vHorizon).toBe('');
    expect(params.vDeposit).toBe('');
    expect(params.vCancelH).toBe('');
    expect(params.vHoldMin).toBe('');
    expect(params.vPhone).toBe('');
    expect(params.vCur).toBe('');
  });
});

describe('bookingPolicyLine', () => {
  it('is the unknown copy when rules are missing', () => {
    expect(bookingPolicyLine(venue({ depositPercent: null }), tEn)).toBe(
      tEn('bookingPolicy.unknown'),
    );
    expect(bookingPolicyLine(venue({ cancellationWindowHours: null }), tEs)).toBe(
      tEs('bookingPolicy.unknown'),
    );
  });

  it('describes deposit, hold and cancel window', () => {
    expect(bookingPolicyLine(venue(), tEn)).toBe(
      '30 % deposit; the venue confirms once received · we hold the slot for 60 min · you can cancel up to 24 h before.',
    );
  });

  it('omits the hold when there is none', () => {
    expect(bookingPolicyLine(venue({ holdMinutes: null }), tEn)).not.toContain('hold');
  });

  it('confirms instantly with no deposit or a free slot', () => {
    expect(bookingPolicyLine(venue({ depositPercent: 0 }), tEn)).toContain('Confirmed instantly');
    expect(bookingPolicyLine(venue(), tEn, 0)).toContain('Confirmed instantly');
    expect(bookingPolicyLine(venue(), tEn, 5000)).toContain('deposit');
  });

  it('says cancel until start when the window is zero', () => {
    expect(bookingPolicyLine(venue({ cancellationWindowHours: 0 }), tEn)).toContain(
      'you can cancel until the start time',
    );
  });

  it('follows the locale', () => {
    expect(bookingPolicyLine(venue(), tEs)).not.toBe(bookingPolicyLine(venue(), tEn));
  });
});
