import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { getExpoAuthRedirect } from '@17suit/core/auth/expo-redirect';

export interface UseExpoAuthRedirectOptions {
  publicPaths?: readonly string[];
  signedInPath?: string;
  signedOutPath?: string;
}

/**
 * Imperative side effect (`router.replace` after Clerk auth state
 * resolves) that can't be expressed as derived state. The
 * `no-restricted-syntax` rule for `useEffect` is intentionally isolated
 * to this single hook so every consumer stays a one-liner.
 *
 * Contract: calls `router.replace(target)` when the redirect target
 * differs from the current pathname; no-op otherwise. Also returns null
 * from the underlying helper until Clerk finishes loading, so the
 * redirect is deferred naturally.
 */
export function useExpoAuthRedirect({
  publicPaths,
  signedInPath,
  signedOutPath,
}: UseExpoAuthRedirectOptions = {}): void {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const target = getExpoAuthRedirect({
      isLoaded,
      isSignedIn,
      pathname,
      publicPaths: [...(publicPaths ?? [])],
      ...(signedInPath !== undefined ? { signedInPath } : {}),
      ...(signedOutPath !== undefined ? { signedOutPath } : {}),
    });
    if (target && target !== pathname) {
      router.replace(target);
    }
  }, [isLoaded, isSignedIn, publicPaths, signedInPath, signedOutPath, pathname, router]);
}
