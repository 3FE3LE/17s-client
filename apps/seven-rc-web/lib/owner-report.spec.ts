import { describe, expect, it } from 'vitest';
import type { VenueReservation } from '@/lib/owner-queries';
import {
  buildReservationsCsv,
  countDateKeys,
  csvCell,
  reportFileName,
  summarizeReservations,
  validatePeriod,
} from './owner-report';

function reservation(overrides: Partial<VenueReservation> = {}): VenueReservation {
  return {
    id: 'r1',
    status: 'confirmed',
    source: 'online',
    startAt: '2026-11-20T23:00:00.000Z',
    endAt: '2026-11-21T00:00:00.000Z',
    priceMinor: 10_000_000,
    depositMinor: 3_000_000,
    paidMinor: 3_000_000,
    currency: 'COP',
    customerName: 'Ana',
    customerPhone: '3001234567',
    pitch: { name: 'Cancha 1' },
    user: null,
    payments: [],
    ...overrides,
  } as unknown as VenueReservation;
}

describe('summarizeReservations', () => {
  it('counts collected over every status and pending only over owed statuses', () => {
    const totals = summarizeReservations([
      reservation({ id: 'a', status: 'confirmed', priceMinor: 100, paidMinor: 40 }),
      reservation({ id: 'b', status: 'completed', priceMinor: 100, paidMinor: 130 }),
      reservation({ id: 'c', status: 'cancelled', priceMinor: 100, paidMinor: 50 }),
      reservation({ id: 'd', status: 'no_show', priceMinor: 100, paidMinor: 0 }),
    ]);
    expect(totals).toEqual({
      reservations: 4,
      collectedMinor: 220,
      pendingMinor: 60,
      byStatus: { confirmed: 1, completed: 1, cancelled: 1, no_show: 1 },
    });
  });

  it('is zero for an empty list', () => {
    expect(summarizeReservations([])).toEqual({
      reservations: 0,
      collectedMinor: 0,
      pendingMinor: 0,
      byStatus: {},
    });
  });
});

describe('validatePeriod', () => {
  it('accepts a valid range and rejects bad ones', () => {
    expect(validatePeriod('2026-11-01', '2026-11-30')).toBeNull();
    expect(validatePeriod('', '2026-11-30')).toMatch(/Elige/);
    expect(validatePeriod('2026-11-30', '2026-11-01')).toMatch(/anterior/);
    expect(validatePeriod('2025-01-01', '2026-12-31')).toMatch(/366/);
  });

  it('counts inclusive days and allows exactly 366', () => {
    expect(countDateKeys('2026-11-01', '2026-11-01')).toBe(1);
    expect(validatePeriod('2024-01-01', '2024-12-31')).toBeNull();
  });
});

describe('csvCell', () => {
  it('quotes separators and quotes, neutralises formulas', () => {
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell('=SUM(A1)')).toBe("'=SUM(A1)");
    expect(csvCell(-5)).toBe('-5');
    expect(csvCell(null)).toBe('');
  });
});

describe('buildReservationsCsv', () => {
  it('emits one row per payment and one row for a reservation without payments', () => {
    const csv = buildReservationsCsv(
      [
        reservation({
          id: 'r2',
          startAt: '2026-11-21T20:00:00.000Z',
          endAt: '2026-11-21T21:00:00.000Z',
          payments: [
            {
              id: 'p1',
              reservationId: 'r2',
              kind: 'deposit',
              method: 'cash',
              amountMinor: 3_000_000,
              currency: 'COP',
              note: 'seña',
              createdAt: '2026-11-20T10:00:00.000Z',
            },
            {
              id: 'p2',
              reservationId: 'r2',
              kind: 'balance',
              method: 'transfer',
              amountMinor: 7_000_000,
              currency: 'COP',
              createdAt: '2026-11-21T19:00:00.000Z',
            },
          ],
        }),
        reservation({ id: 'r1' }),
      ],
      'America/Bogota',
    );
    expect(csv.startsWith('﻿reserva_id,')).toBe(true);
    const lines = csv.trim().split('\r\n');
    expect(lines).toHaveLength(4);
    // sorted by start: r1 first; 23:00Z is 18:00 in Bogota
    expect(lines[1]).toContain('r1,2026-11-20,18:00,19:00,60,Cancha 1,confirmed');
    expect(lines[1]!.endsWith(',,,,,,')).toBe(true);
    expect(lines[2]).toContain('p1,deposit,cash,30000.00');
    expect(lines[3]).toContain('p2,balance,transfer,70000.00');
  });

  it('reconciles with summarizeReservations: pagado_reserva sums to collected per reservation', () => {
    const list = [
      reservation({ id: 'a', paidMinor: 500 }),
      reservation({ id: 'b', paidMinor: 250, status: 'cancelled' }),
    ];
    const rows = buildReservationsCsv(list, 'America/Bogota').trim().split('\r\n').slice(1);
    const paid = rows.reduce((sum, row) => sum + Number(row.split(',')[13]), 0);
    expect(Math.round(paid * 100)).toBe(summarizeReservations(list).collectedMinor);
  });
});

describe('reportFileName', () => {
  it('slugifies the venue', () => {
    expect(reportFileName('Cancha La 70!', '2026-11-01', '2026-11-30')).toBe(
      'reservas-cancha-la-70-2026-11-01_2026-11-30.csv',
    );
  });
});
