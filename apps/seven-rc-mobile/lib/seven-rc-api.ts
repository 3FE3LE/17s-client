import Constants from 'expo-constants';

function normalizeApiBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function deriveLanApiBaseUrlFromExpoHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri || hostUri.trim().length === 0) {
    return null;
  }
  const host = hostUri.split(':')[0]?.trim();
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }
  return `http://${host}:4000/api`;
}

export function resolveApiBaseUrls(): string[] {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  const extraFallbacks = (env?.EXPO_PUBLIC_API_BASE_URL_FALLBACKS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  const values = [
    env?.EXPO_PUBLIC_API_BASE_URL,
    deriveLanApiBaseUrlFromExpoHost(),
    ...extraFallbacks,
    'http://10.0.2.2:4000/api',
    'http://localhost:4000/api',
  ].filter((value): value is string => Boolean(value && value.length > 0));

  const unique: string[] = [];
  for (const value of values) {
    const normalized = normalizeApiBaseUrl(value);
    if (!unique.includes(normalized)) {
      unique.push(normalized);
    }
  }

  return unique;
}

export function resolveClerkJwtTemplate(): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env?.EXPO_PUBLIC_CLERK_JWT_TEMPLATE || undefined;
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

export interface Pitch {
  id: string;
  venueId: string;
  name: string;
  sportType: string;
  capacity: number;
  slotDurationMinutes: number;
}

export interface CreateVenueInput {
  name: string;
  location?: string;
  timezone?: string;
}

export interface CreatePitchInput {
  name: string;
  sportType?: string;
  capacity?: number;
  slotDurationMinutes?: number;
}

interface SevenRcOwnerApiOptions {
  apiBaseUrls: string[];
  getAccessToken: () => Promise<string | null>;
}

export function createSevenRcOwnerApi(options: SevenRcOwnerApiOptions) {
  const { apiBaseUrls, getAccessToken } = options;

  async function request<T>(path: string, init: RequestInit): Promise<T> {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Unauthorized');
    }

    let lastError: unknown = null;

    for (const baseUrl of apiBaseUrls) {
      try {
        const response = await fetchWithTimeout(`${baseUrl}${path}`, {
          ...init,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            ...(init.headers ?? {}),
          },
        });

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
  }

  return {
    listOwnerVenues() {
      return request<OwnerVenue[]>('/7rc/owner/venues', {
        method: 'GET',
        cache: 'no-store',
      });
    },
    createVenue(input: CreateVenueInput) {
      return request<OwnerVenue>('/7rc/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
    },
    listOwnerVenuePitches(venueId: string) {
      return request<Pitch[]>(`/7rc/owner/venues/${venueId}/pitches`, {
        method: 'GET',
        cache: 'no-store',
      });
    },
    createPitchForVenue(venueId: string, input: CreatePitchInput) {
      return request<Pitch>(`/7rc/venues/${venueId}/pitches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
    },
  };
}
