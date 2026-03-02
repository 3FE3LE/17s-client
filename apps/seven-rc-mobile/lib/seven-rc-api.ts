import Constants from 'expo-constants';

export {
  createSevenRcOwnerApi,
  createSevenRcPlayerApi,
  type ConfigurePitchSlotsInput,
  type CreatePitchInput,
  type CreateReservationInput,
  type CreateVenueInput,
  type OwnerVenue,
  type Pitch,
  type PublicVenue,
  type ReservationBase,
  type ReservationStatus,
  type ReservationWithVenuePitch,
  type SevenRcApiClientOptions,
  type SevenRcOwnerApi,
  type SevenRcPlayerApi,
  type VenueReservation,
} from '@17suit/module-seven-reservations-club';

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
