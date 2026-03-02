import {
  createSevenRcOwnerApi,
  type CreatePitchInput,
  type CreateVenueInput,
  type ConfigurePitchSlotsInput,
  type ReservationBase,
  type VenueReservation,
  useSevenRcConfirmVenueReservationMutation,
  useSevenRcConfigurePitchSlotsMutation,
  useSevenRcCreateVenueMutation,
  useSevenRcCreateVenuePitchMutation,
  useSevenRcOwnerVenuePitchesQuery,
  useSevenRcOwnerVenueReservationsQuery,
  useSevenRcOwnerVenuesQuery,
  useSevenRcRejectVenueReservationMutation,
} from '@17suit/module-seven-reservations-club/client';
import { useAuth } from '@clerk/clerk-expo';
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
) {
  const api = useOwnerApi();
  return useSevenRcOwnerVenueReservationsQuery(api, venueId, dateFrom, dateTo);
}

export function useConfirmVenueReservationMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcConfirmVenueReservationMutation(api, venueId);
}

export function useRejectVenueReservationMutation(venueId?: string | null) {
  const api = useOwnerApi();
  return useSevenRcRejectVenueReservationMutation(api, venueId);
}

export type {
  ConfigurePitchSlotsInput,
  CreatePitchInput,
  CreateVenueInput,
  ReservationBase,
  VenueReservation,
};
