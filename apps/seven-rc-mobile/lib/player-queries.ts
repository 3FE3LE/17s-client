import {
  createSevenRcPlayerApi,
  type CreateReservationInput,
  type Pitch,
  type PitchAvailability,
  type PublicVenue,
  type ReservationWithVenuePitch,
  useSevenRcCancelReservationMutation,
  useSevenRcCreateReservationMutation,
  useSevenRcMyReservationsQuery,
  useSevenRcPitchAvailabilityQuery,
  useSevenRcPlayerVenuePitchesQuery,
  useSevenRcPlayerVenuesQuery,
} from '@17suit/module-seven-reservations-club/client';
import { useAuth } from '@clerk/clerk-expo';
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

export function useMyReservationsQuery() {
  const api = usePlayerApi();
  return useSevenRcMyReservationsQuery(api);
}

export function usePlayerVenuesQuery(query?: string) {
  const api = usePlayerApi();
  return useSevenRcPlayerVenuesQuery(api, query);
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
