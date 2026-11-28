'use client';

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type {
  ConfigurePitchPolicyInput,
  CustomerHistory,
  MarkNoShowInput,
  ConfigurePitchPricingInput,
  ConfigurePitchSlotsInput,
  CancelReservationSeriesResult,
  CreateOwnerReservationInput,
  CreateRecurringReservationInput,
  RecurringReservationResult,
  CreatePitchBlockInput,
  CreatePitchInput,
  CreateReservationInput,
  CreateVenueInput,
  IntegrationStatus,
  OwnerVenue,
  Pitch,
  PitchAvailability,
  PitchBlock,
  PitchWithPricing,
  PublicVenue,
  CancelReservationByOwnerInput,
  RecordReservationPaymentInput,
  ReservationBase,
  ReservationWithVenuePitch,
  SevenRcOwnerApi,
  SevenRcPlayerApi,
  UpdateVenueSettingsInput,
  VenueReport,
  VenueReservation,
  VenueSettings,
} from '../sdk/seven-rc-api';

/**
 * Opt-in freshness overrides a surface can pass to list queries (e.g. web polling
 * while the tab is visible). Omitted keys keep the module defaults, so callers that
 * pass nothing (mobile) are unaffected.
 */
export type SevenRcRefreshOptions<TData> = Partial<
  Pick<
    UseQueryOptions<TData>,
    'refetchOnWindowFocus' | 'refetchOnMount' | 'refetchInterval' | 'refetchIntervalInBackground'
  >
>;

export const sevenRcQueryKeys = {
  integrations: ['seven-rc', 'integrations'] as const,
  ownerVenues: ['seven-rc', 'owner', 'venues'] as const,
  ownerVenuePitches: (venueId: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'pitches'] as const,
  ownerVenueReservationsBase: (venueId: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'reservations'] as const,
  ownerVenueReservations: (venueId: string, dateFrom: string, dateTo: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'reservations', dateFrom, dateTo] as const,
  ownerVenueReport: (venueId: string, dateFrom: string, dateTo: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'report', dateFrom, dateTo] as const,
  playerReservations: ['seven-rc', 'player', 'reservations'] as const,
  playerVenues: (query?: string) => ['seven-rc', 'player', 'venues', query ?? 'all'] as const,
  playerVenuePitches: (venueId: string) =>
    ['seven-rc', 'player', 'venues', venueId, 'pitches'] as const,
  customerHistory: (venueId: string, phone: string) =>
    ['seven-rc', 'owner', 'venues', venueId, 'customer-history', phone] as const,
  pitchBlocks: (pitchId: string) => ['seven-rc', 'pitches', pitchId, 'blocks'] as const,
  pitchAvailabilityBase: (pitchId: string) =>
    ['seven-rc', 'pitches', pitchId, 'availability'] as const,
  pitchAvailability: (pitchId: string, date: string) =>
    ['seven-rc', 'pitches', pitchId, 'availability', date] as const,
};

export function useSevenRcIntegrationsQuery(api: SevenRcOwnerApi) {
  return useQuery<IntegrationStatus[]>({
    queryKey: sevenRcQueryKeys.integrations,
    queryFn: () => api.listIntegrations(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

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
  return useQuery<PitchWithPricing[]>({
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
    onSuccess: (result) => {
      if (venueId) {
        const queryKey = sevenRcQueryKeys.ownerVenuePitches(venueId);
        // The endpoint replaces the whole week: the next save must start from this result,
        // not from the list that is still refetching.
        queryClient.setQueryData<PitchWithPricing[]>(queryKey, (pitches) =>
          pitches?.map((pitch) => (pitch.id === result.id ? { ...pitch, ...result } : pitch)),
        );
        void queryClient.invalidateQueries({ queryKey });
      }
      // Venue readiness (publish checklist) is computed on the server from the pitch hours.
      void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenues });
      void queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.pitchAvailabilityBase(pitchId),
      });
    },
  });
}

export function useSevenRcOwnerVenueReservationsQuery(
  api: SevenRcOwnerApi,
  venueId: string | null,
  dateFrom: string,
  dateTo: string,
  options?: SevenRcRefreshOptions<VenueReservation[]>,
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
    ...options,
  });
}

