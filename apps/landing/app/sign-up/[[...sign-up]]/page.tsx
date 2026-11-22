import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { resolveRedirectTarget } from '../../lib/auth-redirect';
import { SignUpClient } from './sign-up-client';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const params = await searchParams;
  // Sign-up with no product to return to lands on "Elige tu app" (/apps), not home.
  // Product pages pass `redirect_url` so their sign-ups still go back to the product.
  const redirectTarget = params.redirect_url ? resolveRedirectTarget(params.redirect_url) : '/apps';
  const { userId } = await auth();

  if (userId) {
    redirect(redirectTarget);
  }

  return <SignUpClient redirectTarget={redirectTarget} />;
}
