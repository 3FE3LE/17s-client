import { createNextClerkMiddleware } from '@17suit/core/auth/next';

// Operator-only control plane: every route requires a Clerk session except the
// auth bridge routes, which forward to the shared landing sign-in. There is no
// public `/` and no sign-up bridge on purpose.
const PUBLIC_AUTH_BRIDGE_ROUTES = [
  '/sign-in(.*)',
  '/forgot-password(.*)',
  '/sso-callback(.*)',
] as const;

export default createNextClerkMiddleware({
  publicRoutes: [...PUBLIC_AUTH_BRIDGE_ROUTES],
  signInUrl: '/sign-in',
  signUpUrl: '/sign-in',
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico)).*)',
    '/(api|trpc)(.*)',
  ],
};
