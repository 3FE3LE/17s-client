'use client';

import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

const sevenRcQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
};

export function createSevenRcQueryClient(): QueryClient {
  return new QueryClient(sevenRcQueryClientConfig);
}
