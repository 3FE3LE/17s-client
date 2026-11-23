import {
  apiPath,
  type ApiInput,
  type ApiRequestBody,
  type ApiResponse,
  type ApiSchema,
} from '@17suit/core/api-types';

// Response and input shapes come from the server OpenAPI contract
// (packages/core/src/api-schema.ts). Do not hand-write DTOs here: drift
// between these and the server is what the generated types prevent.
export type OwnerVenue = ApiSchema<'OwnerVenueResponseDto'>;
export type PublicVenue = ApiResponse<'/7rc/venues', 'get'>[number];
export type Pitch = ApiSchema<'PitchResponseDto'>;
/** Owner pitch listing and pricing responses carry the peak/off-peak rules. */
export type PitchWithPricing = ApiSchema<'PitchWithPricingResponseDto'>;
export type PitchPriceRule = ApiSchema<'PitchPriceRuleResponseDto'>;
export type ReservationStatus = ApiSchema<'ReservationStatus'>;
export type ReservationBase = ApiSchema<'ReservationResponseDto'>;
export type ReservationWithVenuePitch = ApiSchema<'ReservationWithVenuePitchResponseDto'>;
export type VenueReservation = ApiSchema<'VenueReservationResponseDto'>;
export type AvailabilitySlotStatus = ApiSchema<'AvailabilitySlotStatus'>;
export type AvailabilitySlot = ApiSchema<'AvailabilitySlotResponseDto'>;
export type PitchAvailability = ApiSchema<'PitchAvailabilityResponseDto'>;
export type PitchBlock = ApiSchema<'PitchBlockResponseDto'>;

export type CreateVenueInput = ApiInput<ApiRequestBody<'/7rc/venues', 'post'>>;
export type CreateReservationInput = ApiInput<ApiRequestBody<'/7rc/reservations', 'post'>>;
export type CreatePitchInput = ApiInput<ApiRequestBody<'/7rc/venues/{venueId}/pitches', 'post'>>;
export type ConfigurePitchSlotsInput = ApiInput<
  ApiRequestBody<'/7rc/pitches/{pitchId}/slots', 'put'>
>;
type ConfigurePitchSlotsResult = ApiSchema<'ConfigurePitchSlotsResponseDto'>;
export type CreatePitchBlockInput = ApiInput<ApiSchema<'CreatePitchBlockDto'>>;
export type UpdateVenueSettingsInput = ApiInput<ApiSchema<'UpdateVenueSettingsDto'>>;
export type ConfigurePitchPricingInput = ApiInput<ApiSchema<'ConfigurePitchPricingDto'>>;
export type RecordReservationPaymentInput = ApiInput<ApiSchema<'RecordReservationPaymentDto'>>;
export type CreateOwnerReservationInput = ApiInput<ApiSchema<'CreateOwnerReservationDto'>>;
export type ReservationPaymentKind = ApiSchema<'ReservationPaymentKind'>;
export type ReservationPaymentMethod = ApiSchema<'ReservationPaymentMethod'>;
export type VenueSettings = ApiSchema<'VenueResponseDto'>;

export interface SevenRcApiClientOptions {
  apiBaseUrls: string[];
  getAccessToken: () => Promise<string | null>;
  timeoutMs?: number;
}

export interface SevenRcOwnerApi {
  listOwnerVenues: () => Promise<OwnerVenue[]>;
  createVenue: (input: CreateVenueInput) => Promise<OwnerVenue>;
  listOwnerVenuePitches: (venueId: string) => Promise<PitchWithPricing[]>;
  createPitchForVenue: (venueId: string, input: CreatePitchInput) => Promise<Pitch>;
  configurePitchSlots: (
    pitchId: string,
    input: ConfigurePitchSlotsInput,
  ) => Promise<ConfigurePitchSlotsResult>;
  listVenueReservations: (
    venueId: string,
    dateFrom: string,
    dateTo: string,
    cacheBuster?: string,
  ) => Promise<VenueReservation[]>;
  confirmReservation: (reservationId: string) => Promise<ReservationBase>;
  rejectReservation: (reservationId: string) => Promise<ReservationBase>;
  /** Partial update: omitted fields keep their stored value. */
  updateVenueSettings: (venueId: string, input: UpdateVenueSettingsInput) => Promise<VenueSettings>;
  /** Replaces the base price and the whole rule list. */
  configurePitchPricing: (
    pitchId: string,
    input: ConfigurePitchPricingInput,
  ) => Promise<PitchWithPricing>;
  /**
   * Records money the venue received or returned. A pending hold whose deposit is
   * covered becomes confirmed server-side. The server returns the reservation with
   * its payments but without `pitch`/`user`, so only the base shape is promised.
   */
  recordReservationPayment: (
    reservationId: string,
    input: RecordReservationPaymentInput,
  ) => Promise<ReservationBase>;
  markNoShow: (reservationId: string) => Promise<ReservationBase>;
  completeReservation: (reservationId: string) => Promise<ReservationBase>;
  /** Venue-side cancel; no cancellation window applies. */
  ownerCancelReservation: (reservationId: string) => Promise<ReservationBase>;
  /** Walk-in / phone booking entered from the agenda; created confirmed. */
  createOwnerReservation: (
    venueId: string,
    input: CreateOwnerReservationInput,
  ) => Promise<ReservationBase>;
  /** Active blocks of a pitch that end after `from` (ISO instant), ordered by start. */
  listPitchBlocks: (pitchId: string, from?: string) => Promise<PitchBlock[]>;
  /** Rejects with `SevenRcApiError` 409 and `conflicts` when active reservations overlap. */
  createPitchBlock: (pitchId: string, input: CreatePitchBlockInput) => Promise<PitchBlock>;
  deletePitchBlock: (pitchId: string, blockId: string) => Promise<PitchBlock>;
}

