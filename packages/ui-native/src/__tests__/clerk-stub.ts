/**
 * Minimal `@clerk/clerk-expo` stub used by Vitest. Only `useAuth` is needed
 * to satisfy `useExpoAuthRedirect`; every other Clerk export is a sentinel
 * so accidental imports throw with a clear message during the test run.
 */

import { useEffect, useState } from 'react';

interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
}

interface AuthHolder {
  current: AuthState;
}

const authHolder: AuthHolder = {
  current: { isLoaded: false, isSignedIn: undefined },
};

/** Test-only: set the auth state returned by subsequent `useAuth()` calls. */
export function __setAuthForTests(state: Partial<AuthState>): void {
  authHolder.current = { ...authHolder.current, ...state };
}

/** Test-only: reset between tests so suites don't bleed. */
export function __resetAuthForTests(): void {
  authHolder.current = { isLoaded: false, isSignedIn: undefined };
}

export function useAuth(): AuthState {
  const [, forceRender] = useState(0);
  useEffect(() => {
    // Touch the holder so callers re-read it on the next render.
    forceRender((tick) => tick + 1);
  }, []);
  return authHolder.current;
}

export function useUser(): { isLoaded: boolean; user: null } {
  return { isLoaded: authHolder.current.isLoaded, user: null };
}

export function useSession(): { isLoaded: boolean } {
  return { isLoaded: authHolder.current.isLoaded };
}

function missingExport(name: string): never {
  throw new Error(`clerk-stub: '${name}' is not implemented; add it to the stub if needed.`);
}

// Sentinel for accidental imports the spec doesn't expect.
export const ClerkProvider: unknown = new Proxy(
  {},
  {
    get: () => (props: { children?: unknown }) => props?.children ?? null,
  },
);

export const SignedIn: unknown = () => null;
export const SignedOut: unknown = () => null;
export const SignInButton: unknown = () => null;
export const SignOutButton: unknown = () => null;

export const __missing = (name: string) => () => missingExport(name);
