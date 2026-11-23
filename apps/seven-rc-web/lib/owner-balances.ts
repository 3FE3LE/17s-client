import type { VenueReservation } from '@/lib/owner-queries';
import { outstandingMinor } from '@/lib/owner-report';

export type PaymentFilter = 'all' | VenueReservation['paymentStatus'];

export const PAYMENT_FILTER_OPTIONS: ReadonlyArray<{ value: PaymentFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'unpaid', label: 'Sin pagar' },
  { value: 'deposit_paid', label: 'Anticipo pagado' },
  { value: 'paid', label: 'Pagadas' },
  { value: 'refunded', label: 'Reembolsadas' },
];

export function isPaymentFilter(value: string): value is PaymentFilter {
  return PAYMENT_FILTER_OPTIONS.some((option) => option.value === value);
}

export function paymentStatusLabel(status: VenueReservation['paymentStatus']): string {
  return PAYMENT_FILTER_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

/** Reservations matching the payment filter, oldest first. */
export function filterByPayment(
  reservations: readonly VenueReservation[],
  filter: PaymentFilter,
): VenueReservation[] {
  return reservations
    .filter((reservation) => filter === 'all' || reservation.paymentStatus === filter)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

/** Whether the payment dialog is useful: money is owed or something was paid (refund). */
export function canRecordPayment(reservation: VenueReservation): boolean {
  return outstandingMinor(reservation) > 0 || reservation.paidMinor > 0;
}
