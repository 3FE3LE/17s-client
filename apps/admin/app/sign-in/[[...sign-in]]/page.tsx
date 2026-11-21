import { redirectToLandingAuth, type AuthBridgeSearchParams } from '@/lib/auth-bridge';

interface RedirectPageProps {
  searchParams: AuthBridgeSearchParams;
}

export default async function SignInRedirectPage({ searchParams }: RedirectPageProps) {
  return redirectToLandingAuth('/sign-in', searchParams);
}
