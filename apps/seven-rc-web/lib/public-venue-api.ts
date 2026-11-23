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
async function getPublic<T>(path: string, init: RequestInit): Promise<T | null> {
  const response = await fetch(`${apiBaseUrl()}/api/7rc/public/${path}`, {
    ...init,
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Public venue request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export function fetchPublicVenue(slug: string): Promise<PublicVenue | null> {
  return getPublic<PublicVenue>(`venues/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
}

/** Availability changes with every booking, so it is never cached. */
export function fetchPublicVenueAvailability(
  slug: string,
  date: string,
): Promise<PublicVenueAvailability | null> {
  return getPublic<PublicVenueAvailability>(
    `venues/${encodeURIComponent(slug)}/availability?date=${encodeURIComponent(date)}`,
    { cache: 'no-store' },
  );
}

/** `null` when the token does not match any reservation. Never cached: status changes. */
export function fetchPublicReservation(token: string): Promise<PublicReservation | null> {
  return getPublic<PublicReservation>(`reservations/${encodeURIComponent(token)}`, {
    cache: 'no-store',
  });
}

export type CreatePublicReservationResult =
  | { ok: true; reservation: PublicReservation }
  | { ok: false; status: number; message: string };

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
    return { ok: false, status: response.status, message: errorMessage(body) };
  }
  return { ok: true, reservation: body as PublicReservation };
}
