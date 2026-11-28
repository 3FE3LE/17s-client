import { describe, expect, it } from 'vitest';
import type { VenueReservation } from '@/lib/owner-queries';
import {
  canRecordPayment,
  filterByPayment,
  isPaymentFilter,
  paymentStatusLabel,
} from './owner-balances';
import { outstandingMinor, summarizeReservations } from './owner-report';
import { tEs } from './test-translate';

function res(o: Partial<VenueReservation>): VenueReservation {
  return {
    id: 'r',
    status: 'confirmed',
    paymentStatus: 'unpaid',
    startAt: '2026-11-20T15:00:00.000Z',
    priceMinor: 100,
    paidMinor: 0,
    ...o,
  } as VenueReservation;
}

describe('outstandingMinor', () => {
  it('is price minus paid for owed statuses, floored at zero', () => {
    expect(outstandingMinor(res({ priceMinor: 100, paidMinor: 30 }))).toBe(70);
    expect(outstandingMinor(res({ priceMinor: 100, paidMinor: 130 }))).toBe(0);
  });

  it('is zero for statuses that no longer owe', () => {
    for (const status of ['cancelled', 'rejected', 'expired', 'no_show'] as const) {
      expect(outstandingMinor(res({ status }))).toBe(0);
    }
  });

  it('sums to the report pending total', () => {
    const list = [res({ id: 'a', paidMinor: 40 }), res({ id: 'b', status: 'cancelled' })];
    expect(list.reduce((sum, item) => sum + outstandingMinor(item), 0)).toBe(
      summarizeReservations(list).pendingMinor,
    );
  });
});

describe('filterByPayment', () => {
  const list = [
    res({ id: 'late', startAt: '2026-11-22T15:00:00.000Z', paymentStatus: 'paid' }),
    res({ id: 'early', startAt: '2026-11-18T15:00:00.000Z', paymentStatus: 'unpaid' }),
    res({ id: 'mid', startAt: '2026-11-20T15:00:00.000Z', paymentStatus: 'deposit_paid' }),
    res({ id: 'ref', startAt: '2026-11-21T15:00:00.000Z', paymentStatus: 'refunded' }),
  ];

  it('returns everything oldest first for "all"', () => {
    expect(filterByPayment(list, 'all').map((item) => item.id)).toEqual([
      'early',
      'mid',
      'ref',
      'late',
    ]);
  });

  it('keeps only the chosen payment status', () => {
    expect(filterByPayment(list, 'deposit_paid').map((item) => item.id)).toEqual(['mid']);
    expect(filterByPayment(list, 'refunded').map((item) => item.id)).toEqual(['ref']);
  });

  it('does not mutate the input', () => {
    const before = list.map((item) => item.id);
    filterByPayment(list, 'all');
    expect(list.map((item) => item.id)).toEqual(before);
  });
});

describe('helpers', () => {
  it('canRecordPayment: owed or something paid', () => {
    expect(canRecordPayment(res({}))).toBe(true);
    expect(canRecordPayment(res({ status: 'cancelled', paidMinor: 50 }))).toBe(true);
    expect(canRecordPayment(res({ status: 'cancelled', paidMinor: 0 }))).toBe(false);
  });

  it('validates filter values and labels statuses', () => {
    expect(isPaymentFilter('unpaid')).toBe(true);
    expect(isPaymentFilter('nope')).toBe(false);
    expect(paymentStatusLabel('deposit_paid', tEs)).toBe('Anticipo pagado');
  });
});
