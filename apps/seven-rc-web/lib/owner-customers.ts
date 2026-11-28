import type { VenueReservation } from '@/lib/owner-queries';
import type { Translate } from '@/lib/seven-rc-format';

/** Statuses that represent a customer actually holding or using a slot. */
const COUNTED_STATUSES = new Set(['pending_confirmation', 'confirmed', 'completed', 'no_show']);

const DAY_MS = 86_400_000;

/**
 * Grouping key for a phone typed in any format. Ten-digit local numbers get the
 * Colombian prefix so "300 123 4567" and "+57 300 123 4567" are one customer.
 * Returns null when there is nothing usable.
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (digits.length < 7) return null;
  return digits.length === 10 ? `57${digits}` : digits;
}

export interface CustomerThresholds {
  /** Counted reservations needed to be a frequent customer. */
  frequentMinBookings: number;
  /** Days without a counted reservation (past or upcoming) before a customer counts as lapsed. */
  lapsedAfterDays: number;
}

export const DEFAULT_THRESHOLDS: CustomerThresholds = {
  frequentMinBookings: 5,
  lapsedAfterDays: 60,
};

export interface CustomerSummary {
  phone: string;
  name: string;
  /** Counted reservations (not cancelled, rejected or expired). */
  bookings: number;
  noShows: number;
  /** Sum of paidMinor over every reservation of the customer, any status. */
  spentMinor: number;
  currency: string;
  lastStartAt: string;
  isFrequent: boolean;
  isLapsed: boolean;
  history: VenueReservation[];
}

export interface CustomerBook {
  customers: CustomerSummary[];
  /** Reservations with no usable phone; they cannot be grouped. */
  withoutPhone: number;
}

function displayName(reservation: VenueReservation, t: Translate): string {
  return (
    reservation.customerName?.trim() ||
    reservation.user?.name?.trim() ||
    reservation.user?.email?.trim() ||
    t('format:customers.unnamedCustomer')
  );
}

/** Groups reservations by normalized phone. Pure: `now` is injected for tests. */
export function buildCustomerBook(
  reservations: readonly VenueReservation[],
  now: number,
  t: Translate,
  thresholds: CustomerThresholds = DEFAULT_THRESHOLDS,
): CustomerBook {
  const groups = new Map<string, VenueReservation[]>();
  let withoutPhone = 0;
  for (const reservation of reservations) {
    const key = normalizePhone(reservation.customerPhone);
    if (!key) {
      withoutPhone += 1;
      continue;
    }
    groups.set(key, [...(groups.get(key) ?? []), reservation]);
  }

  const customers: CustomerSummary[] = [];
  for (const [phone, group] of groups) {
    const history = [...group].sort((a, b) => b.startAt.localeCompare(a.startAt));
    const counted = history.filter((item) => COUNTED_STATUSES.has(item.status));
    const lastStartAt = (counted[0] ?? history[0])?.startAt ?? '';
    const lapsedBefore = now - thresholds.lapsedAfterDays * DAY_MS;
    customers.push({
      phone,
      name: displayName(history[0] as VenueReservation, t),
      bookings: counted.length,
      noShows: counted.filter((item) => item.status === 'no_show').length,
      spentMinor: history.reduce((sum, item) => sum + item.paidMinor, 0),
      currency: (history[0] as VenueReservation).currency,
      lastStartAt,
      isFrequent: counted.length >= thresholds.frequentMinBookings,
      isLapsed: counted.length > 0 && Date.parse(lastStartAt) < lapsedBefore,
      history,
    });
  }
  customers.sort((a, b) => b.lastStartAt.localeCompare(a.lastStartAt));
  return { customers, withoutPhone };
}

export type CustomerFilter = 'all' | 'frequent' | 'lapsed';

const CUSTOMER_FILTERS: ReadonlyArray<CustomerFilter> = ['all', 'frequent', 'lapsed'];

export function customerFilterOptions(
  t: Translate,
): Array<{ value: CustomerFilter; label: string }> {
  return CUSTOMER_FILTERS.map((value) => ({ value, label: t(`format:customers.filter.${value}`) }));
}

export function isCustomerFilter(value: string): value is CustomerFilter {
  return CUSTOMER_FILTERS.some((option) => option === value);
}

export function filterCustomers(
  customers: readonly CustomerSummary[],
  filter: CustomerFilter,
): CustomerSummary[] {
  return customers.filter(
    (customer) =>
      filter === 'all' || (filter === 'frequent' ? customer.isFrequent : customer.isLapsed),
  );
}

/** Whole number in [min, max], or the fallback. Guards the threshold inputs. */
export function clampInt(value: string, min: number, max: number, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}
