import type { PitchWithPricing } from '@/lib/owner-queries';

/** Current week as the slots endpoint expects it (it replaces the whole week). */
export function weekPayload(openingHours: PitchWithPricing['openingHours']) {
  return Object.entries(openingHours ?? {})
    .filter(([, hours]) => hours.openTime && hours.closeTime)
    .map(([day, hours]) => ({
      dayOfWeek: Number(day),
      openTime: hours.openTime as string,
      closeTime: hours.closeTime as string,
    }));
}
