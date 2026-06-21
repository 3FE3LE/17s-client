'use client';

import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';
import { isApiError } from './api-client';

export const apiQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        if (isApiError(error) && error.status !== undefined && error.status < 500) {
          return false;
        }

        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
};

export function createApiQueryClient(config: QueryClientConfig = {}): QueryClient {
  return new QueryClient({
    ...apiQueryClientConfig,
    ...config,
    defaultOptions: {
      ...apiQueryClientConfig.defaultOptions,
      ...config.defaultOptions,
      queries: {
        ...apiQueryClientConfig.defaultOptions?.queries,
        ...config.defaultOptions?.queries,
      },
      mutations: {
        ...apiQueryClientConfig.defaultOptions?.mutations,
        ...config.defaultOptions?.mutations,
      },
    },
  });
}
