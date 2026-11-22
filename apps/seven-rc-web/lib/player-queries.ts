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
  type SevenRcRefreshOptions,
  useSevenRcCancelReservationMutation,
  useSevenRcCreateReservationMutation,
  useSevenRcMyReservationsQuery,
  useSevenRcPitchAvailabilityQuery,
  useSevenRcPlayerVenuePitchesQuery,
  useSevenRcPlayerVenuesQuery,
} from '@17suit/module-seven-reservations-club/client';
import { useMemo } from 'react';
import { useAccessToken } from '@/lib/use-access-token';

function usePlayerApi() {
  const getAccessToken = useAccessToken();
  return useMemo(
    () => createSevenRcPlayerApi({ apiBaseUrls: ['/api'], getAccessToken }),
    [getAccessToken],
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

export function useCreateReservationMutation() {
  const api = usePlayerApi();
  return useSevenRcCreateReservationMutation(api);
}

export function useMyReservationsQuery(
  options?: SevenRcRefreshOptions<ReservationWithVenuePitch[]>,
) {
  const api = usePlayerApi();
  return useSevenRcMyReservationsQuery(api, options);
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
