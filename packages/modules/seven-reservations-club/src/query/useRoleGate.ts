'use client';

import { useEffect } from 'react';
import type { SevenReservationsClubRole } from '../onboarding-role';
import { getSevenReservationsClubRoleHomePath } from '../onboarding-role';
import { useCurrentUserRoleQuery } from './role-query';

type RouterLike = {
  replace: (href: string) => void;
};

export interface UseRoleGateOptions {
  /**
   * The role that the current page is intended for. When the resolved
   * role doesn't match, the user is redirected. Pass `'*'` to require
   * any signed-in role.
   */
  required: SevenReservationsClubRole | '*';
  /** Router with a `replace(href)` method. Pass the router from your
   * framework of choice (`useRouter()` from `next/navigation` or
   * `expo-router`). The hook is framework-agnostic and doesn't pull any
   * navigator-specific imports. */
  router: RouterLike;
  /** Page rendered when the user has no role yet. Default `/onboarding/role`. */
  onboardingPath?: string;
  /**
   * When false, the hook defers the imperative redirect and the `allowed`
   * flag stays `false`. Use this when the underlying router isn't ready
   * yet (e.g. before the root navigation tree mounts in Expo Router).
   * Default `true`.
   */
  ready?: boolean;
}

export interface UseRoleGateResult {
  allowed: boolean;
  isLoading: boolean;
}

/**
 * Returns the gate state and performs the imperative redirect when the
 * resolved role doesn't match the requirement. The
 * `no-restricted-syntax` rule for `useEffect` is intentionally isolated to
 * this single hook so every call site is one line.
 *
 * Contract:
 *  - When `ready` is false or `isLoading` is true, the hook performs no
 *    redirect and returns `{ allowed: false, isLoading: true }`.
 *  - When the resolved role matches `required`, returns
 *    `{ allowed: true, isLoading: false }` and performs no redirect.
 *  - When the role is missing and `required === '*'`, redirects to
 *    `onboardingPath` so the user can pick a role.
 *  - When the resolved role is a different specific role than `required`,
 *    redirects to the actual role's home page.
 */
export function useRoleGate({
  required,
  router,
  onboardingPath = '/onboarding/role',
  ready = true,
}: UseRoleGateOptions): UseRoleGateResult {
  const { role, isLoading } = useCurrentUserRoleQuery();

  useEffect(() => {
    if (!ready || isLoading) return;

    if (role === null || role === undefined) {
      if (required === '*') {
        router.replace(onboardingPath);
      }
      return;
    }

    if (role !== required && required !== '*') {
      router.replace(getSevenReservationsClubRoleHomePath(role));
    }
  }, [isLoading, onboardingPath, ready, required, role, router]);

  if (!ready || isLoading) {
    return { allowed: false, isLoading: true };
  }

  if (role === null || role === undefined) {
    return { allowed: required === '*', isLoading: false };
  }

  if (required === '*') {
    return { allowed: true, isLoading: false };
  }

  return { allowed: role === required, isLoading: false };
}