export interface SevenRcPlayerApi {
  listVenues: (query?: string) => Promise<PublicVenue[]>;
  listVenuePitches: (venueId: string) => Promise<Pitch[]>;
  /** Derived slots + prices for a venue-local date (`YYYY-MM-DD`). */
  getPitchAvailability: (pitchId: string, date: string) => Promise<PitchAvailability>;
  listMyReservations: () => Promise<ReservationWithVenuePitch[]>;
  createReservation: (input: CreateReservationInput) => Promise<ReservationBase>;
  cancelReservation: (reservationId: string) => Promise<ReservationBase>;
}

function normalizeApiBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizeApiBaseUrls(values: string[]): string[] {
  const unique: string[] = [];
  for (const raw of values) {
    const value = raw?.trim();
    if (!value) {
      continue;
    }
    const normalized = normalizeApiBaseUrl(value);
    if (!unique.includes(normalized)) {
      unique.push(normalized);
    }
  }
  return unique;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 8_000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  // Nest sends `{ message: 'Timeslot is unavailable', error: 'Conflict' }`: `message` is
  // the specific reason. The web BFF and validation errors only have a usable `error`.
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  if (payload && typeof payload === 'object' && 'error' in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === 'string' && error.length > 0) {
      return error;
    }
  }

  return fallback;
}

function toError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

/** HTTP error returned by the 7RC API. `status` lets callers map errors without parsing text. */
export class SevenRcApiError extends Error {
  readonly status: number;
  /** Parsed JSON body of the error response, when there was one. */
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown = null) {
    super(message);
    this.name = 'SevenRcApiError';
    this.status = status;
    this.payload = payload;
  }

  /** Reservations that overlap a rejected pitch block (409 from the block endpoint). */
  get conflicts(): ReservationBase[] {
    const value =
      this.payload && typeof this.payload === 'object'
        ? (this.payload as { conflicts?: unknown }).conflicts
        : null;
    return Array.isArray(value) ? (value as ReservationBase[]) : [];
  }
}

function createRequest(options: SevenRcApiClientOptions) {
  const apiBaseUrls = normalizeApiBaseUrls(options.apiBaseUrls);
  const { getAccessToken, timeoutMs = 8_000 } = options;

  return async function request<T>(path: string, init: RequestInit): Promise<T> {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Unauthorized');
    }

    // Fail over to the next base URL only when no HTTP response arrived (network
    // error / timeout), and only for idempotent reads. Any HTTP response — 4xx or
    // 5xx — is the server's answer and must surface as-is; re-sending a POST to
    // another host risks a duplicate write.
    const method = (init.method ?? 'GET').toUpperCase();
    const canFailOver = method === 'GET' || method === 'HEAD';
    const candidates = canFailOver ? apiBaseUrls : apiBaseUrls.slice(0, 1);
    let lastError: unknown = null;

    for (const baseUrl of candidates) {
      let response: Response;
      try {
        response = await fetchWithTimeout(
          `${baseUrl}${path}`,
          {
            ...init,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
              ...(init.headers ?? {}),
            },
          },
          timeoutMs,
        );
      } catch (error) {
        lastError = error;
        continue;
      }

      if (response.ok) {
        return (await response.json()) as T;
      }

      const payload = await parseJsonSafe(response);
      throw new SevenRcApiError(
        extractErrorMessage(payload, `Request failed (${response.status})`),
        response.status,
        payload,
      );
    }

    throw toError(lastError, 'Unable to reach API');
  };
}

