import 'server-only';

import { loadEnv } from '@17suit/core';
import type { ApiSchema } from '@17suit/core/api-types';

export type PublicVenue = ApiSchema<'PublicVenueResponseDto'>;
export type PublicVenueAvailability = ApiSchema<'PublicVenueAvailabilityResponseDto'>;
export type PublicReservation = ApiSchema<'PublicReservationResponseDto'>;
export type CreatePublicReservationInput = ApiSchema<'CreatePublicReservationDto'>;

function apiBaseUrl(): string {
  return loadEnv()
    .API_BASE_URL.replace(/\/+$/, '')
    .replace(/\/api$/, '');
}

/** `null` when the venue does not exist or is not published (server answers 404). */
async function getPublic<T>(
  path: string,
  init: RequestInit,
  onBadRequest?: () => T,
): Promise<T | null> {
  const response = await fetch(`${apiBaseUrl()}/api/7rc/public/${path}`, {
    ...init,
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) return null;
  if (response.status === 400 && onBadRequest) return onBadRequest();
  if (!response.ok) {
    throw new Error(`Public venue request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export function fetchPublicVenue(slug: string): Promise<PublicVenue | null> {
  return getPublic<PublicVenue>(`venues/${encodeURIComponent(slug)}`, {
    // `today` and `policyVersion` must be current at request time, so this is never cached.
    cache: 'no-store',
  });
}

/**
 * Availability changes with every booking, so it is never cached. A 400 (date outside the
 * booking window, e.g. a stale `today`) comes back as an empty day instead of a 500.
 */
export function fetchPublicVenueAvailability(
  slug: string,
  date: string,
): Promise<PublicVenueAvailability | null> {
  return getPublic<PublicVenueAvailability>(
    `venues/${encodeURIComponent(slug)}/availability?date=${encodeURIComponent(date)}`,
    { cache: 'no-store' },
    () => emptyAvailability(date),
  );
}

export function emptyAvailability(date: string): PublicVenueAvailability {
  return { venueId: '', date, timezone: '', currency: '', pitches: [] };
}

/** `null` when the token does not match any reservation. Never cached: status changes. */
export function fetchPublicReservation(token: string): Promise<PublicReservation | null> {
  return getPublic<PublicReservation>(`reservations/${encodeURIComponent(token)}`, {
    cache: 'no-store',
  });
}

export type CreatePublicReservationResult =
  | { ok: true; reservation: PublicReservation }
  | {
      ok: false;
      status: number;
      message: string;
      code: string;
      errorKey: string;
      params: Record<string, string | number>;
    };

function errorCode(body: unknown): string {
  const code = (body as { code?: unknown } | null)?.code;
  return typeof code === 'string' ? code : '';
}

function errorKey(body: unknown): string {
  const key = (body as { errorKey?: unknown } | null)?.errorKey;
  return typeof key === 'string' ? key : '';
}

function errorParams(body: unknown): Record<string, string | number> {
  const params = (body as { params?: unknown } | null)?.params;
  if (!params || typeof params !== 'object') return {};
  return Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, string | number] =>
        typeof entry[1] === 'string' || typeof entry[1] === 'number',
    ),
  );
}

function errorMessage(body: unknown): string {
  const message = (body as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) return message.join('; ');
  return typeof message === 'string' ? message : '';
}

/** Failures come back as data so the caller can map 409/429 to copy; only network errors throw. */
export async function createPublicReservation(
  slug: string,
  input: CreatePublicReservationInput,
): Promise<CreatePublicReservationResult> {
  const response = await fetch(
    `${apiBaseUrl()}/api/7rc/public/venues/${encodeURIComponent(slug)}/reservations`,
    {
      method: 'POST',
      cache: 'no-store',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: errorMessage(body),
      code: errorCode(body),
      errorKey: errorKey(body),
      params: errorParams(body),
    };
  }
  return { ok: true, reservation: body as PublicReservation };
}

export type CancelPublicReservationResult =
  | { ok: true; reservation: PublicReservation }
  | { ok: false; status: number };

/** Outside the cancellation window the server answers 400; only network errors throw. */
export async function cancelPublicReservation(
  token: string,
): Promise<CancelPublicReservationResult> {
  const response = await fetch(
    `${apiBaseUrl()}/api/7rc/public/reservations/${encodeURIComponent(token)}/cancel`,
    { method: 'POST', cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (!response.ok) return { ok: false, status: response.status };
  return { ok: true, reservation: (await response.json()) as PublicReservation };
}
