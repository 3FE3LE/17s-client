/** Server `errorKey`s that mean the slot list on screen is stale and must be refetched. */
export const SLOT_CONFLICT_ERROR_KEYS = [
  'slotNotAligned',
  'slotAlreadyStarted',
  'outsideBookingWindow',
  'slotBlocked',
  'slotUnavailable',
] as const;

export type SlotConflictErrorKey = (typeof SLOT_CONFLICT_ERROR_KEYS)[number];

export function isSlotConflictErrorKey(value: unknown): value is SlotConflictErrorKey {
  return (
    typeof value === 'string' && (SLOT_CONFLICT_ERROR_KEYS as readonly string[]).includes(value)
  );
}