export function createSevenRcOwnerApi(options: SevenRcApiClientOptions): SevenRcOwnerApi {
  const request = createRequest(options);

  return {
    listOwnerVenues() {
      return request<OwnerVenue[]>('/7rc/owner/venues', {
        method: 'GET',
        cache: 'no-store',
      });
    },
    createVenue(input) {
      return request<OwnerVenue>('/7rc/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
    },
    listOwnerVenuePitches(venueId) {
      return request<PitchWithPricing[]>(
        apiPath('/7rc/owner/venues/{venueId}/pitches', { venueId }),
        {
          method: 'GET',
          cache: 'no-store',
        },
      );
    },
    createPitchForVenue(venueId, input) {
      return request<Pitch>(apiPath('/7rc/venues/{venueId}/pitches', { venueId }), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
    },
    configurePitchSlots(pitchId, input) {
      return request<ConfigurePitchSlotsResult>(
        apiPath('/7rc/pitches/{pitchId}/slots', { pitchId }),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        },
      );
    },
    listVenueReservations(venueId, dateFrom, dateTo, cacheBuster) {
      const query = new URLSearchParams({ dateFrom, dateTo });
      if (cacheBuster) {
        query.set('_', cacheBuster);
      }
      return request<VenueReservation[]>(
        `${apiPath('/7rc/venues/{venueId}/reservations', { venueId })}?${query}`,
        {
          method: 'GET',
          cache: 'no-store',
        },
      );
    },
    confirmReservation(reservationId) {
      return request<ReservationBase>(
        apiPath('/7rc/reservations/{id}/confirm', { id: reservationId }),
        {
          method: 'PATCH',
        },
      );
    },
    rejectReservation(reservationId) {
      return request<ReservationBase>(
        apiPath('/7rc/reservations/{id}/reject', { id: reservationId }),
        {
          method: 'PATCH',
        },
      );
    },
    updateVenueSettings(venueId, input) {
      return request<VenueSettings>(apiPath('/7rc/venues/{venueId}/settings', { venueId }), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    },
    configurePitchPricing(pitchId, input) {
      return request<PitchWithPricing>(apiPath('/7rc/pitches/{pitchId}/pricing', { pitchId }), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    },
    recordReservationPayment(reservationId, input) {
      return request<ReservationBase>(
        apiPath('/7rc/reservations/{id}/payments', { id: reservationId }),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        },
      );
    },
    markNoShow(reservationId) {
      return request<ReservationBase>(
        apiPath('/7rc/reservations/{id}/no-show', { id: reservationId }),
        { method: 'POST' },
      );
    },
    completeReservation(reservationId) {
      return request<ReservationBase>(
        apiPath('/7rc/reservations/{id}/complete', { id: reservationId }),
        { method: 'POST' },
      );
    },
    ownerCancelReservation(reservationId) {
      return request<ReservationBase>(
        apiPath('/7rc/reservations/{id}/owner-cancel', { id: reservationId }),
        { method: 'POST' },
      );
    },
    createOwnerReservation(venueId, input) {
      return request<ReservationBase>(apiPath('/7rc/venues/{venueId}/reservations', { venueId }), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    },
    listPitchBlocks(pitchId, from) {
      const query = from ? `?${new URLSearchParams({ from })}` : '';
      return request<PitchBlock[]>(
        `${apiPath('/7rc/pitches/{pitchId}/blocks', { pitchId })}${query}`,
        { method: 'GET', cache: 'no-store' },
      );
    },
    createPitchBlock(pitchId, input) {
      return request<PitchBlock>(apiPath('/7rc/pitches/{pitchId}/blocks', { pitchId }), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    },
    deletePitchBlock(pitchId, blockId) {
      return request<PitchBlock>(
        apiPath('/7rc/pitches/{pitchId}/blocks/{blockId}', { pitchId, blockId }),
        { method: 'DELETE' },
      );
    },
  };
}

export function createSevenRcPlayerApi(options: SevenRcApiClientOptions): SevenRcPlayerApi {
  const request = createRequest(options);

  return {
    listVenues(query) {
      const search = query ? `?q=${encodeURIComponent(query)}` : '';
      return request<PublicVenue[]>(`/7rc/venues${search}`, {
        method: 'GET',
        cache: 'no-store',
      });
    },
    listVenuePitches(venueId) {
      return request<Pitch[]>(apiPath('/7rc/venues/{venueId}/pitches', { venueId }), {
        method: 'GET',
        cache: 'no-store',
      });
    },
    getPitchAvailability(pitchId, date) {
      const query = new URLSearchParams({ date });
      return request<PitchAvailability>(
        `${apiPath('/7rc/pitches/{pitchId}/availability', { pitchId })}?${query}`,
        {
          method: 'GET',
          cache: 'no-store',
        },
      );
    },
    listMyReservations() {
      return request<ReservationWithVenuePitch[]>('/7rc/reservations', {
        method: 'GET',
        cache: 'no-store',
      });
    },
    createReservation(input) {
      return request<ReservationBase>('/7rc/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
    },
    cancelReservation(reservationId) {
      return request<ReservationBase>(
        apiPath('/7rc/reservations/{id}/cancel', { id: reservationId }),
        {
          method: 'POST',
        },
      );
    },
  };
}
