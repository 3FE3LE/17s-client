import { useAuth } from '@clerk/clerk-expo';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import {
  SevenReservationsClubRoleDataSourceProvider,
  createSevenRcQueryClient,
  createExternalPlatformRoleDataSource,
} from '@17suit/module-seven-reservations-club/client';
import { useMemo, useState, type PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';
import { isClientError, isTransportError } from '../lib/error-messages';
import { resolveApiBaseUrls, resolveClerkJwtTemplate } from '../lib/seven-rc-api';

// React Native has no window focus: treat the app coming to the foreground as
// focus, so queries that opt into `refetchOnWindowFocus` refresh on return.
// Registered once at module load; React Query owns the subscription lifecycle.
if (Platform.OS !== 'web') {
  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener('change', (state) => {
      handleFocus(state === 'active');
    });
    return () => subscription.remove();
  });
}

/**
 * Runs `attempt` against each base URL, moving on only when no response came
 * back. A 401 (or any HTTP answer) is final.
 */
async function withApiFailover<T>(
  apiBaseUrls: string[],
  attempt: (apiBaseUrl: string) => Promise<T>,
): Promise<T> {
  let lastError: unknown = null;
  for (const apiBaseUrl of apiBaseUrls) {
    try {
      return await attempt(apiBaseUrl);
    } catch (error) {
      if (!isTransportError(error)) throw error;
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Unable to reach API');
}

function createQueryClient() {
  const client = createSevenRcQueryClient();
  const defaults = client.getDefaultOptions();
  client.setDefaultOptions({
    ...defaults,
    queries: {
      ...defaults.queries,
      // The shared client only recognizes `ApiError`, so it retried 7RC 401s once.
      retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
    },
  });
  return client;
}

export function SevenRcClientProviders({ children }: PropsWithChildren) {
  const { getToken } = useAuth();

  const dataSource = useMemo(() => {
    const apiBaseUrls = resolveApiBaseUrls();
    const jwtTemplate = resolveClerkJwtTemplate();
    const sourceFor = (apiBaseUrl: string) =>
      createExternalPlatformRoleDataSource({
        apiBaseUrl,
        getAccessToken: async () => {
          if (jwtTemplate) {
            return (await getToken({ template: jwtTemplate })) ?? null;
          }
          return (await getToken()) ?? null;
        },
      });

    return {
      getCurrentUserRole: () =>
        withApiFailover(apiBaseUrls, (url) => sourceFor(url).getCurrentUserRole()),
      setCurrentUserRole: (role: 'OWNER' | 'PLAYER') =>
        withApiFailover(apiBaseUrls, (url) => sourceFor(url).setCurrentUserRole(role)),
    };
  }, [getToken]);

  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <SevenReservationsClubRoleDataSourceProvider dataSource={dataSource}>
        {children}
      </SevenReservationsClubRoleDataSourceProvider>
    </QueryClientProvider>
  );
}
