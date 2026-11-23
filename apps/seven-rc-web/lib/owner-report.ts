import type { VenueReservation } from '@/lib/owner-queries';
import { dateKeyInTimeZone, minutesBetween } from '@/lib/seven-rc-format';

/** Statuses whose unpaid balance still counts as owed. Mirrors the server report. */
const PENDING_STATUSES = new Set(['pending_confirmation', 'confirmed', 'completed']);

export interface ReservationTotals {
  reservations: number;
  collectedMinor: number;
  pendingMinor: number;
  byStatus: Record<string, number>;
}

/**
 * Same money rules as the server report, applied to the owner reservation list.
 * Lets the UI and tests prove report figures reconcile with the list.
 */
export function summarizeReservations(
  reservations: readonly VenueReservation[],
): ReservationTotals {
  const totals: ReservationTotals = {
    reservations: 0,
    collectedMinor: 0,
    pendingMinor: 0,
    byStatus: {},
  };
  for (const reservation of reservations) {
    totals.reservations += 1;
    totals.collectedMinor += reservation.paidMinor;
    if (PENDING_STATUSES.has(reservation.status)) {
      totals.pendingMinor += Math.max(reservation.priceMinor - reservation.paidMinor, 0);
    }
    totals.byStatus[reservation.status] = (totals.byStatus[reservation.status] ?? 0) + 1;
  }
  return totals;
}

export const REPORT_MAX_DAYS = 366;

/** Inclusive day count between two `YYYY-MM-DD` keys, or null when malformed. */
export function countDateKeys(dateFrom: string, dateTo: string): number | null {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(dateFrom) || !pattern.test(dateTo)) return null;
  const from = Date.parse(`${dateFrom}T00:00:00Z`);
  const to = Date.parse(`${dateTo}T00:00:00Z`);
  if (Number.isNaN(from) || Number.isNaN(to)) return null;
  return Math.round((to - from) / 86_400_000) + 1;
}

/** Spanish validation message for a period, or null when valid. */
export function validatePeriod(dateFrom: string, dateTo: string): string | null {
  const days = countDateKeys(dateFrom, dateTo);
  if (days === null) return 'Elige fecha de inicio y de fin.';
  if (days < 1) return 'La fecha de fin no puede ser anterior a la de inicio.';
  if (days > REPORT_MAX_DAYS) return `El período no puede superar ${REPORT_MAX_DAYS} días.`;
  return null;
}

const CSV_HEADER = [
  'reserva_id',
  'fecha',
  'hora_inicio',
  'hora_fin',
  'minutos',
  'cancha',
  'estado',
  'origen',
  'cliente',
  'telefono',
  'moneda',
  'precio',
  'abono_requerido',
  'pagado_reserva',
  'pago_id',
  'pago_tipo',
  'pago_metodo',
  'pago_monto',
  'pago_fecha',
  'pago_nota',
] as const;

/**
 * Quotes a cell. Cells starting with a formula trigger get a leading apostrophe so
 * spreadsheets do not execute customer-supplied text.
 */
export function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  let text = String(value);
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function minorToDecimal(amountMinor: number): string {
  return (amountMinor / 100).toFixed(2);
}

function wallTime(instant: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(instant));
}

/**
 * One row per payment; a reservation without payments gets one row with empty payment
 * columns, so row groups by `reserva_id` always cover every reservation in the list.
 */
export function buildReservationsCsv(
  reservations: readonly VenueReservation[],
  timeZone: string,
): string {
  const rows: string[] = [CSV_HEADER.join(',')];
  const ordered = [...reservations].sort((a, b) => a.startAt.localeCompare(b.startAt));
  for (const reservation of ordered) {
    const base = [
      reservation.id,
      dateKeyInTimeZone(reservation.startAt, timeZone),
      wallTime(reservation.startAt, timeZone),
      wallTime(reservation.endAt, timeZone),
      minutesBetween(reservation.startAt, reservation.endAt),
      reservation.pitch.name,
      reservation.status,
      reservation.source,
      reservation.customerName ?? reservation.user?.name ?? '',
      reservation.customerPhone ?? '',
      reservation.currency,
      minorToDecimal(reservation.priceMinor),
      minorToDecimal(reservation.depositMinor),
      minorToDecimal(reservation.paidMinor),
    ];
    const payments = reservation.payments.length > 0 ? reservation.payments : [null];
    for (const payment of payments) {
      const tail = payment
        ? [
            payment.id,
            payment.kind,
            payment.method,
            minorToDecimal(payment.amountMinor),
            payment.createdAt,
            payment.note ?? '',
          ]
        : ['', '', '', '', '', ''];
      rows.push([...base, ...tail].map(csvCell).join(','));
    }
  }
  return `﻿${rows.join('\r\n')}\r\n`;
}

export function reportFileName(venueSlug: string, dateFrom: string, dateTo: string): string {
  const safe =
    venueSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'complejo';
  return `reservas-${safe}-${dateFrom}_${dateTo}.csv`;
}
