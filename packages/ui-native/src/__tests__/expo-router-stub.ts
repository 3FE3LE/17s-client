/**
 * Minimal `expo-router` stub used by Vitest. The router relies on a
 * context-driven navigator that doesn't exist in Node, so we replace
 * the surface hooks call (`useRouter`, `usePathname`) with simple
 * spies that the spec mutates per-test.
 */

import { useEffect, useRef } from 'react';

export interface StubRouter {
  replace: (href: string) => void;
  push: (href: string) => void;
  back: () => void;
  reset?: (state: unknown) => void;
}

interface RouterHolder {
  current: StubRouter;
}

const routerHolder: RouterHolder = {
  current: {
    replace: () => undefined,
    push: () => undefined,
    back: () => undefined,
  },
};

const pathnameHolder: { current: string } = { current: '/' };

/** Test-only: install a fake router that subsequent `useRouter()` calls return. */
export function __setRouterForTests(router: Partial<StubRouter>): void {
  routerHolder.current = {
    replace: () => undefined,
    push: () => undefined,
    back: () => undefined,
    ...router,
  };
}

/** Test-only: install a fake pathname. */
export function __setPathnameForTests(pathname: string): void {
  pathnameHolder.current = pathname;
}

/** Test-only: reset both stubs between tests. */
export function __resetRouterStubsForTests(): void {
  routerHolder.current = {
    replace: () => undefined,
    push: () => undefined,
    back: () => undefined,
  };
  pathnameHolder.current = '/';
}

export function useRouter(): StubRouter {
  // Re-render the host once on mount so consumers observe the latest holder.
  const ref = useRef(routerHolder.current);
  useEffect(() => {
    ref.current = routerHolder.current;
  }, []);
  return ref.current;
}

export function usePathname(): string {
  return pathnameHolder.current;
}

export function useSegments(): string[] {
  return pathnameHolder.current.split('/').filter(Boolean);
}

export const Stack = Object.assign(
  function Stack() {
    return null;
  },
  {
    Screen: function Screen() {
      return null;
    },
  },
);

export const Redirect = function Redirect() {
  return null;
};

export const Link = function Link() {
  return null;
};

export const router = routerHolder;

export default { useRouter, usePathname, useSegments, Stack, Redirect, Link };
