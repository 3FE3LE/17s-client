import type { AppBadgeProps } from '@17suit/ui';

/** Locale of typed amounts (parse/format of input fields). Display text follows `intlLocale`. */
export const DISPLAY_LOCALE = 'es-CO';

/** Translator accepted by the formatting helpers (`t` from `useTranslation` or `getFixedT`). */
export interface Translate {
  (key: string): string;
  (key: string, options: Record<string, unknown>): string;
}

/** BCP 47 tag used by `Intl` for an app locale (`en`, `es`). */
export function intlLocale(locale: string): string {
  return locale.toLowerCase().startsWith('en') ? 'en-US' : DISPLAY_LOCALE;
}

/** Launch market default. Venues carry their own IANA zone; this only fills gaps. */
export const DEFAULT_TIMEZONE = 'America/Bogota';

const TIMEZONES: ReadonlyArray<{ value: string; key: string }> = [
  { value: 'America/Bogota', key: 'bogota' },
  { value: 'America/Mexico_City', key: 'mexicoCity' },
  { value: 'America/Lima', key: 'lima' },
  { value: 'America/Guayaquil', key: 'guayaquil' },
  { value: 'America/Panama', key: 'panama' },
  { value: 'America/Caracas', key: 'caracas' },
  { value: 'America/Santiago', key: 'santiago' },
  { value: 'America/Argentina/Buenos_Aires', key: 'buenosAires' },
  { value: 'America/Sao_Paulo', key: 'saoPaulo' },
  { value: 'America/Montevideo', key: 'montevideo' },
  { value: 'America/Asuncion', key: 'asuncion' },
  { value: 'America/La_Paz', key: 'laPaz' },
  { value: 'America/Costa_Rica', key: 'costaRica' },
  { value: 'America/Guatemala', key: 'guatemala' },
  { value: 'America/El_Salvador', key: 'elSalvador' },
  { value: 'America/Tegucigalpa', key: 'tegucigalpa' },
  { value: 'America/Managua', key: 'managua' },
  { value: 'America/Santo_Domingo', key: 'santoDomingo' },
  { value: 'America/Puerto_Rico', key: 'puertoRico' },
  { value: 'America/New_York', key: 'newYork' },
  { value: 'America/Chicago', key: 'chicago' },
  { value: 'America/Los_Angeles', key: 'losAngeles' },
  { value: 'Europe/Madrid', key: 'madrid' },
];

/** IANA zones offered when an owner creates a complejo. LatAm first, then the rest. */
export function venueTimezoneOptions(t: Translate): Array<{ value: string; label: string }> {
  return TIMEZONES.map(({ value, key }) => ({ value, label: t(`format:timezones.${key}`) }));
}

const WEEKDAY_KEYS: ReadonlyArray<{ value: number; key: string }> = [
  { value: 1, key: 'monday' },
  { value: 2, key: 'tuesday' },
  { value: 3, key: 'wednesday' },
  { value: 4, key: 'thursday' },
  { value: 5, key: 'friday' },
  { value: 6, key: 'saturday' },
  { value: 0, key: 'sunday' },
];

/** Monday-first week with localized names. */
export function weekdayOptions(t: Translate): Array<{ value: number; label: string }> {
  return WEEKDAY_KEYS.map(({ value, key }) => ({ value, label: t(`format:weekdays.${key}`) }));
}

const SPORTS: ReadonlyArray<{ value: string; key: string }> = [
  { value: 'futbol-5', key: 'futbol5' },
  { value: 'futbol-7', key: 'futbol7' },
  { value: 'futbol-8', key: 'futbol8' },
  { value: 'futbol-11', key: 'futbol11' },
  { value: 'padel', key: 'padel' },
  { value: 'tenis', key: 'tenis' },
  { value: 'baloncesto', key: 'baloncesto' },
  { value: 'voleibol', key: 'voleibol' },
];

export function sportOptions(t: Translate): Array<{ value: string; label: string }> {
  return SPORTS.map(({ value, key }) => ({ value, label: t(`format:sports.${key}`) }));
}

