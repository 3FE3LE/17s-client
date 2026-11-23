'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import {
  SevenReservationsClubRoleDataSourceProvider,
  createSevenRcQueryClient,
  createWebBffRoleDataSource,
} from '@17suit/module-seven-reservations-club/client';
import { useMemo, useState, type PropsWithChildren } from 'react';
import { useAccessToken } from '@/lib/use-access-token';

export function SevenRcClientProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createSevenRcQueryClient());
  const getAccessToken = useAccessToken();
  const roleDataSource = useMemo(
    () => createWebBffRoleDataSource({ getAccessToken }),
    [getAccessToken],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SevenReservationsClubRoleDataSourceProvider dataSource={roleDataSource}>
        {children}
      </SevenReservationsClubRoleDataSourceProvider>
    </QueryClientProvider>
  );
}
