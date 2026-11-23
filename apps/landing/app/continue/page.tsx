import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { resolveRedirectTarget } from '../lib/auth-redirect';
import { DEV_BROWSER_PARAM, withDevSession } from '../lib/session-handoff';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** The single exit from landing auth towards a product on another origin. */
export default async function ContinuePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const target = resolveRedirectTarget(params.redirect_url);
  const { userId } = await auth();

  if (!userId) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(target)}`);
  }

  const token = (await cookies()).get(DEV_BROWSER_PARAM)?.value;
  redirect(withDevSession(target, process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, token));
}
