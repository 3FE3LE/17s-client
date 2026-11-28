import { useLocalSearchParams } from 'expo-router';
import type { MobileT } from './i18n';
import { usePlayerVenueQuery, type PublicVenue } from './player-queries';

/**
 * The venue fields the player flow needs before the first render of dates.
 *
 * Booking rules are nullable on purpose: the API schema types the venue search
 * as a full venue, but `GET /7rc/venues` selects only id, name, address and
 * timezone. A venue embedded in a reservation does carry the rules. Null means
 * "unknown" and must never be shown as "no deposit" or "cancel any time".
 */
export interface VenueSnapshot {
  id: string;
  name: string;
  address: string | null;
  timezone: string;
  bookingHorizonDays: number | null;
  depositPercent: number | null;
  cancellationWindowHours: number | null;
  holdMinutes: number | null;
  contactPhone: string | null;
  currency: string | null;
}

type VenueRuleKey =
  | 'bookingHorizonDays'
  | 'depositPercent'
  | 'cancellationWindowHours'
  | 'holdMinutes'
  | 'contactPhone'
  | 'currency';

type VenueLike = Pick<PublicVenue, 'id' | 'name' | 'address' | 'timezone'> & {
  [Key in VenueRuleKey]?: PublicVenue[Key] | null | undefined;
};

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function numberParam(value: string | undefined): number | null {
  if (value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isValidTimeZone(timeZone?: string | null): timeZone is string {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Route params that carry the venue across screens, so the booking form and the
 * venue sheet never depend on whichever (possibly search-filtered) list is cached.
 */
export function venueRouteParams(venue: VenueLike): Record<string, string> {
  return {
    venueId: venue.id,
    vName: venue.name,
    vAddr: venue.address ?? '',
    vTz: venue.timezone,
    vHorizon: String(venue.bookingHorizonDays ?? ''),
    vDeposit: String(venue.depositPercent ?? ''),
    vCancelH: String(venue.cancellationWindowHours ?? ''),
    vHoldMin: String(venue.holdMinutes ?? ''),
    vPhone: venue.contactPhone ?? '',
    vCur: venue.currency ?? '',
  };
}

function snapshotFromParams(params: RawParams): VenueSnapshot | null {
  const id = first(params.venueId);
  const name = first(params.vName);
  const timezone = first(params.vTz);
  if (!id || !name || !isValidTimeZone(timezone)) return null;
  return {
    id,
    name,
    address: first(params.vAddr) || null,
    timezone,
    bookingHorizonDays: numberParam(first(params.vHorizon)),
    depositPercent: numberParam(first(params.vDeposit)),
    cancellationWindowHours: numberParam(first(params.vCancelH)),
    holdMinutes: numberParam(first(params.vHoldMin)),
    contactPhone: first(params.vPhone) || null,
    currency: first(params.vCur) || null,
  };
}

function snapshotFromVenue(venue: VenueLike): VenueSnapshot | null {
  if (!isValidTimeZone(venue.timezone)) return null;
  return {
    id: venue.id,
    name: venue.name,
    address: venue.address ?? null,
    timezone: venue.timezone,
    bookingHorizonDays: venue.bookingHorizonDays ?? null,
    depositPercent: venue.depositPercent ?? null,
    cancellationWindowHours: venue.cancellationWindowHours ?? null,
    holdMinutes: venue.holdMinutes ?? null,
    contactPhone: venue.contactPhone ?? null,
    currency: venue.currency ?? null,
  };
}

export interface VenueSnapshotResult {
  venueId: string | null;
  venue: VenueSnapshot | null;
  /** True while the deep-link fallback is still fetching. */
  isLoading: boolean;
  /** The venue could not be resolved (no params and not in the list). */
  isMissing: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Venue for the current route: from params when present (no request), else
 * from the unfiltered venue list. `venue` stays null until its timezone is
 * known, so callers can hold date rendering instead of flashing a default zone.
 */
export function useVenueSnapshot(): VenueSnapshotResult {
  const params = useLocalSearchParams<RawParams>();
  const venueId = first(params.venueId) ?? null;
  const fromParams = snapshotFromParams(params);
  const lookup = usePlayerVenueQuery(venueId, !fromParams);
  const fromList = lookup.data ? snapshotFromVenue(lookup.data) : null;
  const venue = fromParams ?? fromList;

  return {
    venueId,
    venue,
    isLoading: !venue && Boolean(venueId) && lookup.isLoading,
    isMissing: !venue && (!venueId || (lookup.isSuccess && !fromList)),
    error: !venue ? (lookup.error ?? null) : null,
    refetch: () => {
      void lookup.refetch();
    },
  };
}

/**
 * One-line booking policy from venue settings, mirroring the server rules:
 * a deposit makes the booking wait for the venue; no deposit (or a free slot)
 * confirms at once. `priceMinor` is the selected slot's price, when known.
 */
export function bookingPolicyLine(venue: VenueSnapshot, t: MobileT, priceMinor?: number): string {
  const { depositPercent, cancellationWindowHours, holdMinutes } = venue;
  if (depositPercent === null || cancellationWindowHours === null) {
    return t('bookingPolicy.unknown');
  }
  const parts: string[] = [];
  if (depositPercent > 0 && priceMinor !== 0) {
    parts.push(t('bookingPolicy.deposit', { percent: depositPercent }));
    if (holdMinutes) {
      parts.push(t('bookingPolicy.hold', { minutes: holdMinutes }));
    }
  } else {
    parts.push(t('bookingPolicy.instant'));
  }
  parts.push(
    cancellationWindowHours > 0
      ? t('bookingPolicy.cancelWindow', { hours: cancellationWindowHours })
      : t('bookingPolicy.cancelUntilStart'),
  );
  return `${parts.join(' · ')}.`;
}
