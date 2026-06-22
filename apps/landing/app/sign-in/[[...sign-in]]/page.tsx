import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { resolveRedirectTarget } from '../../lib/auth-redirect';
import { SignInClient } from './sign-in-client';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirectTarget = resolveRedirectTarget(params.redirect_url);
  const { userId } = await auth();

  if (userId) {
    redirect(redirectTarget);
  }

  return <SignInClient redirectTarget={redirectTarget} />;
}
