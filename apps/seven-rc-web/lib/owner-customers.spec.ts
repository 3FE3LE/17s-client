import { describe, expect, it } from 'vitest';
import type { VenueReservation } from '@/lib/owner-queries';
import { tEs } from './test-translate';
import { buildCustomerBook, clampInt, filterCustomers, normalizePhone } from './owner-customers';

const NOW = Date.parse('2026-11-23T12:00:00Z');
const daysAgo = (days: number) => new Date(NOW - days * 86_400_000).toISOString();

function res(o: Partial<VenueReservation>): VenueReservation {
  return {
    id: Math.random().toString(36),
    status: 'completed',
    startAt: daysAgo(1),
    paidMinor: 100,
    currency: 'COP',
    customerName: 'Ana',
    customerPhone: '+573001234567',
    user: null,
    ...o,
  } as VenueReservation;
}

describe('normalizePhone', () => {
  it('unifies local and international formats', () => {
    expect(normalizePhone('300 123 4567')).toBe('573001234567');
    expect(normalizePhone('+57 300-123-4567')).toBe('573001234567');
    expect(normalizePhone('573001234567')).toBe('573001234567');
  });
  it('returns null for empty or too short input', () => {
    expect(normalizePhone(null)).toBeNull();
    expect(normalizePhone('12345')).toBeNull();
  });
});

describe('buildCustomerBook', () => {
  it('groups by phone across formats with count, last reservation and spend', () => {
    const { customers, withoutPhone } = buildCustomerBook(
      [
        res({ id: 'a', startAt: daysAgo(10), paidMinor: 300 }),
        res({ id: 'b', startAt: daysAgo(2), customerPhone: '300 123 4567', paidMinor: 200 }),
        res({ id: 'c', customerPhone: '3109998888', customerName: 'Luis' }),
        res({ id: 'd', customerPhone: null }),
      ],
      NOW,
      tEs,
    );
    expect(withoutPhone).toBe(1);
    expect(customers).toHaveLength(2);
    const ana = customers.find((c) => c.name === 'Ana');
    expect(ana).toMatchObject({ bookings: 2, spentMinor: 500, lastStartAt: daysAgo(2) });
    expect(ana?.history.map((h) => h.id)).toEqual(['b', 'a']);
  });

  it('does not count cancelled or rejected as bookings but keeps their money', () => {
    const [customer] = buildCustomerBook(
      [res({ status: 'cancelled', paidMinor: 50 }), res({ status: 'no_show', paidMinor: 0 })],
      NOW,
      tEs,
    ).customers;
    expect(customer).toMatchObject({ bookings: 1, noShows: 1, spentMinor: 50 });
  });

  it('flags frequent and lapsed by the configurable thresholds', () => {
    const many = Array.from({ length: 3 }, (_, i) => res({ startAt: daysAgo(100 + i) }));
    const [lapsed] = buildCustomerBook(many, NOW, tEs, {
      frequentMinBookings: 3,
      lapsedAfterDays: 60,
    }).customers;
    expect(lapsed).toMatchObject({ isFrequent: true, isLapsed: true });
    const [active] = buildCustomerBook(many, NOW, tEs, {
      frequentMinBookings: 4,
      lapsedAfterDays: 120,
    }).customers;
    expect(active).toMatchObject({ isFrequent: false, isLapsed: false });
  });

  it('an upcoming reservation means not lapsed', () => {
    const [customer] = buildCustomerBook(
      [res({ startAt: daysAgo(200) }), res({ startAt: daysAgo(-3), status: 'confirmed' })],
      NOW,
      tEs,
    ).customers;
    expect(customer?.isLapsed).toBe(false);
  });

  it('orders by most recent reservation first', () => {
    const { customers } = buildCustomerBook(
      [
        res({ customerPhone: '3000000001', startAt: daysAgo(30), customerName: 'Old' }),
        res({ customerPhone: '3000000002', startAt: daysAgo(1), customerName: 'New' }),
      ],
      NOW,
      tEs,
    );
    expect(customers.map((c) => c.name)).toEqual(['New', 'Old']);
  });
});

describe('filterCustomers and clampInt', () => {
  it('filters by flag', () => {
    const { customers } = buildCustomerBook(
      [res({ startAt: daysAgo(400) }), res({ customerPhone: '3000000009', startAt: daysAgo(1) })],
      NOW,
      tEs,
    );
    expect(filterCustomers(customers, 'lapsed')).toHaveLength(1);
    expect(filterCustomers(customers, 'all')).toHaveLength(2);
    expect(filterCustomers(customers, 'frequent')).toHaveLength(0);
  });
  it('clamps and falls back', () => {
    expect(clampInt('7', 1, 20, 5)).toBe(7);
    expect(clampInt('99', 1, 20, 5)).toBe(20);
    expect(clampInt('abc', 1, 20, 5)).toBe(5);
  });
});
