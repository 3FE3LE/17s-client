'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import {
  SevenReservationsClubRoleDataSourceProvider,
  createSevenRcQueryClient,
  createWebBffRoleDataSource,
} from '@17suit/module-seven-reservations-club/client';
import { useState, type PropsWithChildren } from 'react';

const roleDataSource = createWebBffRoleDataSource();

export function SevenRcClientProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createSevenRcQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SevenReservationsClubRoleDataSourceProvider dataSource={roleDataSource}>
        {children}
      </SevenReservationsClubRoleDataSourceProvider>
    </QueryClientProvider>
  );
}
