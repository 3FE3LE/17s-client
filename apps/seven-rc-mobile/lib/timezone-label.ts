import type { MobileT } from './i18n';

/**
 * Friendly city names for the IANA zones venues use most live in the catalog
 * (`timeZoneCities.<zone>`). Anything not listed falls back to the zone's last
 * segment ("America/Port_of_Spain" -> "Port of Spain").
 */

export function timeZoneCity(timeZone: string, t: MobileT): string {
  const mapped = t(`timeZoneCities.${timeZone}`, { defaultValue: '' });
  if (mapped) return mapped;
  const last = timeZone.split('/').pop() ?? timeZone;
  return last.replace(/_/g, ' ');
}

/** "Hora de Bogotá" (or "Hora UTC"). */
export function venueTimeLabel(timeZone: string | null | undefined, t: MobileT): string {
  if (!timeZone) return t('timeLabel.venue');
  if (timeZone === 'UTC' || timeZone === 'Etc/UTC') return t('timeLabel.utc');
  return t('timeLabel.city', { city: timeZoneCity(timeZone, t) });
}
