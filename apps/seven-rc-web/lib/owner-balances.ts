import type { VenueReservation } from '@/lib/owner-queries';
import type { Translate } from '@/lib/seven-rc-format';
import { outstandingMinor } from '@/lib/owner-report';

export type PaymentFilter = 'all' | VenueReservation['paymentStatus'];

const PAYMENT_FILTERS: ReadonlyArray<PaymentFilter> = [
  'all',
  'unpaid',
  'deposit_paid',
  'paid',
  'refunded',
];

export function paymentFilterOptions(t: Translate): Array<{ value: PaymentFilter; label: string }> {
  return PAYMENT_FILTERS.map((value) => ({ value, label: t(`format:payment.filter.${value}`) }));
}

export function isPaymentFilter(value: string): value is PaymentFilter {
  return PAYMENT_FILTERS.some((option) => option === value);
}

export function paymentStatusLabel(
  status: VenueReservation['paymentStatus'],
  t: Translate,
): string {
  return PAYMENT_FILTERS.includes(status) ? t(`format:payment.filter.${status}`) : status;
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
