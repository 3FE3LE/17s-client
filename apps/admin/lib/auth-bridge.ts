import { headers } from 'next/headers';
import { landingAuthUrl } from '@17suit/core/site-origins';
import { redirect } from 'next/navigation';

// Mirrors the auth bridge pages in seven-rc-web / fifteen-ac-web: admin hosts no
// Clerk UI of its own and forwards to the shared landing auth surface, carrying
// an absolute `redirect_url` back to this app.

export type AuthBridgeSearchParams = Promise<Record<string, string | string[] | undefined>>;

type LandingAuthPath = '/sign-in' | '/forgot-password' | '/sso-callback';

function resolveLandingUrl(path: LandingAuthPath): string {
  return landingAuthUrl(path.slice(1) as 'sign-in' | 'forgot-password' | 'sso-callback');
}

/** Origin of the shared landing site (where a full sign-out sends the user). */
export function resolveLandingHomeUrl(): string {
  return new URL(resolveLandingUrl('/sign-in')).origin;
}

function resolveAppRootFromHeaders(headerList: Headers): string {
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3018';
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}/`;
}

function resolveReturnTo(appRoot: string, redirectParam: string | string[] | undefined): string {
  const raw = Array.isArray(redirectParam) ? redirectParam[0] : redirectParam;
  if (!raw || raw.trim().length === 0) {
    return appRoot;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  if (raw.startsWith('/')) {
    return new URL(raw, appRoot).toString();
  }
  return appRoot;
}

export async function redirectToLandingAuth(
  path: LandingAuthPath,
  searchParams: AuthBridgeSearchParams,
): Promise<never> {
  const headerList = await headers();
  const appRoot = resolveAppRootFromHeaders(headerList);
  const params = await searchParams;
  const target = new URL(resolveLandingUrl(path));
  target.searchParams.set('redirect_url', resolveReturnTo(appRoot, params.redirect_url));
  redirect(target.toString());
}
