/** Max consecutive slots in one reservation; mirrors the server limit (`tooManySlots`). */
export const MAX_CONSECUTIVE_SLOTS = 8;
export const DEFAULT_HORIZON_DAYS = 14;
const MAX_DAY_CHIPS = 30;

/** Day chips to render: the venue's booking horizon (default only when unknown), capped. */
export function bookingDayChipCount(horizonDays: number | null | undefined): number {
  const horizon = horizonDays ?? DEFAULT_HORIZON_DAYS;
  return Math.min(MAX_DAY_CHIPS, Math.max(1, horizon));
}
