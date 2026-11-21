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
export type ReservationStatus = ApiSchema<'ReservationStatus'>;
export type ReservationBase = ApiSchema<'ReservationResponseDto'>;
export type ReservationWithVenuePitch = ApiSchema<'ReservationWithVenuePitchResponseDto'>;
export type VenueReservation = ApiSchema<'VenueReservationResponseDto'>;
export type AvailabilitySlotStatus = ApiSchema<'AvailabilitySlotStatus'>;
export type AvailabilitySlot = ApiSchema<'AvailabilitySlotResponseDto'>;
export type PitchAvailability = ApiSchema<'PitchAvailabilityResponseDto'>;

export type CreateVenueInput = ApiInput<ApiRequestBody<'/7rc/venues', 'post'>>;
export type CreateReservationInput = ApiInput<ApiRequestBody<'/7rc/reservations', 'post'>>;
export type CreatePitchInput = ApiInput<ApiRequestBody<'/7rc/venues/{venueId}/pitches', 'post'>>;
export type ConfigurePitchSlotsInput = ApiInput<
  ApiRequestBody<'/7rc/pitches/{pitchId}/slots', 'put'>
>;
type ConfigurePitchSlotsResult = ApiSchema<'ConfigurePitchSlotsResponseDto'>;

export interface SevenRcApiClientOptions {
  apiBaseUrls: string[];
  getAccessToken: () => Promise<string | null>;
  timeoutMs?: number;
}

export interface SevenRcOwnerApi {
  listOwnerVenues: () => Promise<OwnerVenue[]>;
  createVenue: (input: CreateVenueInput) => Promise<OwnerVenue>;
  listOwnerVenuePitches: (venueId: string) => Promise<Pitch[]>;
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
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === 'string' && error.length > 0) {
      return error;
    }
  }

  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
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

  constructor(message: string, status: number) {
    super(message);
    this.name = 'SevenRcApiError';
    this.status = status;
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
      return request<Pitch[]>(apiPath('/7rc/owner/venues/{venueId}/pitches', { venueId }), {
        method: 'GET',
        cache: 'no-store',
      });
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
