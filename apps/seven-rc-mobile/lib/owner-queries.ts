import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  type CreatePitchInput,
  type CreateVenueInput,
  createSevenRcOwnerApi,
  resolveApiBaseUrls,
  resolveClerkJwtTemplate,
} from './seven-rc-api';

const ownerQueryKeys = {
  venues: ['seven-rc', 'owner', 'venues'] as const,
  venuePitches: (venueId: string) => ['seven-rc', 'owner', 'venues', venueId, 'pitches'] as const,
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
    staleTime: 15_000,
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
    staleTime: 15_000,
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