export function sportLabel(value: string, t: Translate): string {
  const sport = SPORTS.find((option) => option.value === value);
  return sport ? t(`format:sports.${sport.key}`) : value;
}

/** Returns a usable IANA zone: the venue's when valid, otherwise the launch default. */
export function safeTimeZone(timeZone: string | null | undefined): string {
  if (!timeZone) return DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
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
export function formatDateKey(
  dateKey: string,
  options: Intl.DateTimeFormatOptions,
  locale: string,
): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { ...options, timeZone: 'UTC' }).format(
    dateKeyToUtcNoon(dateKey),
  );
}

export function formatLongDate(dateKey: string, locale: string): string {
  return formatDateKey(dateKey, { weekday: 'long', day: 'numeric', month: 'long' }, locale);
}

export function formatTime(instant: string, timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(instant));
}

/** "antes de las 7:30 p. m." / "antes de la 1:05 p. m." */
export function formatBeforeTime(
  instant: string,
  timeZone: string,
  locale: string,
  t: Translate,
): string {
  const time = formatTime(instant, timeZone, locale);
  return t(`format:beforeTime.${time.startsWith('1:') ? 'singular' : 'default'}`, { time });
}

export function formatTimeRange(
  startAt: string,
  endAt: string,
  timeZone: string,
  locale: string,
): string {
  return `${formatTime(startAt, timeZone, locale)} – ${formatTime(endAt, timeZone, locale)}`;
}

/** "sábado 22 de noviembre · 7:00 p. m. – 8:00 p. m." in the venue zone. */
export function formatSlotWhen(
  startAt: string,
  endAt: string,
  timeZone: string,
  locale: string,
): string {
  return `${formatLongDate(dateKeyInTimeZone(startAt, timeZone), locale)} · ${formatTimeRange(
    startAt,
    endAt,
    timeZone,
    locale,
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
export function formatMoneyMinor(amountMinor: number, currency: string, locale: string): string {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: 'currency',
      currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString(intlLocale(locale))} ${currency}`;
  }
}

type BadgeVariant = NonNullable<AppBadgeProps['variant']>;

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending_confirmation: 'warning',
  confirmed: 'success',
  rejected: 'destructive',
  cancelled: 'neutral',
  completed: 'info',
  expired: 'neutral',
  no_show: 'destructive',
};

export function reservationStatus(
  status: string,
  t: Translate,
): { label: string; variant: BadgeVariant } {
  const variant = STATUS_VARIANT[status];
  return variant
    ? { label: t(`format:status.${status}`), variant }
    : { label: status.replaceAll('_', ' '), variant: 'neutral' };
}

/** "Actualizado hace 3 min" from a React Query `dataUpdatedAt` and a ticking `now`. */
export function formatUpdatedAgo(updatedAt: number, now: number, t: Translate): string {
  if (!updatedAt) return t('format:updated.never');
  const minutes = Math.floor(Math.max(0, now - updatedAt) / 60_000);
  if (minutes < 1) return t('format:updated.justNow');
  if (minutes < 60) return t('format:updated.minutesAgo', { minutes });
  return t('format:updated.hoursAgo', { hours: Math.floor(minutes / 60) });
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

/**
 * The instant at which the venue's wall clock reads `dateKey` + `HH:MM`.
 * Resolves the zone offset at that moment, so DST is handled without a date library.
 */
export function zonedTimeToInstant(dateKey: string, time: string, timeZone: string): Date {
  const [year = 1970, month = 1, day = 1] = dateKey.split('-').map(Number);
  const [hour = 0, minute = 0] = time.split(':').map(Number);
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  const offsetAt = (instant: number) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).formatToParts(new Date(instant));
    const read = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);
    const asUtc = Date.UTC(
      read('year'),
      read('month') - 1,
      read('day'),
      read('hour'),
      read('minute'),
    );
    return asUtc - instant;
  };
  const first = wall - offsetAt(wall);
  return new Date(wall - offsetAt(first));
}
