'use client';

import {
  createSevenRcOwnerApi,
  type ConfigurePitchPricingInput,
  type ConfigurePitchSlotsInput,
  type CreatePitchBlockInput,
  type CancelReservationSeriesResult,
  type CreateOwnerReservationInput,
  type CreateRecurringReservationInput,
  type RecurringReservationResult,
  type CreatePitchInput,
  type CreateVenueInput,
  type OwnerVenue,
  type PitchBlock,
  type PitchWithPricing,
  type RecordReservationPaymentInput,
  type ReservationBase,
  type ReservationPaymentKind,
  type ReservationPaymentMethod,
  type SevenRcRefreshOptions,
  type UpdateVenueSettingsInput,
  type VenueReport,
  type PitchReport,
  type VenueReservation,
  useSevenRcCompleteReservationMutation,
  useSevenRcCancelReservationSeriesMutation,
  useSevenRcCreateOwnerReservationMutation,
  useSevenRcCreateRecurringReservationMutation,
  useSevenRcConfigurePitchPricingMutation,
  useSevenRcConfirmVenueReservationMutation,
  useSevenRcConfigurePitchSlotsMutation,
  useSevenRcMarkNoShowMutation,
  useSevenRcOwnerCancelReservationMutation,
  useSevenRcRecordReservationPaymentMutation,
  useSevenRcUpdateVenueSettingsMutation,
  useSevenRcCreatePitchBlockMutation,
  useSevenRcCreateVenueMutation,
  useSevenRcDeletePitchBlockMutation,
  useSevenRcPitchBlocksQuery,
  useSevenRcCreateVenuePitchMutation,
  useSevenRcOwnerVenuePitchesQuery,
  useSevenRcOwnerVenueReportQuery,
  useSevenRcOwnerVenueReservationsQuery,
  useSevenRcIntegrationsQuery,
  useSevenRcOwnerVenuesQuery,
  useSevenRcRejectVenueReservationMutation,
} from '@17suit/module-seven-reservations-club/client';
import { useMemo } from 'react';
import { useAccessToken } from '@/lib/use-access-token';

function useOwnerApi() {
  const getAccessToken = useAccessToken();
  return useMemo(
    () => createSevenRcOwnerApi({ apiBaseUrls: ['/api'], getAccessToken }),
    [getAccessToken],
  );
}

export function useIntegrationsQuery() {
  const api = useOwnerApi();
  return useSevenRcIntegrationsQuery(api);
}

export function useOwnerVenuesQuery() {
  const api = useOwnerApi();
  return useSevenRcOwnerVenuesQuery(api);
}

export function useCreateVenueMutation() {
  const api = useOwnerApi();
  return useSevenRcCreateVenueMutation(api);
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

export function useOwnerVenueReportQuery(venueId: string | null, dateFrom: string, dateTo: string) {
  const api = useOwnerApi();
  return useSevenRcOwnerVenueReportQuery(api, venueId, dateFrom, dateTo);
}

export function useConfirmVenueReservationMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcConfirmVenueReservationMutation(api, venueId);
}

export function useRejectVenueReservationMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcRejectVenueReservationMutation(api, venueId);
}

export function useUpdateVenueSettingsMutation(venueId: string) {
  const api = useOwnerApi();
  return useSevenRcUpdateVenueSettingsMutation(api, venueId);
}

export function useConfigurePitchPricingMutation(pitchId: string, venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcConfigurePitchPricingMutation(api, pitchId, venueId);
}

export function useRecordReservationPaymentMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcRecordReservationPaymentMutation(api, venueId);
}

export function useCreateOwnerReservationMutation(venueId: string) {
  const api = useOwnerApi();
  return useSevenRcCreateOwnerReservationMutation(api, venueId);
}

export function useCreateRecurringReservationMutation(venueId: string) {
  const api = useOwnerApi();
  return useSevenRcCreateRecurringReservationMutation(api, venueId);
}

export function useCancelReservationSeriesMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcCancelReservationSeriesMutation(api, venueId);
}

export function useMarkNoShowMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcMarkNoShowMutation(api, venueId);
}

export function useCompleteReservationMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcCompleteReservationMutation(api, venueId);
}

export function useOwnerCancelReservationMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcOwnerCancelReservationMutation(api, venueId);
}

export function usePitchBlocksQuery(pitchId: string | null, from: string) {
  const api = useOwnerApi();
  return useSevenRcPitchBlocksQuery(api, pitchId, from);
}

export function useCreatePitchBlockMutation(pitchId: string) {
  const api = useOwnerApi();
  return useSevenRcCreatePitchBlockMutation(api, pitchId);
}

export function useDeletePitchBlockMutation(pitchId: string) {
  const api = useOwnerApi();
  return useSevenRcDeletePitchBlockMutation(api, pitchId);
}

export type {
  CancelReservationSeriesResult,
  CreateRecurringReservationInput,
  RecurringReservationResult,
  ConfigurePitchPricingInput,
  ConfigurePitchSlotsInput,
  CreateOwnerReservationInput,
  CreatePitchBlockInput,
  CreatePitchInput,
  CreateVenueInput,
  OwnerVenue,
  PitchBlock,
  PitchReport,
  PitchWithPricing,
  RecordReservationPaymentInput,
  ReservationBase,
  ReservationPaymentKind,
  ReservationPaymentMethod,
  UpdateVenueSettingsInput,
  VenueReport,
  VenueReservation,
};
