import { useAuth } from '@clerk/clerk-expo';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  SevenReservationsClubRoleDataSourceProvider,
  createSevenRcQueryClient,
  createExternalPlatformRoleDataSource,
} from '@17suit/module-seven-reservations-club/client';
import Constants from 'expo-constants';
import { useMemo, useState, type PropsWithChildren } from 'react';

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

function resolveApiBaseUrls(): string[] {
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

function resolveClerkJwtTemplate(): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env?.EXPO_PUBLIC_CLERK_JWT_TEMPLATE || undefined;
}

function toError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

export function SevenRcClientProviders({ children }: PropsWithChildren) {
  const { getToken } = useAuth();
  const apiBaseUrls = resolveApiBaseUrls();
  const jwtTemplate = resolveClerkJwtTemplate();

  const dataSource = useMemo(
    () => ({
      async getCurrentUserRole() {
        let lastError: unknown = null;
        for (const apiBaseUrl of apiBaseUrls) {
          try {
            const source = createExternalPlatformRoleDataSource({
              apiBaseUrl,
              getAccessToken: async () => {
                if (jwtTemplate) {
                  return (await getToken({ template: jwtTemplate })) ?? null;
                }
                return (await getToken()) ?? null;
              },
            });
            return await source.getCurrentUserRole();
          } catch (error) {
            lastError = error;
          }
        }
        throw toError(lastError, 'Unable to resolve API base URL');
      },
      async setCurrentUserRole(role: 'OWNER' | 'PLAYER') {
        let lastError: unknown = null;
        for (const apiBaseUrl of apiBaseUrls) {
          try {
            const source = createExternalPlatformRoleDataSource({
              apiBaseUrl,
              getAccessToken: async () => {
                if (jwtTemplate) {
                  return (await getToken({ template: jwtTemplate })) ?? null;
                }
                return (await getToken()) ?? null;
              },
            });
            return await source.setCurrentUserRole(role);
          } catch (error) {
            lastError = error;
          }
        }
        throw toError(lastError, 'Unable to resolve API base URL');
      },
    }),
    [apiBaseUrls, getToken, jwtTemplate],
  );

  const [queryClient] = useState(() => createSevenRcQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SevenReservationsClubRoleDataSourceProvider dataSource={dataSource}>
        {children}
      </SevenReservationsClubRoleDataSourceProvider>
    </QueryClientProvider>
  );
}
