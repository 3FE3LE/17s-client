import { createNextClerkMiddleware } from '@17suit/core/auth/next';

export default createNextClerkMiddleware({
  publicRoutes: ['/sso-callback(.*)'],
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico)).*)',
    '/(api|trpc)(.*)',
  ],
};
