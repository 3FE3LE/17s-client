import type { AppBadgeProps } from '@17suit/ui';

/** Display locale for every date, time and amount in seven-rc-web. */
export const DISPLAY_LOCALE = 'es-CO';

/** Launch market default. Venues carry their own IANA zone; this only fills gaps. */
export const DEFAULT_TIMEZONE = 'America/Bogota';

/** IANA zones offered when an owner creates a complejo. LatAm first, then the rest. */
export const VENUE_TIMEZONE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'America/Bogota', label: 'Colombia (Bogotá)' },
  { value: 'America/Mexico_City', label: 'México (Ciudad de México)' },
  { value: 'America/Lima', label: 'Perú (Lima)' },
  { value: 'America/Guayaquil', label: 'Ecuador (Guayaquil)' },
  { value: 'America/Panama', label: 'Panamá' },
  { value: 'America/Caracas', label: 'Venezuela (Caracas)' },
  { value: 'America/Santiago', label: 'Chile (Santiago)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (Buenos Aires)' },
  { value: 'America/Sao_Paulo', label: 'Brasil (São Paulo)' },
  { value: 'America/Montevideo', label: 'Uruguay (Montevideo)' },
  { value: 'America/Asuncion', label: 'Paraguay (Asunción)' },
  { value: 'America/La_Paz', label: 'Bolivia (La Paz)' },
  { value: 'America/Costa_Rica', label: 'Costa Rica' },
  { value: 'America/Guatemala', label: 'Guatemala' },
  { value: 'America/El_Salvador', label: 'El Salvador' },
  { value: 'America/Tegucigalpa', label: 'Honduras (Tegucigalpa)' },
  { value: 'America/Managua', label: 'Nicaragua (Managua)' },
  { value: 'America/Santo_Domingo', label: 'República Dominicana' },
  { value: 'America/Puerto_Rico', label: 'Puerto Rico' },
  { value: 'America/New_York', label: 'Estados Unidos (Nueva York)' },
  { value: 'America/Chicago', label: 'Estados Unidos (Chicago)' },
  { value: 'America/Los_Angeles', label: 'Estados Unidos (Los Ángeles)' },
  { value: 'Europe/Madrid', label: 'España (Madrid)' },
];

export const WEEKDAYS: ReadonlyArray<{ value: number; label: string }> = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

export const SPORT_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'futbol-5', label: 'Fútbol 5' },
  { value: 'futbol-7', label: 'Fútbol 7' },
  { value: 'futbol-8', label: 'Fútbol 8' },
  { value: 'futbol-11', label: 'Fútbol 11' },
  { value: 'padel', label: 'Pádel' },
  { value: 'tenis', label: 'Tenis' },
  { value: 'baloncesto', label: 'Baloncesto' },
  { value: 'voleibol', label: 'Voleibol' },
];

export function sportLabel(value: string): string {
  return SPORT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

/** Returns a usable IANA zone: the venue's when valid, otherwise the launch default. */
export function safeTimeZone(timeZone: string | null | undefined): string {
  if (!timeZone) return DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat(DISPLAY_LOCALE, { timeZone });
    return timeZone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

/** `YYYY-MM-DD` of an instant as seen on the venue's wall clock. */
export function dateKeyInTimeZone(instant: Date | string, timeZone: string): string {
  const date = typeof instant === 'string' ? new Date(instant) : instant;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00';
  return `${read('year')}-${read('month')}-${read('day')}`;
}

function dateKeyToUtcNoon(dateKey: string): Date {
  const [year = 1970, month = 1, day = 1] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

/** Calendar arithmetic on a `YYYY-MM-DD` key. Zone-free, so DST cannot shift it. */
export function addDaysToDateKey(dateKey: string, days: number): string {
  const base = dateKeyToUtcNoon(dateKey);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

/** Formats a `YYYY-MM-DD` key. The key is already venue-local, so format it as UTC. */
export function formatDateKey(dateKey: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, { ...options, timeZone: 'UTC' }).format(
    dateKeyToUtcNoon(dateKey),
  );
}

export function formatLongDate(dateKey: string): string {
  return formatDateKey(dateKey, { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatTime(instant: string, timeZone: string): string {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(instant));
}

/** "antes de las 7:30 p. m." / "antes de la 1:05 p. m." */
export function formatBeforeTime(instant: string, timeZone: string): string {
  const time = formatTime(instant, timeZone);
  return `antes de ${time.startsWith('1:') ? 'la' : 'las'} ${time}`;
}

export function formatTimeRange(startAt: string, endAt: string, timeZone: string): string {
  return `${formatTime(startAt, timeZone)} – ${formatTime(endAt, timeZone)}`;
}

/** "sábado 22 de noviembre · 7:00 p. m. – 8:00 p. m." in the venue zone. */
export function formatSlotWhen(startAt: string, endAt: string, timeZone: string): string {
  return `${formatLongDate(dateKeyInTimeZone(startAt, timeZone))} · ${formatTimeRange(
    startAt,
    endAt,
    timeZone,
  )}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function minutesBetween(startAt: string, endAt: string): number {
  return Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60_000);
}

/** Amounts arrive in minor units (cents). Whole amounts render without decimals. */
export function formatMoneyMinor(amountMinor: number, currency: string): string {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(DISPLAY_LOCALE, {
      style: 'currency',
      currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString(DISPLAY_LOCALE)} ${currency}`;
  }
}

type BadgeVariant = NonNullable<AppBadgeProps['variant']>;

const STATUS_COPY: Record<string, { label: string; variant: BadgeVariant }> = {
  pending_confirmation: { label: 'Pendiente de confirmación', variant: 'warning' },
  confirmed: { label: 'Confirmada', variant: 'success' },
  rejected: { label: 'Rechazada', variant: 'destructive' },
  cancelled: { label: 'Cancelada', variant: 'neutral' },
  completed: { label: 'Completada', variant: 'info' },
  expired: { label: 'Vencida', variant: 'neutral' },
  no_show: { label: 'No asistió', variant: 'destructive' },
};

export function reservationStatus(status: string): { label: string; variant: BadgeVariant } {
  return STATUS_COPY[status] ?? { label: status.replaceAll('_', ' '), variant: 'neutral' };
}

/** "Actualizado hace 3 min" from a React Query `dataUpdatedAt` and a ticking `now`. */
export function formatUpdatedAgo(updatedAt: number, now: number): string {
  if (!updatedAt) return 'Sin actualizar todavía';
  const minutes = Math.floor(Math.max(0, now - updatedAt) / 60_000);
  if (minutes < 1) return 'Actualizado hace un momento';
  if (minutes < 60) return `Actualizado hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return hours === 1 ? 'Actualizado hace 1 h' : `Actualizado hace ${hours} h`;
}

/** Venue-local hour (0–23) of an instant, for grouping slots by part of day. */
export function hourInTimeZone(instant: string, timeZone: string): number {
  const hour = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(instant));
  return Number(hour) % 24;
}
