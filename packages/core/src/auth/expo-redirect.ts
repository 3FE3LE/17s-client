export interface ExpoAuthRedirectInput {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  pathname: string;
  publicPaths?: string[];
  signedInPath?: string;
  signedOutPath?: string;
}

export const DEFAULT_EXPO_PUBLIC_PATHS = ['/sign-in'] as const;

/**
 * Pure (no React, no expo-secure-store) helper that decides whether the
 * signed-in/out state should trigger a redirect. Used by the React hook
 * in `expo.tsx` and tested in isolation here.
 */
export function getExpoAuthRedirect(input: ExpoAuthRedirectInput): string | null {
  if (!input.isLoaded) return null;

  const publicPaths = input.publicPaths ?? [...DEFAULT_EXPO_PUBLIC_PATHS];
  const isPublicPath = publicPaths.some(
    (path) => input.pathname === path || input.pathname.startsWith(`${path}/`),
  );

  if (!input.isSignedIn && !isPublicPath) {
    return input.signedOutPath ?? '/sign-in';
  }

  if (input.isSignedIn && isPublicPath) {
    return input.signedInPath ?? '/';
  }

  return null;
}
