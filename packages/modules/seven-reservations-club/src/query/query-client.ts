'use client';

import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

const sevenRcQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
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

export function createSevenRcQueryClient(): QueryClient {
  return new QueryClient(sevenRcQueryClientConfig);
}
