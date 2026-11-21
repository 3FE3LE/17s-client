import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Mirrors the auth bridge pages in seven-rc-web / fifteen-ac-web: admin hosts no
// Clerk UI of its own and forwards to the shared landing auth surface, carrying
// an absolute `redirect_url` back to this app.

export type AuthBridgeSearchParams = Promise<Record<string, string | string[] | undefined>>;

type LandingAuthPath = '/sign-in' | '/forgot-password' | '/sso-callback';

function resolveLandingUrl(path: LandingAuthPath): string {
  const configured = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
  const signInUrl =
    configured && configured.trim().length > 0 ? configured : 'http://localhost:3000/sign-in';
  return path === '/sign-in' ? signInUrl : signInUrl.replace(/\/sign-in\/?$/, path);
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
