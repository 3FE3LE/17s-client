import { useEffect } from 'react';

type RouterLike = {
  replace: (href: string) => void;
};

export interface UseRouteRoleSplashOptions<TRole extends string> {
  router: RouterLike;
  /** True when the role query finished loading (and the user resolved). */
  isLoading: boolean;
  /** The user is signed in (`useAuth().isSignedIn`). */
  isSignedIn: boolean | undefined;
  /** The Clerk auth state finished loading. */
  isAuthLoaded: boolean;
  /** The resolved role. `null` if the user has no role yet. */
  role: TRole | null | undefined;
  /** The role data source error. Any truthy value triggers the retry flow. */
  error: unknown;
  /** Path to send users without a role to. */
  roleOnboardingPath: string;
  /** Path to send unauthenticated users to. */
  signedOutPath: string;
  /**
   * Resolves the destination to send a signed-in user with a resolved
   * role to (typically the role's home page).
   */
  resolveHomePath: (role: TRole) => string;
  /**
   * When false, the hook defers the imperative redirect. Use this when
   * the underlying router isn't ready yet (e.g. before the root
   * navigation tree mounts in Expo Router).
   */
  ready?: boolean;
}

/**
 * Drives the entry-point redirect chain used by the splash / index
 * screen of mobile apps:
 *
 *  - if Clerk is still loading, do nothing.
 *  - if the user is not signed in, redirect to `signedOutPath`.
 *  - if a role data error occurred, redirect to `roleOnboardingPath` so
 *    the user can retry onboarding.
 *  - if the role is still loading, do nothing.
 *  - if the user has no role, redirect to `roleOnboardingPath` so they
 *    can pick one.
 *  - if the user has a role, redirect to `resolveHomePath(role)`.
 *
 * Imperative redirects can only run as a side effect, so the
 * `no-restricted-syntax` rule for `useEffect` is intentionally isolated
 * to this single hook.
 */
export function useRouteRoleSplash<TRole extends string>({
  router,
  isLoading,
  isSignedIn,
  isAuthLoaded,
  role,
  error,
  roleOnboardingPath,
  signedOutPath,
  resolveHomePath,
  ready = true,
}: UseRouteRoleSplashOptions<TRole>): void {
  useEffect(() => {
    if (!ready || !isAuthLoaded) return;

    if (isSignedIn !== true) {
      router.replace(signedOutPath);
      return;
    }

    if (error) {
      router.replace(roleOnboardingPath);
      return;
    }

    if (isLoading) return;

    if (role === null || role === undefined) {
      router.replace(roleOnboardingPath);
      return;
    }

    router.replace(resolveHomePath(role));
  }, [
    error,
    isAuthLoaded,
    isLoading,
    isSignedIn,
    ready,
    resolveHomePath,
    role,
    roleOnboardingPath,
    router,
    signedOutPath,
  ]);
}
