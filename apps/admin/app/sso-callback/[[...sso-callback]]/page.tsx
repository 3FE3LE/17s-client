import { redirectToLandingAuth, type AuthBridgeSearchParams } from '@/lib/auth-bridge';

interface RedirectPageProps {
  searchParams: AuthBridgeSearchParams;
}

export default async function SsoCallbackRedirectPage({ searchParams }: RedirectPageProps) {
  return redirectToLandingAuth('/sso-callback', searchParams);
}
