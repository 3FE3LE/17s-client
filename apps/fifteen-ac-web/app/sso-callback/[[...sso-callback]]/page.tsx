import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

function resolveLandingSsoCallbackUrl(): string {
  const configuredSignIn = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
  const signInUrl =
    configuredSignIn && configuredSignIn.trim().length > 0
      ? configuredSignIn
      : 'http://localhost:3000/sign-in';
  return signInUrl.replace(/\/sign-in\/?$/, '/sso-callback');
}

function resolveAppRootFromHeaders(headerList: Headers): string {
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3000';
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}/`;
}

export default async function SsoCallbackRedirectPage() {
  const headerList = await headers();
  const returnTo = resolveAppRootFromHeaders(headerList);
  const callbackUrl = new URL(resolveLandingSsoCallbackUrl());
  callbackUrl.searchParams.set('redirect_url', returnTo);
  redirect(callbackUrl.toString());
}
