import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

interface RedirectPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolveLandingForgotPasswordUrl(): string {
  const configuredSignIn = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
  const signInUrl =
    configuredSignIn && configuredSignIn.trim().length > 0
      ? configuredSignIn
      : 'http://localhost:3000/sign-in';
  return signInUrl.replace(/\/sign-in\/?$/, '/forgot-password');
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

export default async function ForgotPasswordRedirectPage({ searchParams }: RedirectPageProps) {
  const headerList = await headers();
  const appRoot = resolveAppRootFromHeaders(headerList);
  const params = await searchParams;
  const returnTo = resolveReturnTo(appRoot, params.redirect_url);
  const forgotPasswordUrl = new URL(resolveLandingForgotPasswordUrl());
  forgotPasswordUrl.searchParams.set('redirect_url', returnTo);
  redirect(forgotPasswordUrl.toString());
}
