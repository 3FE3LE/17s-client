import { useAuth } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  SevenReservationsClubRoleDataSourceProvider,
  createExternalPlatformRoleDataSource,
} from '@17suit/module-seven-reservations-club/client';
import { useMemo, useState, type PropsWithChildren } from 'react';

function resolveApiBaseUrl(): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  const value = env?.EXPO_PUBLIC_API_BASE_URL ?? env?.API_BASE_URL;
  if (value && value.length > 0) {
    return value;
  }
  return 'http://localhost:4000';
}

function resolveClerkJwtTemplate(): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env?.EXPO_PUBLIC_CLERK_JWT_TEMPLATE || undefined;
}

export function SevenRcClientProviders({ children }: PropsWithChildren) {
  const { getToken } = useAuth();
  const apiBaseUrl = resolveApiBaseUrl();
  const jwtTemplate = resolveClerkJwtTemplate();

  const dataSource = useMemo(
    () =>
      createExternalPlatformRoleDataSource({
        apiBaseUrl,
        getAccessToken: async () => {
          if (!jwtTemplate) {
            return null;
          }
          return (await getToken({ template: jwtTemplate })) ?? null;
        },
      }),
    [apiBaseUrl, getToken, jwtTemplate],
  );

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SevenReservationsClubRoleDataSourceProvider dataSource={dataSource}>
        {children}
      </SevenReservationsClubRoleDataSourceProvider>
    </QueryClientProvider>
  );
}
