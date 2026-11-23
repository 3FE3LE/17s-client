import { redirectToLandingAuth, type AuthBridgeSearchParams } from '@/lib/auth-bridge';

interface RedirectPageProps {
  searchParams: AuthBridgeSearchParams;
}

export default async function ForgotPasswordRedirectPage({ searchParams }: RedirectPageProps) {
  return redirectToLandingAuth('/forgot-password', searchParams);
}
