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

function isDevBuild(): boolean {
  return typeof __DEV__ !== 'undefined' ? __DEV__ : false;
}

// Read each variable as a literal `process.env.EXPO_PUBLIC_*` member: that is
// the only form babel-preset-expo inlines. An aliased `env?.NAME` works in
// development and is undefined in release builds. The casts are only for
// TypeScript: the app has no Node types, so `process.env` is untyped.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL as string | undefined;
const API_BASE_URL_FALLBACKS = process.env.EXPO_PUBLIC_API_BASE_URL_FALLBACKS as string | undefined;
const CLERK_JWT_TEMPLATE = process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE as string | undefined;

export function resolveApiBaseUrls(): string[] {
  const extraFallbacks = (API_BASE_URL_FALLBACKS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  const values = [
    API_BASE_URL,
    deriveLanApiBaseUrlFromExpoHost(),
    ...extraFallbacks,
    // Emulator/localhost fallbacks are dev-only: a release build must never send
    // requests (or retry reads) against hosts that only exist on a developer machine.
    ...(isDevBuild() ? ['http://10.0.2.2:4000/api', 'http://localhost:4000/api'] : []),
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
  return CLERK_JWT_TEMPLATE || undefined;
}
