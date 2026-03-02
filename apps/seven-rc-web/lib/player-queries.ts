'use client';

import {
  createSevenRcPlayerApi,
  type CreateReservationInput,
  type Pitch,
  type PublicVenue,
  type ReservationWithVenuePitch,
  type ReservationBase,
  useSevenRcCancelReservationMutation,
  useSevenRcCreateReservationMutation,
  useSevenRcMyReservationsQuery,
  useSevenRcPlayerVenuePitchesQuery,
  useSevenRcPlayerVenuesQuery,
} from '@17suit/module-seven-reservations-club/client';
import { useMemo } from 'react';

function usePlayerApi() {
  return useMemo(
    () =>
      createSevenRcPlayerApi({
        apiBaseUrls: ['/api'],
        getAccessToken: async () => 'web-bff',
      }),
    [],
  );
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

export function useMyReservationsQuery() {
  const api = usePlayerApi();
  return useSevenRcMyReservationsQuery(api);
}

export function useCancelReservationMutation() {
  const api = usePlayerApi();
  return useSevenRcCancelReservationMutation(api);
}

export type {
  CreateReservationInput,
  Pitch,
  PublicVenue,
  ReservationBase,
  ReservationWithVenuePitch,
};
