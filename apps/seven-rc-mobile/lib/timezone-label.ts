/**
 * Friendly city names for the IANA zones venues use most. Anything not listed
 * falls back to the zone's last segment ("America/Port_of_Spain" -> "Port of Spain").
 */
const ZONE_CITIES: Record<string, string> = {
  'America/Bogota': 'Bogotá',
  'America/Mexico_City': 'Ciudad de México',
  'America/Monterrey': 'Monterrey',
  'America/Cancun': 'Cancún',
  'America/Tijuana': 'Tijuana',
  'America/Lima': 'Lima',
  'America/Guayaquil': 'Guayaquil',
  'America/Caracas': 'Caracas',
  'America/La_Paz': 'La Paz',
  'America/Santiago': 'Santiago',
  'America/Argentina/Buenos_Aires': 'Buenos Aires',
  'America/Buenos_Aires': 'Buenos Aires',
  'America/Montevideo': 'Montevideo',
  'America/Asuncion': 'Asunción',
  'America/Sao_Paulo': 'São Paulo',
  'America/Panama': 'Panamá',
  'America/Costa_Rica': 'San José',
  'America/Guatemala': 'Guatemala',
  'America/El_Salvador': 'San Salvador',
  'America/Tegucigalpa': 'Tegucigalpa',
  'America/Managua': 'Managua',
  'America/Santo_Domingo': 'Santo Domingo',
  'America/Havana': 'La Habana',
  'America/Puerto_Rico': 'San Juan',
  'America/New_York': 'Nueva York',
  'America/Chicago': 'Chicago',
  'America/Denver': 'Denver',
  'America/Los_Angeles': 'Los Ángeles',
  'America/Toronto': 'Toronto',
  'Europe/Madrid': 'Madrid',
  'Europe/London': 'Londres',
  'Europe/Paris': 'París',
  'Europe/Lisbon': 'Lisboa',
  'Europe/Rome': 'Roma',
  'Europe/Berlin': 'Berlín',
};

export function timeZoneCity(timeZone: string): string {
  const mapped = ZONE_CITIES[timeZone];
  if (mapped) return mapped;
  const last = timeZone.split('/').pop() ?? timeZone;
  return last.replace(/_/g, ' ');
}

/** "Hora de Bogotá" (or "Hora UTC"). */
export function venueTimeLabel(timeZone?: string | null): string {
  if (!timeZone) return 'Hora del complejo';
  if (timeZone === 'UTC' || timeZone === 'Etc/UTC') return 'Hora UTC';
  return `Hora de ${timeZoneCity(timeZone)}`;
}
