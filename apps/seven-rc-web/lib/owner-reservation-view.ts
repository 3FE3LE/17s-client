import type { VenueReservation } from '@/lib/owner-queries';
import type { Translate } from '@/lib/seven-rc-format';

/** Reservation statuses that can still receive a payment. */
export const PAYABLE_STATUSES = new Set(['pending_confirmation', 'confirmed', 'completed']);

export function customerLabel(reservation: VenueReservation, t: Translate): string {
  return (
    reservation.user?.name ??
    reservation.customerName ??
    reservation.user?.email ??
    t('format:customers.unnamedPlayer')
  );
}
