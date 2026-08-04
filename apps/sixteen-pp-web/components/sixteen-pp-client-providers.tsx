'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';

/**
 * Minimal client providers for the web shell. MVP has no role data-source or
 * BFF query stack — just a React Query client so client components can use it.
 * Expand when the generation pipeline needs shared client state.
 */
export function SixteenPpClientProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