export function useSevenRcOwnerVenueReportQuery(
  api: SevenRcOwnerApi,
  venueId: string | null,
  dateFrom: string,
  dateTo: string,
) {
  return useQuery<VenueReport>({
    queryKey: sevenRcQueryKeys.ownerVenueReport(venueId ?? 'missing', dateFrom, dateTo),
    queryFn: () => {
      if (!venueId) {
        throw new Error('Venue id is required');
      }
      return api.getVenueReport(venueId, dateFrom, dateTo);
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
  const invalidate = useInvalidateOwnerReservation(venueId);

  return useMutation<ReservationBase, Error, string>({
    mutationFn: (reservationId: string) => api.confirmReservation(reservationId),
    onSuccess: invalidate,
  });
}

export function useSevenRcRejectVenueReservationMutation(
  api: SevenRcOwnerApi,
  venueId?: string | null,
) {
  const invalidate = useInvalidateOwnerReservation(venueId);

  return useMutation<ReservationBase, Error, string>({
    mutationFn: (reservationId: string) => api.rejectReservation(reservationId),
    onSuccess: invalidate,
  });
}

export function useSevenRcUpdateVenueSettingsMutation(api: SevenRcOwnerApi, venueId: string) {
  const queryClient = useQueryClient();

  return useMutation<VenueSettings, Error, UpdateVenueSettingsInput>({
    mutationFn: (input) => api.updateVenueSettings(venueId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenues });
    },
  });
}

export function useSevenRcConfigurePitchPolicyMutation(
  api: SevenRcOwnerApi,
  pitchId: string,
  venueId?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation<Pitch, Error, ConfigurePitchPolicyInput>({
    mutationFn: (input) => api.configurePitchPolicy(pitchId, input),
    onSuccess: () => {
      if (venueId) {
        // Changing a pitch moves the venue policyVersion, which owner venue data exposes.
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId),
        });
        void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenues });
      }
    },
  });
}

export function useSevenRcConfigurePitchPricingMutation(
  api: SevenRcOwnerApi,
  pitchId: string,
  venueId?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation<PitchWithPricing, Error, ConfigurePitchPricingInput>({
    mutationFn: (input) => api.configurePitchPricing(pitchId, input),
    onSuccess: () => {
      if (venueId) {
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId),
        });
      }
      // Venue readiness (publish checklist) depends on the pitch price.
      void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenues });
      void queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.pitchAvailabilityBase(pitchId),
      });
    },
  });
}

/** Owner reservation actions change the agenda, the venue counts and the free slots. */
function useInvalidateOwnerReservation(venueId?: string | null) {
  const queryClient = useQueryClient();
  return (reservation: ReservationBase) => {
    const targetVenueId = venueId ?? reservation.venueId;
    void queryClient.invalidateQueries({
      queryKey: sevenRcQueryKeys.ownerVenueReservationsBase(targetVenueId),
    });
    // `exact`: every other owner key nests under `ownerVenues`, so a prefix match
    // would refetch the reservations of all venues after each action.
    void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenues, exact: true });
    void queryClient.invalidateQueries({
      queryKey: sevenRcQueryKeys.pitchAvailabilityBase(reservation.pitchId),
    });
  };
}

export function useSevenRcRecordReservationPaymentMutation(
  api: SevenRcOwnerApi,
  venueId?: string | null,
) {
  const invalidate = useInvalidateOwnerReservation(venueId);

  return useMutation<
    ReservationBase,
    Error,
    { reservationId: string; input: RecordReservationPaymentInput }
  >({
    mutationFn: ({ reservationId, input }) => api.recordReservationPayment(reservationId, input),
    onSuccess: invalidate,
  });
}

export function useSevenRcMarkNoShowMutation(api: SevenRcOwnerApi, venueId?: string | null) {
  const invalidate = useInvalidateOwnerReservation(venueId);

  return useMutation<ReservationBase, Error, { reservationId: string; input?: MarkNoShowInput }>({
    mutationFn: ({ reservationId, input }) => api.markNoShow(reservationId, input),
    onSuccess: invalidate,
  });
}

/** Per-customer record at one venue. Disabled until both ids are known. */
export function useSevenRcCustomerHistoryQuery(
  api: SevenRcOwnerApi,
  venueId?: string | null,
  phone?: string | null,
) {
  return useQuery<CustomerHistory>({
    queryKey: sevenRcQueryKeys.customerHistory(venueId ?? 'missing', phone ?? 'missing'),
    queryFn: () => api.getCustomerHistory(venueId as string, phone as string),
    enabled: Boolean(venueId && phone),
    staleTime: 60_000,
  });
}

export function useSevenRcCompleteReservationMutation(
  api: SevenRcOwnerApi,
  venueId?: string | null,
) {
  const invalidate = useInvalidateOwnerReservation(venueId);

  return useMutation<ReservationBase, Error, string>({
    mutationFn: (reservationId) => api.completeReservation(reservationId),
    onSuccess: invalidate,
  });
}

export function useSevenRcOwnerCancelReservationMutation(
  api: SevenRcOwnerApi,
  venueId?: string | null,
) {
  const invalidate = useInvalidateOwnerReservation(venueId);

  return useMutation<
    ReservationBase,
    Error,
    { reservationId: string; input?: CancelReservationByOwnerInput | undefined }
  >({
    mutationFn: ({ reservationId, input }) => api.ownerCancelReservation(reservationId, input),
    onSuccess: invalidate,
  });
}

