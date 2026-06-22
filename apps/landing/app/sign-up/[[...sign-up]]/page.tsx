import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { resolveRedirectTarget } from '../../lib/auth-redirect';
import { SignUpClient } from './sign-up-client';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirectTarget = resolveRedirectTarget(params.redirect_url);
  const { userId } = await auth();

  if (userId) {
    redirect(redirectTarget);
  }

  return <SignUpClient redirectTarget={redirectTarget} />;
}
