import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

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

export default async function ForgotPasswordRedirectPage() {
  const headerList = await headers();
  const returnTo = resolveAppRootFromHeaders(headerList);
  const forgotPasswordUrl = new URL(resolveLandingForgotPasswordUrl());
  forgotPasswordUrl.searchParams.set('redirect_url', returnTo);
  redirect(forgotPasswordUrl.toString());
}
