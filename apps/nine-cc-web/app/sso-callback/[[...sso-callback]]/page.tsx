import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolveRedirectTarget(rawValue: string | string[] | undefined): string {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  if (!value || value.trim().length === 0) return '/';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return url.toString();
  } catch {
    return '/';
  }
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
