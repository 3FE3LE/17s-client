import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@clerk/nextjs/server';

interface RedirectPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolveLandingSignInUrl(): string {
  const configured = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
  if (configured && configured.trim().length > 0) {
    return configured;
  }
  return 'http://localhost:3000/sign-in';
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
  try {
    const target = raw.startsWith('/') ? new URL(raw, appRoot) : new URL(raw);
    if (target.origin === new URL(appRoot).origin) {
      return target.toString();
    }
  } catch {
    return appRoot;
  }
  return appRoot;
}

export default async function SignInRedirectPage({ searchParams }: RedirectPageProps) {
  const headerList = await headers();
  const appRoot = resolveAppRootFromHeaders(headerList);
  const params = await searchParams;
  const returnTo = resolveReturnTo(appRoot, params.redirect_url);
  const { userId } = await auth();

  if (userId) {
    redirect(returnTo);
  }

  const signInUrl = new URL(resolveLandingSignInUrl());
  signInUrl.searchParams.set('redirect_url', returnTo);
  redirect(signInUrl.toString());
}
