import type { ReservationStatus } from './seven-rc-api';

export type ReservationBadgeVariant = 'neutral' | 'success' | 'destructive' | 'warning' | 'info';

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending_confirmation: 'Pendiente de confirmación',
  confirmed: 'Confirmada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
  completed: 'Completada',
  expired: 'Vencida',
  no_show: 'No asistió',
};

export function reservationStatusLabel(status: string): string {
  return STATUS_LABELS[status as ReservationStatus] ?? 'Estado desconocido';
}

export function reservationBadgeVariant(status: string): ReservationBadgeVariant {
  if (status === 'confirmed') return 'success';
  if (status === 'pending_confirmation') return 'warning';
  if (status === 'rejected' || status === 'cancelled' || status === 'no_show') {
    return 'destructive';
  }
  if (status === 'completed') return 'info';
  return 'neutral';
}

/**
 * Statuses a player can still cancel. With `cancellationWindowHours`, mirrors
 * the server rule: no cancelling inside the window before the start.
 */
export function isReservationCancellable(
  status: string,
  startAt: string,
  cancellationWindowHours = 0,
  now = Date.now(),
): boolean {
  if (status !== 'pending_confirmation' && status !== 'confirmed') return false;
  const start = new Date(startAt).getTime();
  return Number.isFinite(start) && start - cancellationWindowHours * 3_600_000 > now;
}

/**
 * A pending request that can no longer be confirmed: its start already passed,
 * or the hold the server gave it ran out.
 */
export function isPendingExpired(
  reservation: { status: string; startAt: string; holdExpiresAt?: string | null },
  now = Date.now(),
): boolean {
  if (reservation.status !== 'pending_confirmation') return false;
  const start = new Date(reservation.startAt).getTime();
  if (Number.isFinite(start) && start <= now) return true;
  if (reservation.holdExpiresAt) {
    const hold = new Date(reservation.holdExpiresAt).getTime();
    if (Number.isFinite(hold) && hold <= now) return true;
  }
  return false;
}

/** A pending request the owner can still act on. */
export function isAwaitingOwner(
  reservation: { status: string; startAt: string; holdExpiresAt?: string | null },
  now = Date.now(),
): boolean {
  return reservation.status === 'pending_confirmation' && !isPendingExpired(reservation, now);
}

/**
 * Status to show and to derive actions from. The server only marks a stale
 * request `expired` later (sweeper), so the client derives it.
 */
export function displayStatus(
  reservation: { status: string; startAt: string; holdExpiresAt?: string | null },
  now = Date.now(),
): string {
  return isPendingExpired(reservation, now) ? 'expired' : reservation.status;
}

/** Upcoming = still active (not a lapsed request) and starting in the future. */
export function isReservationUpcoming(
  reservation: { status: string; startAt: string; holdExpiresAt?: string | null },
  now = Date.now(),
): boolean {
  return isReservationCancellable(displayStatus(reservation, now), reservation.startAt, 0, now);
}

function safeTimeZone(timeZone?: string | null): string | undefined {
  if (!timeZone) return undefined;
  try {
    new Intl.DateTimeFormat('es-CO', { timeZone }).format(0);
    return timeZone;
  } catch {
    return undefined;
  }
}

/** "sáb, 22 nov" in the venue timezone. */
export function formatVenueDay(value: string, timeZone?: string | null): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: safeTimeZone(timeZone),
  }).format(date);
}

/** "sábado, 22 de noviembre de 2026" in the venue timezone. */
export function formatVenueLongDay(value: string, timeZone?: string | null): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: safeTimeZone(timeZone),
  }).format(date);
}

/** "18:00" in the venue timezone. */
export function formatVenueTime(value: string, timeZone?: string | null): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: safeTimeZone(timeZone),
  }).format(date);
}

export function formatVenueRange(startAt: string, endAt: string, timeZone?: string | null): string {
  return `${formatVenueDay(startAt, timeZone)} · ${formatVenueTime(startAt, timeZone)}–${formatVenueTime(endAt, timeZone)}`;
}

/** `YYYY-MM-DD` of `value` in the venue timezone (device zone if unknown). */
export function venueDateKey(value: string | Date, timeZone?: string | null): string | null {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: safeTimeZone(timeZone),
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** "$120.000" in es-CO for an amount in minor units. Null when zero or the currency is unknown. */
export function formatMoney(minor: number, currency: string): string | null {
  if (!minor) return null;
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      // Whole amounts stay "$120.000"; cents show only when there are some.
      minimumFractionDigits: minor % 100 === 0 ? 0 : 2,
      maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
    }).format(minor / 100);
  } catch {
    return null;
  }
}