export function useSevenRcCreateOwnerReservationMutation(api: SevenRcOwnerApi, venueId: string) {
  const invalidate = useInvalidateOwnerReservation(venueId);

  return useMutation<ReservationBase, Error, CreateOwnerReservationInput>({
    mutationFn: (input) => api.createOwnerReservation(venueId, input),
    onSuccess: invalidate,
  });
}

export function useSevenRcCreateRecurringReservationMutation(
  api: SevenRcOwnerApi,
  venueId: string,
) {
  const queryClient = useQueryClient();

  return useMutation<RecurringReservationResult, Error, CreateRecurringReservationInput>({
    mutationFn: (input) => api.createRecurringReservation(venueId, input),
    onSuccess: (_result, input) => {
      void queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.ownerVenueReservationsBase(venueId),
      });
      void queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.pitchAvailabilityBase(input.pitchId),
      });
    },
  });
}

/** A series spans many dates and pitches' slots, so refresh every cached availability. */
export function useSevenRcCancelReservationSeriesMutation(
  api: SevenRcOwnerApi,
  venueId?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation<CancelReservationSeriesResult, Error, string>({
    mutationFn: (seriesId) => api.cancelReservationSeries(seriesId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: venueId
          ? sevenRcQueryKeys.ownerVenueReservationsBase(venueId)
          : ['seven-rc', 'owner', 'venues'],
      });
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'seven-rc' &&
          query.queryKey[1] === 'pitches' &&
          query.queryKey[3] === 'availability',
      });
    },
  });
}

export function useSevenRcMyReservationsQuery(
  api: SevenRcPlayerApi,
  options?: SevenRcRefreshOptions<ReservationWithVenuePitch[]>,
) {
  return useQuery<ReservationWithVenuePitch[]>({
    queryKey: sevenRcQueryKeys.playerReservations,
    queryFn: () => api.listMyReservations(),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
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

/**
 * Slot availability for one pitch on a venue-local date (`YYYY-MM-DD`). Short stale
 * time and an unconditional refetch on mount: slots change as other players book, so
 * a revisit must never show stale chips.
 */
export function useSevenRcPitchAvailabilityQuery(
  api: SevenRcPlayerApi,
  pitchId: string | null,
  date: string | null,
) {
  return useQuery<PitchAvailability>({
    queryKey: sevenRcQueryKeys.pitchAvailability(pitchId ?? 'missing', date ?? 'missing'),
    queryFn: () => {
      if (!pitchId || !date) {
        throw new Error('Pitch id and date are required');
      }
      return api.getPitchAvailability(pitchId, date);
    },
    enabled: Boolean(pitchId && date),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
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
    // Success takes the slot; a conflict means the list on screen is stale. Both refetch.
    onSettled: (_reservation, _error, input) => {
      void queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.pitchAvailabilityBase(input.pitchId),
      });
    },
  });
}

export function useSevenRcCancelReservationMutation(api: SevenRcPlayerApi) {
  const queryClient = useQueryClient();

  return useMutation<ReservationBase, Error, string>({
    mutationFn: (reservationId: string) => api.cancelReservation(reservationId),
    onSuccess: (reservation) => {
      void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.playerReservations });
      void queryClient.invalidateQueries({
        queryKey: sevenRcQueryKeys.pitchAvailabilityBase(reservation.pitchId),
      });
    },
  });
}

/** Active blocks that have not ended yet. `from` is fixed per mount so the key stays stable. */
export function useSevenRcPitchBlocksQuery(
  api: SevenRcOwnerApi,
  pitchId: string | null,
  from: string,
) {
  return useQuery<PitchBlock[]>({
    queryKey: sevenRcQueryKeys.pitchBlocks(pitchId ?? 'missing'),
    queryFn: () => {
      if (!pitchId) {
        throw new Error('Pitch id is required');
      }
      return api.listPitchBlocks(pitchId, from);
    },
    enabled: Boolean(pitchId),
    staleTime: 60 * 1000,
    refetchOnReconnect: false,
  });
}

/** A block changes which slots are free: refresh the list and the pitch availability. */
function useInvalidatePitchBlocks(pitchId: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.pitchBlocks(pitchId) });
    void queryClient.invalidateQueries({
      queryKey: sevenRcQueryKeys.pitchAvailabilityBase(pitchId),
    });
  };
}

export function useSevenRcCreatePitchBlockMutation(api: SevenRcOwnerApi, pitchId: string) {
  const invalidate = useInvalidatePitchBlocks(pitchId);
  return useMutation({
    mutationFn: (input: CreatePitchBlockInput) => api.createPitchBlock(pitchId, input),
    onSuccess: invalidate,
  });
}

export function useSevenRcDeletePitchBlockMutation(api: SevenRcOwnerApi, pitchId: string) {
  const invalidate = useInvalidatePitchBlocks(pitchId);
  return useMutation({
    mutationFn: (blockId: string) => api.deletePitchBlock(pitchId, blockId),
    onSuccess: invalidate,
  });
}
