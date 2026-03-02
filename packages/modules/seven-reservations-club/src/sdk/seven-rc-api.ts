export interface OwnerVenue {
  id: string;
  name: string;
  address?: string | null;
  timezone: string;
  _count?: {
    pitches: number;
    reservations: number;
  };
}

export interface PublicVenue {
  id: string;
  name: string;
  address?: string | null;
  timezone: string;
  createdAt?: string;
}

export interface Pitch {
  id: string;
  venueId: string;
  name: string;
  sportType: string;
  capacity: number;
  slotDurationMinutes: number;
}

export type ReservationStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed';

export interface ReservationBase {
  id: string;
  venueId: string;
  pitchId: string;
  userId: string;
  status: ReservationStatus;
  startAt: string;
  endAt: string;
  invitedCount: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string | null;
  rejectedAt?: string | null;
  cancelledAt?: string | null;
}

export interface ReservationWithVenuePitch extends ReservationBase {
  pitch: Pitch;
  venue: OwnerVenue;
}

export interface VenueReservation extends ReservationBase {
  pitch: Pitch;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    clerkUserId: string;
    role?: string | null;
  };
}

export interface CreateVenueInput {
  name: string;
  location?: string | undefined;
  timezone?: string | undefined;
}

export interface CreateReservationInput {
  pitchId: string;
  startAt: string;
  endAt: string;
  invitedCount?: number | undefined;
  notes?: string | undefined;
}

export interface CreatePitchInput {
  name: string;
  sportType?: string | undefined;
  capacity?: number | undefined;
  slotDurationMinutes?: number | undefined;
}

export interface ConfigurePitchSlotsInput {
  slotDurationMinutes?: number | undefined;
  openingHours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }>;
}

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
  ) => Promise<{ id: string }>;
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

function createRequest(options: SevenRcApiClientOptions) {
  const apiBaseUrls = normalizeApiBaseUrls(options.apiBaseUrls);
  const { getAccessToken, timeoutMs = 8_000 } = options;

  return async function request<T>(path: string, init: RequestInit): Promise<T> {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Unauthorized');
    }

    let lastError: unknown = null;

    for (const baseUrl of apiBaseUrls) {
      try {
        const response = await fetchWithTimeout(
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

        if (response.ok) {
          return (await response.json()) as T;
        }

        const payload = await parseJsonSafe(response);
        const error = new Error(
          extractErrorMessage(payload, `Request failed (${response.status})`),
        );
        lastError = error;

        if (response.status >= 400 && response.status < 500 && response.status !== 404) {
          throw error;
        }
      } catch (error) {
        lastError = error;
      }
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
      return request<Pitch[]>(`/7rc/owner/venues/${venueId}/pitches`, {
        method: 'GET',
        cache: 'no-store',
      });
    },
    createPitchForVenue(venueId, input) {
      return request<Pitch>(`/7rc/venues/${venueId}/pitches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
    },
    configurePitchSlots(pitchId, input) {
      return request<{ id: string }>(`/7rc/pitches/${pitchId}/slots`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
    },
    listVenueReservations(venueId, dateFrom, dateTo, cacheBuster) {
      const query = new URLSearchParams({ dateFrom, dateTo });
      if (cacheBuster) {
        query.set('_', cacheBuster);
      }
      return request<VenueReservation[]>(`/7rc/venues/${venueId}/reservations?${query}`, {
        method: 'GET',
        cache: 'no-store',
      });
    },
    confirmReservation(reservationId) {
      return request<ReservationBase>(`/7rc/reservations/${reservationId}/confirm`, {
        method: 'PATCH',
      });
    },
    rejectReservation(reservationId) {
      return request<ReservationBase>(`/7rc/reservations/${reservationId}/reject`, {
        method: 'PATCH',
      });
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
      return request<Pitch[]>(`/7rc/venues/${venueId}/pitches`, {
        method: 'GET',
        cache: 'no-store',
      });
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
      return request<ReservationBase>(`/7rc/reservations/${reservationId}/cancel`, {
        method: 'POST',
      });
    },
  };
}
