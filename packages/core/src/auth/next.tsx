import { ClerkProvider } from '@clerk/nextjs';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

export interface NextClerkMiddlewareOptions {
  publicRoutes?: string[];
}

export const DEFAULT_NEXT_PUBLIC_ROUTES = ['/sign-in(.*)', '/sign-up(.*)'] as const;

export function createNextClerkMiddleware(options?: NextClerkMiddlewareOptions): any {
  const publicRoutes = options?.publicRoutes ?? [...DEFAULT_NEXT_PUBLIC_ROUTES];
  const isPublicRoute = createRouteMatcher(publicRoutes);

  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  });
}

export function WebAuthProvider({ children }: { children: any }): any {
  return ClerkProvider({
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    signInForceRedirectUrl: '/',
    signUpForceRedirectUrl: '/',
    children,
  });
}
