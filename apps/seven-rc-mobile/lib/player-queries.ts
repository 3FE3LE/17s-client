import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  type CreateReservationInput,
  type ReservationWithVenuePitch,
  type Pitch,
  type PublicVenue,
  createSevenRcPlayerApi,
  resolveApiBaseUrls,
  resolveClerkJwtTemplate,
} from './seven-rc-api';

const playerQueryKeys = {
  reservations: ['seven-rc', 'player', 'reservations'] as const,
  venues: (query?: string) => ['seven-rc', 'player', 'venues', query ?? 'all'] as const,
  venuePitches: (venueId: string) => ['seven-rc', 'player', 'venues', venueId, 'pitches'] as const,
};

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

  return useQuery<ReservationWithVenuePitch[]>({
    queryKey: playerQueryKeys.reservations,
    queryFn: () => api.listMyReservations(),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function usePlayerVenuesQuery(query?: string) {
  const api = usePlayerApi();

  return useQuery<PublicVenue[]>({
    queryKey: playerQueryKeys.venues(query),
    queryFn: () => api.listVenues(query),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function usePlayerVenuePitchesQuery(venueId: string | null) {
  const api = usePlayerApi();

  return useQuery<Pitch[]>({
    queryKey: playerQueryKeys.venuePitches(venueId ?? 'missing'),
    queryFn: () => {
      if (!venueId) {
        throw new Error('Venue id is required');
      }
      return api.listVenuePitches(venueId);
    },
    enabled: Boolean(venueId),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useCreateReservationMutation() {
  const api = usePlayerApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReservationInput) => api.createReservation(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: playerQueryKeys.reservations });
    },
  });
}
