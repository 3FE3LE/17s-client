'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  SevenReservationsClubPlatformUser,
  SevenReservationsClubRole,
} from '../onboarding-role';
import { useSevenReservationsClubRoleDataSource } from './RoleDataSourceProvider';

export const sevenReservationsClubQueryKeys = {
  currentRole: ['seven-reservations-club', 'current-role'] as const,
};

export function useCurrentUserRoleQuery() {
  const dataSource = useSevenReservationsClubRoleDataSource();

  const query = useQuery({
    queryKey: sevenReservationsClubQueryKeys.currentRole,
    queryFn: () => dataSource.getCurrentUserRole(),
    staleTime: 15_000,
  });

  return {
    role: query.data?.role ?? null,
    source: query.data?.source ?? 'none',
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}

export function useSetCurrentUserRoleMutation() {
  const queryClient = useQueryClient();
  const dataSource = useSevenReservationsClubRoleDataSource();

  return useMutation({
    mutationFn: (role: SevenReservationsClubRole) => dataSource.setCurrentUserRole(role),
    onSuccess: (user: SevenReservationsClubPlatformUser) => {
      queryClient.setQueryData(sevenReservationsClubQueryKeys.currentRole, {
        role: user.role,
        source: 'backend' as const,
      });
    },
  });
}
