'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  SevenReservationsClubRoleDataSourceProvider,
  createWebBffRoleDataSource,
} from '@17suit/module-seven-reservations-club/client';
import { useState, type PropsWithChildren } from 'react';

const roleDataSource = createWebBffRoleDataSource();

export function SevenRcClientProviders({ children }: PropsWithChildren) {
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
      <SevenReservationsClubRoleDataSourceProvider dataSource={roleDataSource}>
        {children}
      </SevenReservationsClubRoleDataSourceProvider>
    </QueryClientProvider>
  );
}
