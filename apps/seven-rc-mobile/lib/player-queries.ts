import {
  createSevenRcPlayerApi,
  type CreateReservationInput,
  type Pitch,
  type PublicVenue,
  type ReservationWithVenuePitch,
  useSevenRcCreateReservationMutation,
  useSevenRcMyReservationsQuery,
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

export function useCreateReservationMutation() {
  const api = usePlayerApi();
  return useSevenRcCreateReservationMutation(api);
}

export type { CreateReservationInput, Pitch, PublicVenue, ReservationWithVenuePitch };
