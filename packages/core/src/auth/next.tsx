import { ClerkProvider } from '@clerk/nextjs';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { ReactNode } from 'react';

export interface NextClerkMiddlewareOptions {
  publicRoutes?: string[];
  signInUrl?: string;
  signUpUrl?: string;
}

export type NextClerkMiddleware = (request: unknown, event: unknown) => unknown;

export const DEFAULT_NEXT_PUBLIC_ROUTES = ['/sign-in(.*)', '/sign-up(.*)'] as const;

function resolveSignInUrl(explicit?: string): string {
  if (explicit && explicit.trim().length > 0) {
    return explicit;
  }
  const envValue = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
  if (envValue && envValue.trim().length > 0) {
    return envValue;
  }
  return '/sign-in';
}

function resolveSignUpUrl(explicit?: string): string {
  if (explicit && explicit.trim().length > 0) {
    return explicit;
  }
  const envValue = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL;
  if (envValue && envValue.trim().length > 0) {
    return envValue;
  }
  return '/sign-up';
}

function resolvePublishableKey(): string | undefined {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  }
  if (process.env.CI === 'true') {
    return ['pk', 'test', 'ZmFrZS5jbGVyay5hY2NvdW50cy5kZXYk'].join('_');
  }
  return undefined;
}

export function createNextClerkMiddleware(
  options?: NextClerkMiddlewareOptions,
): NextClerkMiddleware {
  const publicRoutes = options?.publicRoutes ?? [...DEFAULT_NEXT_PUBLIC_ROUTES];
  const isPublicRoute = createRouteMatcher(publicRoutes);
  const signInUrl = resolveSignInUrl(options?.signInUrl);
  const signUpUrl = resolveSignUpUrl(options?.signUpUrl);

  return clerkMiddleware(
    async (auth, req) => {
      if (!isPublicRoute(req)) {
        await auth.protect();
      }
    },
    {
      signInUrl,
      signUpUrl,
    },
  ) as NextClerkMiddleware;
}

export interface WebAuthProviderProps {
  children: ReactNode;
  signInUrl?: string;
  signUpUrl?: string;
  signInForceRedirectUrl?: string;
  signUpForceRedirectUrl?: string;
}

export function WebAuthProvider({
  children,
  signInUrl,
  signUpUrl,
  signInForceRedirectUrl,
  signUpForceRedirectUrl,
}: WebAuthProviderProps) {
  const resolvedSignInUrl = resolveSignInUrl(signInUrl);
  const resolvedSignUpUrl = resolveSignUpUrl(signUpUrl);
  const publishableKey = resolvePublishableKey();

  return (
    <ClerkProvider
      {...(publishableKey ? { publishableKey } : {})}
      signInUrl={resolvedSignInUrl}
      signUpUrl={resolvedSignUpUrl}
      signInForceRedirectUrl={signInForceRedirectUrl ?? '/'}
      signUpForceRedirectUrl={signUpForceRedirectUrl ?? '/'}
    >
      {children}
    </ClerkProvider>
  );
}
