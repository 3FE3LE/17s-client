import { createNextClerkMiddleware } from '@17suit/core/auth/next';

const PUBLIC_AUTH_BRIDGE_ROUTES = [
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/forgot-password(.*)',
  '/sso-callback(.*)',
] as const;

export default createNextClerkMiddleware({
  publicRoutes: [...PUBLIC_AUTH_BRIDGE_ROUTES],
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico)).*)',
    '/(api|trpc)(.*)',
  ],
};
