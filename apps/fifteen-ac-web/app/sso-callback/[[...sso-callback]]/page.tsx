import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { landingAuthUrl } from '@17suit/core/site-origins';

function resolveLandingSsoCallbackUrl(): string {
  return landingAuthUrl('sso-callback');
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
