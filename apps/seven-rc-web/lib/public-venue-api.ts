import 'server-only';

import { loadEnv } from '@17suit/core';
import type { ApiSchema } from '@17suit/core/api-types';

export type PublicVenue = ApiSchema<'PublicVenueResponseDto'>;
export type PublicVenueAvailability = ApiSchema<'PublicVenueAvailabilityResponseDto'>;

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
