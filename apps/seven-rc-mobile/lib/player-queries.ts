import {
  createSevenRcPlayerApi,
  type CreateReservationInput,
  type Pitch,
  type PitchAvailability,
  type PublicVenue,
  type ReservationWithVenuePitch,
  type SevenRcRefreshOptions,
  useSevenRcCancelReservationMutation,
  useSevenRcCreateReservationMutation,
  useSevenRcMyReservationsQuery,
  useSevenRcPitchAvailabilityQuery,
  useSevenRcPlayerVenuePitchesQuery,
  useSevenRcPlayerVenuesQuery,
  sevenRcQueryKeys,
} from '@17suit/module-seven-reservations-club/client';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { resolveApiBaseUrls, resolveClerkJwtTemplate } from './seven-rc-api';

function usePlayerApi() {
  const { getToken } = useAuth();
  const apiBaseUrls = useMemo(() => resolveApiBaseUrls(), []);
  const jwtTemplate = useMemo(() => resolveClerkJwtTemplate(), []);

  return useMemo(
    () =>
      createSevenRcPlayerApi({
        apiBaseUrls,
        getAccessToken: async () => {
          if (jwtTemplate) {
            return (await getToken({ template: jwtTemplate })) ?? null;
          }
          return (await getToken()) ?? null;
        },
      }),
    [apiBaseUrls, getToken, jwtTemplate],
  );
}

export function useMyReservationsQuery(
  options?: SevenRcRefreshOptions<ReservationWithVenuePitch[]>,
) {
  const api = usePlayerApi();
  return useSevenRcMyReservationsQuery(api, options);
}

export function usePlayerVenuesQuery(query?: string) {
  const api = usePlayerApi();
  return useSevenRcPlayerVenuesQuery(api, query);
}

/**
 * One venue from the unfiltered venue list (same cache entry as the home list
 * with no search). The SDK has no get-by-id, so this is the deep-link fallback
 * when the venue did not arrive through route params; pass `enabled: false`
 * when it did, so no request is made.
 */
export function usePlayerVenueQuery(venueId: string | null, enabled = true) {
  const api = usePlayerApi();
  return useQuery<PublicVenue[], Error, PublicVenue | null>({
    queryKey: sevenRcQueryKeys.playerVenues(undefined),
    queryFn: () => api.listVenues(undefined),
    select: (venues) => venues.find((venue) => venue.id === venueId) ?? null,
    enabled: enabled && Boolean(venueId),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function usePlayerVenuePitchesQuery(venueId: string | null) {
  const api = usePlayerApi();
  return useSevenRcPlayerVenuePitchesQuery(api, venueId);
}

/** Venue-local slot availability for a pitch on `date` (YYYY-MM-DD). */
export function usePitchAvailabilityQuery(pitchId: string | null, date: string | null) {
  const api = usePlayerApi();
  return useSevenRcPitchAvailabilityQuery(api, pitchId, date);
}

export function useCreateReservationMutation() {
  const api = usePlayerApi();
  return useSevenRcCreateReservationMutation(api);
}

export function useCancelReservationMutation() {
  const api = usePlayerApi();
  return useSevenRcCancelReservationMutation(api);
}

export type {
  CreateReservationInput,
  Pitch,
  PitchAvailability,
  PublicVenue,
  ReservationWithVenuePitch,
};
