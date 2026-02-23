import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  type CreatePitchInput,
  type CreateVenueInput,
  type ConfigurePitchSlotsInput,
  type VenueReservation,
  createSevenRcOwnerApi,
  resolveApiBaseUrls,
  resolveClerkJwtTemplate,
} from './seven-rc-api';

const ownerQueryKeys = {
  venues: ['seven-rc', 'owner', 'venues'] as const,
  venuePitches: (venueId: string) => ['seven-rc', 'owner', 'venues', venueId, 'pitches'] as const,
  venueReservations: (venueId: string, dateFrom: string, dateTo: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'reservations', dateFrom, dateTo] as const,
};

function useOwnerApi() {
  const { getToken } = useAuth();
  const apiBaseUrls = useMemo(() => resolveApiBaseUrls(), []);
  const jwtTemplate = useMemo(() => resolveClerkJwtTemplate(), []);

  return useMemo(
    () =>
      createSevenRcOwnerApi({
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

export function useOwnerVenuesQuery() {
  const api = useOwnerApi();

  return useQuery({
    queryKey: ownerQueryKeys.venues,
    queryFn: () => api.listOwnerVenues(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useCreateVenueMutation() {
  const queryClient = useQueryClient();
  const api = useOwnerApi();

  return useMutation({
    mutationFn: (input: CreateVenueInput) => api.createVenue(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ownerQueryKeys.venues });
    },
  });
}

export function useOwnerVenuePitchesQuery(venueId: string | null) {
  const api = useOwnerApi();

  return useQuery({
    queryKey: ownerQueryKeys.venuePitches(venueId ?? 'missing'),
    queryFn: () => {
      if (!venueId) {
        throw new Error('Venue id is required');
      }
      return api.listOwnerVenuePitches(venueId);
    },
    enabled: Boolean(venueId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useCreateVenuePitchMutation(venueId: string) {
  const queryClient = useQueryClient();
  const api = useOwnerApi();

  return useMutation({
    mutationFn: (input: CreatePitchInput) => api.createPitchForVenue(venueId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ownerQueryKeys.venuePitches(venueId),
      });
      void queryClient.invalidateQueries({
        queryKey: ownerQueryKeys.venues,
      });
    },
  });
}

export function useConfigurePitchSlotsMutation(pitchId: string, venueId?: string | null) {
  const queryClient = useQueryClient();
  const api = useOwnerApi();

  return useMutation({
    mutationFn: (input: ConfigurePitchSlotsInput) => api.configurePitchSlots(pitchId, input),
    onSuccess: () => {
      if (venueId) {
        void queryClient.invalidateQueries({
          queryKey: ownerQueryKeys.venuePitches(venueId),
        });
      }
    },
  });
}

export function useOwnerVenueReservationsQuery(
  venueId: string | null,
  dateFrom: string,
  dateTo: string,
) {
  const api = useOwnerApi();

  return useQuery<VenueReservation[]>({
    queryKey: ownerQueryKeys.venueReservations(venueId ?? 'missing', dateFrom, dateTo),
    queryFn: () => {
      if (!venueId) {
        throw new Error('Venue id is required');
      }
      return api.listVenueReservations(venueId, dateFrom, dateTo);
    },
    enabled: Boolean(venueId),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
