import type { VenueReservation } from '@/lib/owner-queries';

/** Reservation statuses that can still receive a payment. */
export const PAYABLE_STATUSES = new Set(['pending_confirmation', 'confirmed', 'completed']);

export function customerLabel(reservation: VenueReservation): string {
  return (
    reservation.user?.name ??
    reservation.customerName ??
    reservation.user?.email ??
    'Jugador sin nombre'
  );
}
