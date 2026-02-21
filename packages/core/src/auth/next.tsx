import { ClerkProvider } from '@clerk/nextjs';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

export interface NextClerkMiddlewareOptions {
  publicRoutes?: string[];
  signInUrl?: string;
  signUpUrl?: string;
}

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

export function createNextClerkMiddleware(options?: NextClerkMiddlewareOptions): any {
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
  );
}

export interface WebAuthProviderProps {
  children: any;
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
}: WebAuthProviderProps): any {
  const resolvedSignInUrl = resolveSignInUrl(signInUrl);
  const resolvedSignUpUrl = resolveSignUpUrl(signUpUrl);

  return (
    <ClerkProvider
      signInUrl={resolvedSignInUrl}
      signUpUrl={resolvedSignUpUrl}
      signInForceRedirectUrl={signInForceRedirectUrl ?? '/'}
      signUpForceRedirectUrl={signUpForceRedirectUrl ?? '/'}
    >
      {children}
    </ClerkProvider>
  );
}
