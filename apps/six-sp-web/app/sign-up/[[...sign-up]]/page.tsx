import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

function resolveLandingSignUpUrl(): string {
  const configured = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL;
  if (configured && configured.trim().length > 0) {
    return configured;
  }
  return 'http://localhost:3000/sign-up';
}

function resolveAppRootFromHeaders(headerList: Headers): string {
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3000';
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}/`;
}

export default async function SignUpRedirectPage() {
  const headerList = await headers();
  const returnTo = resolveAppRootFromHeaders(headerList);
  const signUpUrl = new URL(resolveLandingSignUpUrl());
  signUpUrl.searchParams.set('redirect_url', returnTo);
  redirect(signUpUrl.toString());
}
