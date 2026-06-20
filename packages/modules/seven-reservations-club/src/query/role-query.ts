'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  SevenReservationsClubPlatformUser,
  SevenReservationsClubRole,
} from '../onboarding-role';
import { useSevenReservationsClubRoleDataSource } from './RoleDataSourceProvider';

export const sevenReservationsClubQueryKeys = {
  currentRole: (userId?: string | null | void) =>
    ['seven-reservations-club', 'current-role', userId ?? 'anonymous'] as const,
};

export function useCurrentUserRoleQuery(options?: {
  userId?: string | null | void;
  enabled?: boolean;
}) {
  const dataSource = useSevenReservationsClubRoleDataSource();
  const userId = options?.userId ?? null;
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: sevenReservationsClubQueryKeys.currentRole(userId),
    queryFn: () => dataSource.getCurrentUserRole(),
    staleTime: 15_000,
    enabled,
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
      const cachePayload = { role: user.role, source: 'backend' as const };
      queryClient.setQueryData(sevenReservationsClubQueryKeys.currentRole(user.id), cachePayload);
      queryClient.setQueryData(
        sevenReservationsClubQueryKeys.currentRole(user.clerkUserId),
        cachePayload,
      );
    },
  });
}
