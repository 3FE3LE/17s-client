export const DEFAULT_BOOKING_HORIZON_DAYS = 14;
/** Upper bound for the date strip so a very long horizon cannot render hundreds of chips. */
export const MAX_DATE_STRIP_DAYS = 60;

/**
 * Number of selectable days (today included) for a venue: the server accepts
 * [today, today + horizon]. Falls back to the default only when the horizon is unknown.
 */
export function bookingStripLength(horizonDays: number | null | undefined): number {
  const horizon =
    typeof horizonDays === 'number' && Number.isFinite(horizonDays) && horizonDays >= 0
      ? Math.floor(horizonDays)
      : DEFAULT_BOOKING_HORIZON_DAYS;
  return Math.min(MAX_DATE_STRIP_DAYS, horizon + 1);
}
