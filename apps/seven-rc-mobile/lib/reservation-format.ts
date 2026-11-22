import type { ReservationStatus } from './seven-rc-api';

export type ReservationBadgeVariant = 'neutral' | 'success' | 'destructive' | 'warning' | 'info';

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending_confirmation: 'Pendiente de confirmación',
  confirmed: 'Confirmada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
  completed: 'Completada',
  expired: 'Expirada',
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

/** Statuses a player can still cancel. */
export function isReservationCancellable(status: string, startAt: string): boolean {
  if (status !== 'pending_confirmation' && status !== 'confirmed') return false;
  const start = new Date(startAt).getTime();
  return Number.isFinite(start) && start > Date.now();
}

/** Upcoming = still active and starting in the future. */
export function isReservationUpcoming(status: string, startAt: string): boolean {
  return isReservationCancellable(status, startAt);
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
      maximumFractionDigits: 0,
    }).format(minor / 100);
  } catch {
    return null;
  }
}
