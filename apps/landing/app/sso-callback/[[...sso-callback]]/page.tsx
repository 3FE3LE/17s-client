import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { resolveRedirectTarget } from '../../lib/auth-redirect';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SsoCallbackPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirectTarget = resolveRedirectTarget(params.redirect_url);

  return (
    <AuthenticateWithRedirectCallback
      signInForceRedirectUrl={redirectTarget}
      signUpForceRedirectUrl={redirectTarget}
    />
  );
}
