'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ConfigurePitchSlotsInput,
  CreatePitchInput,
  CreateReservationInput,
  CreateVenueInput,
  OwnerVenue,
  Pitch,
  PublicVenue,
  ReservationBase,
  ReservationWithVenuePitch,
  SevenRcOwnerApi,
  SevenRcPlayerApi,
  VenueReservation,
} from '../sdk/seven-rc-api';

export const sevenRcQueryKeys = {
  ownerVenues: ['seven-rc', 'owner', 'venues'] as const,
  ownerVenuePitches: (venueId: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'pitches'] as const,
  ownerVenueReservationsBase: (venueId: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'reservations'] as const,
  ownerVenueReservations: (venueId: string, dateFrom: string, dateTo: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'reservations', dateFrom, dateTo] as const,
  playerReservations: ['seven-rc', 'player', 'reservations'] as const,
  playerVenues: (query?: string) => ['seven-rc', 'player', 'venues', query ?? 'all'] as const,
  playerVenuePitches: (venueId: string) =>
    ['seven-rc', 'player', 'venues', venueId, 'pitches'] as const,
};

export function useSevenRcOwnerVenuesQuery(api: SevenRcOwnerApi) {
  return useQuery<OwnerVenue[]>({
    queryKey: sevenRcQueryKeys.ownerVenues,
    queryFn: () => api.listOwnerVenues(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useSevenRcCreateVenueMutation(api: SevenRcOwnerApi) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVenueInput) => api.createVenue(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenues });
    },
  });
}

export function useSevenRcOwnerVenuePitchesQuery(api: SevenRcOwnerApi, venueId: string | null) {
  return useQuery<Pitch[]>({
    queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId ?? 'missing'),
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

export function useSevenRcCreateVenuePitchMutation(api: SevenRcOwnerApi, venueId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePitchInput) => api.createPitchForVenue(venueId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId),
      });
      void queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.ownerVenues,
      });
    },
  });
}

export function useSevenRcConfigurePitchSlotsMutation(
  api: SevenRcOwnerApi,
  pitchId: string,
  venueId?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConfigurePitchSlotsInput) => api.configurePitchSlots(pitchId, input),
    onSuccess: () => {
      if (venueId) {
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId),
        });
      }
    },
  });
}

export function useSevenRcOwnerVenueReservationsQuery(
  api: SevenRcOwnerApi,
  venueId: string | null,
  dateFrom: string,
  dateTo: string,
) {
  return useQuery<VenueReservation[]>({
    queryKey: sevenRcQueryKeys.ownerVenueReservations(venueId ?? 'missing', dateFrom, dateTo),
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

export function useSevenRcConfirmVenueReservationMutation(
  api: SevenRcOwnerApi,
  venueId?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation<ReservationBase, Error, string>({
    mutationFn: (reservationId: string) => api.confirmReservation(reservationId),
    onSuccess: () => {
      if (venueId) {
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenueReservationsBase(venueId),
        });
      }
    },
  });
}

export function useSevenRcRejectVenueReservationMutation(
  api: SevenRcOwnerApi,
  venueId?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation<ReservationBase, Error, string>({
    mutationFn: (reservationId: string) => api.rejectReservation(reservationId),
    onSuccess: () => {
      if (venueId) {
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenueReservationsBase(venueId),
        });
      }
    },
  });
}

export function useSevenRcMyReservationsQuery(api: SevenRcPlayerApi) {
  return useQuery<ReservationWithVenuePitch[]>({
    queryKey: sevenRcQueryKeys.playerReservations,
    queryFn: () => api.listMyReservations(),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useSevenRcPlayerVenuesQuery(api: SevenRcPlayerApi, query?: string) {
  return useQuery<PublicVenue[]>({
    queryKey: sevenRcQueryKeys.playerVenues(query),
    queryFn: () => api.listVenues(query),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useSevenRcPlayerVenuePitchesQuery(api: SevenRcPlayerApi, venueId: string | null) {
  return useQuery<Pitch[]>({
    queryKey: sevenRcQueryKeys.playerVenuePitches(venueId ?? 'missing'),
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

export function useSevenRcCreateReservationMutation(api: SevenRcPlayerApi) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReservationInput) => api.createReservation(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.playerReservations });
    },
  });
}

export function useSevenRcCancelReservationMutation(api: SevenRcPlayerApi) {
  const queryClient = useQueryClient();

  return useMutation<ReservationBase, Error, string>({
    mutationFn: (reservationId: string) => api.cancelReservation(reservationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.playerReservations });
    },
  });
}
