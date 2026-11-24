import { createNextClerkMiddleware } from '@17suit/core/auth/next';
import { NextResponse } from 'next/server';
import { isFakeAuthEnabled } from '@/lib/fake-auth';

const PUBLIC_AUTH_BRIDGE_ROUTES = [
  '/',
  '/c/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/forgot-password(.*)',
  '/sso-callback(.*)',
] as const;

const clerkProxy = createNextClerkMiddleware({
  publicRoutes: [...PUBLIC_AUTH_BRIDGE_ROUTES],
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
});

/** E2E_FAKE_AUTH bypasses Clerk entirely (see lib/fake-auth.ts); impossible in production. */
export default function proxy(
  request: Parameters<typeof clerkProxy>[0],
  event: Parameters<typeof clerkProxy>[1],
) {
  if (isFakeAuthEnabled()) return NextResponse.next();
  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico)).*)',
    '/(api|trpc)(.*)',
  ],
};
