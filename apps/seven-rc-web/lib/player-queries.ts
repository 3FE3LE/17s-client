'use client';

import {
  createSevenRcPlayerApi,
  type AvailabilitySlot,
  type CreateReservationInput,
  type Pitch,
  type PitchAvailability,
  type PublicVenue,
  type ReservationWithVenuePitch,
  type ReservationBase,
  sevenRcQueryKeys,
  useSevenRcCancelReservationMutation,
  useSevenRcCreateReservationMutation,
  useSevenRcMyReservationsQuery,
  useSevenRcPitchAvailabilityQuery,
  useSevenRcPlayerVenuePitchesQuery,
  useSevenRcPlayerVenuesQuery,
} from '@17suit/module-seven-reservations-club/client';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

function usePlayerApi() {
  return useMemo(
    () =>
      createSevenRcPlayerApi({
        apiBaseUrls: ['/api'],
        getAccessToken: () => Promise.resolve('web-bff'),
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

export function usePitchAvailabilityQuery(pitchId: string | null, date: string | null) {
  const api = usePlayerApi();
  return useSevenRcPitchAvailabilityQuery(api, pitchId, date);
}

/** Booking or cancelling changes which slots are free; call after either settles. */
export function useInvalidatePitchAvailability() {
  const queryClient = useQueryClient();
  return useCallback(
    (pitchId: string) =>
      queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.pitchAvailabilityBase(pitchId),
      }),
    [queryClient],
  );
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
  AvailabilitySlot,
  CreateReservationInput,
  Pitch,
  PitchAvailability,
  PublicVenue,
  ReservationBase,
  ReservationWithVenuePitch,
};
