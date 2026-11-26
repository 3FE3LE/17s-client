import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from '@17suit/i18n';
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

/*
 * Clerk stays the only auth layer. On top of it, marketing pages get their
 * locale from the URL: `en` has no prefix (`/contact` is rewritten to
 * `/en/contact`), `es` lives under `/es`. Account routes and Next/Clerk
 * internals pass through untouched; their locale comes from the cookie.
 */
const PASS_THROUGH = new Set([
  'sign-in',
  'sign-up',
  'forgot-password',
  'sso-callback',
  'continue',
  'apps',
  'api',
  'trpc',
  'robots.txt',
  'sitemap.xml',
]);

/** Spanish paths the landing used before i18n, now permanent redirects to `/es/...`. */
const LEGACY_SPANISH_PATHS: Record<string, string> = {
  privacidad: 'privacy',
  terminos: 'terms',
  contacto: 'contact',
};

function withLocaleCookie(request: NextRequest, response: NextResponse, locale: string) {
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }
  return response;
}

export default clerkMiddleware((_auth, request) => {
  const { pathname } = request.nextUrl;
  const [first = '', ...rest] = pathname.split('/').filter(Boolean);

  if (PASS_THROUGH.has(first)) return;

  const legacyTarget = LEGACY_SPANISH_PATHS[first];
  if (legacyTarget) {
    const url = request.nextUrl.clone();
    url.pathname = `/es/${[legacyTarget, ...rest].join('/')}`;
    return NextResponse.redirect(url, 308);
  }

  if (first === DEFAULT_LOCALE) {
    // `/en/...` duplicates the unprefixed page: keep one canonical URL.
    const url = request.nextUrl.clone();
    url.pathname = `/${rest.join('/')}`;
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) {
    return withLocaleCookie(request, NextResponse.next(), first);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return withLocaleCookie(request, NextResponse.rewrite(url), DEFAULT_LOCALE);
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico)).*)',
    '/(api|trpc)(.*)',
  ],
};
