'use client';

import {
  createSevenRcOwnerApi,
  type ConfigurePitchPricingInput,
  type ConfigurePitchSlotsInput,
  type CreatePitchInput,
  type CreateVenueInput,
  type OwnerVenue,
  type PitchWithPricing,
  type RecordReservationPaymentInput,
  type ReservationBase,
  type ReservationPaymentKind,
  type ReservationPaymentMethod,
  type SevenRcRefreshOptions,
  type UpdateVenueSettingsInput,
  type VenueReservation,
  useSevenRcCompleteReservationMutation,
  useSevenRcConfigurePitchPricingMutation,
  useSevenRcConfirmVenueReservationMutation,
  useSevenRcConfigurePitchSlotsMutation,
  useSevenRcMarkNoShowMutation,
  useSevenRcOwnerCancelReservationMutation,
  useSevenRcRecordReservationPaymentMutation,
  useSevenRcUpdateVenueSettingsMutation,
  useSevenRcCreateVenueMutation,
  useSevenRcCreateVenuePitchMutation,
  useSevenRcOwnerVenuePitchesQuery,
  useSevenRcOwnerVenueReservationsQuery,
  useSevenRcOwnerVenuesQuery,
  useSevenRcRejectVenueReservationMutation,
} from '@17suit/module-seven-reservations-club/client';
import { useMemo } from 'react';

function useOwnerApi() {
  return useMemo(
    () =>
      createSevenRcOwnerApi({
        apiBaseUrls: ['/api'],
        getAccessToken: () => Promise.resolve('web-bff'),
      }),
    [],
  );
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

export type {
  ConfigurePitchPricingInput,
  ConfigurePitchSlotsInput,
  CreatePitchInput,
  CreateVenueInput,
  OwnerVenue,
  PitchWithPricing,
  RecordReservationPaymentInput,
  ReservationBase,
  ReservationPaymentKind,
  ReservationPaymentMethod,
  UpdateVenueSettingsInput,
  VenueReservation,
};
