import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { landingAuthUrl } from '@17suit/core/site-origins';

function resolveLandingForgotPasswordUrl(): string {
  return landingAuthUrl('forgot-password');
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
