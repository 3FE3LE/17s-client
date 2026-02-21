import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

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

export default async function SignInRedirectPage() {
  const headerList = await headers();
  const returnTo = resolveAppRootFromHeaders(headerList);
  const signInUrl = new URL(resolveLandingSignInUrl());
  signInUrl.searchParams.set('redirect_url', returnTo);
  redirect(signInUrl.toString());
}
