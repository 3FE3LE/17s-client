import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { landingAuthUrl } from '@17suit/core/site-origins';

interface RedirectPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolveLandingSignInUrl(): string {
  return landingAuthUrl('sign-in');
}

function resolveAppRootFromHeaders(headerList: Headers): string {
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3000';
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

export default async function SignInRedirectPage({ searchParams }: RedirectPageProps) {
  const headerList = await headers();
  const appRoot = resolveAppRootFromHeaders(headerList);
  const params = await searchParams;
  const returnTo = resolveReturnTo(appRoot, params.redirect_url);
  const signInUrl = new URL(resolveLandingSignInUrl());
  signInUrl.searchParams.set('redirect_url', returnTo);
  redirect(signInUrl.toString());
}
