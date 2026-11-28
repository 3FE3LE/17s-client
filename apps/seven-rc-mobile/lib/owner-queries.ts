import {
  createSevenRcOwnerApi,
  sevenRcQueryKeys,
  type CreatePitchInput,
  type CreateVenueInput,
  type ConfigurePitchSlotsInput,
  type ReservationBase,
  type SevenRcRefreshOptions,
  type VenueReservation,
  useSevenRcCompleteReservationMutation,
  useSevenRcConfigurePitchSlotsMutation,
  useSevenRcCreateVenueMutation,
  useSevenRcCreateVenuePitchMutation,
  useSevenRcMarkNoShowMutation,
  useSevenRcOwnerCancelReservationMutation,
  useSevenRcOwnerVenuePitchesQuery,
  useSevenRcOwnerVenueReservationsQuery,
  useSevenRcOwnerVenuesQuery,
  useSevenRcRecordReservationPaymentMutation,
  useSevenRcUpdateVenueSettingsMutation,
  type UpdateVenueSettingsInput,
  type RecordReservationPaymentInput,
  type ReservationPaymentKind,
  type ReservationPaymentMethod,
} from '@17suit/module-seven-reservations-club/client';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { resolveApiBaseUrls, resolveClerkJwtTemplate } from './seven-rc-api';

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

/** Device-local `YYYY-MM-DD` for the API's date-range filter. */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * The owner reservation window (last 30 days to next 60). Home inbox and venue
 * detail use the same range, so they share one cache entry per venue and a
 * confirm on either screen updates both.
 */
export function ownerReservationsRange(now = new Date()) {
  return { from: formatDate(addDays(now, -30)), to: formatDate(addDays(now, 60)) };
}

export function useOwnerVenuesQuery() {
  const api = useOwnerApi();
  return useSevenRcOwnerVenuesQuery(api);
}

export function useCreateVenueMutation() {
  const api = useOwnerApi();
  return useSevenRcCreateVenueMutation(api);
}

export function useUpdateVenueSettingsMutation(venueId: string) {
  const api = useOwnerApi();
  return useSevenRcUpdateVenueSettingsMutation(api, venueId);
}

export function useOwnerVenuePitchesQuery(venueId: string | null) {
  const api = useOwnerApi();
  return useSevenRcOwnerVenuePitchesQuery(api, venueId);
}

export function useCreateVenuePitchMutation(venueId: string) {
  const api = useOwnerApi();
  return useSevenRcCreateVenuePitchMutation(api, venueId);
}

export function useConfigurePitchSlotsMutation(pitchId: string, venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcConfigurePitchSlotsMutation(api, pitchId, venueId);
}

export function useOwnerVenueReservationsQuery(
  venueId: string | null,
  dateFrom: string,
  dateTo: string,
  options?: SevenRcRefreshOptions<VenueReservation[]>,
) {
  const api = useOwnerApi();
  return useSevenRcOwnerVenueReservationsQuery(api, venueId, dateFrom, dateTo, options);
}

/** Hard cap on venues the home inbox fans out to (one request per venue). */
export const OWNER_INBOX_MAX_VENUES = 8;

/**
 * Reservations for each of the owner's venues (capped), keyed exactly like
 * `useOwnerVenueReservationsQuery` so the cache is shared with venue detail.
 */
export function useOwnerVenuesReservationsQueries(
  venueIds: string[],
  dateFrom: string,
  dateTo: string,
  refetchInterval: number | false,
) {
  const api = useOwnerApi();
  // Polling pauses in the background, so refresh as soon as the app returns.
  const refetchOnWindowFocus = refetchInterval !== false ? ('always' as const) : false;
  return useQueries({
    queries: venueIds.slice(0, OWNER_INBOX_MAX_VENUES).map((venueId) => ({
      queryKey: sevenRcQueryKeys.ownerVenueReservations(venueId, dateFrom, dateTo),
      queryFn: () => api.listVenueReservations(venueId, dateFrom, dateTo),
      staleTime: 60 * 1000,
      gcTime: 15 * 60 * 1000,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus,
    })),
  });
}

interface ReservationActionInput {
  reservationId: string;
  venueId: string;
}

function useInvalidateOwnerReservation() {
  const queryClient = useQueryClient();
  return (venueId: string) => {
    void queryClient.invalidateQueries({
      queryKey: sevenRcQueryKeys.ownerVenueReservationsBase(venueId),
    });
    // Venue tiles show reservation counts and pending badges.
    void queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenues, exact: true });
  };
}

export function useConfirmVenueReservationMutation() {
  const api = useOwnerApi();
  const invalidate = useInvalidateOwnerReservation();
  return useMutation<ReservationBase, Error, ReservationActionInput>({
    mutationFn: ({ reservationId }) => api.confirmReservation(reservationId),
    onSuccess: (_data, { venueId }) => invalidate(venueId),
  });
}

export function useRejectVenueReservationMutation() {
  const api = useOwnerApi();
  const invalidate = useInvalidateOwnerReservation();
  return useMutation<ReservationBase, Error, ReservationActionInput>({
    mutationFn: ({ reservationId }) => api.rejectReservation(reservationId),
    onSuccess: (_data, { venueId }) => invalidate(venueId),
  });
}

// These hooks take the venue from the returned reservation, so one instance
// serves every venue in the cross-venue inbox.
export function useRecordReservationPaymentMutation() {
  const api = useOwnerApi();
  return useSevenRcRecordReservationPaymentMutation(api);
}

export function useMarkNoShowMutation() {
  const api = useOwnerApi();
  return useSevenRcMarkNoShowMutation(api);
}

export function useCompleteReservationMutation() {
  const api = useOwnerApi();
  return useSevenRcCompleteReservationMutation(api);
}

export function useOwnerCancelReservationMutation() {
  const api = useOwnerApi();
  return useSevenRcOwnerCancelReservationMutation(api);
}

export type {
  ConfigurePitchSlotsInput,
  CreatePitchInput,
  CreateVenueInput,
  RecordReservationPaymentInput,
  ReservationBase,
  UpdateVenueSettingsInput,
  ReservationPaymentKind,
  ReservationPaymentMethod,
  VenueReservation,
};
