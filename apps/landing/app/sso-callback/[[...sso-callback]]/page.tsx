import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolveRedirectTarget(rawValue: string | string[] | undefined): string {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  if (!value || value.trim().length === 0) {
    return '/';
  }
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL,
    process.env.NEXT_PUBLIC_SEVEN_RC_WEB_URL,
    process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS,
  ]
    .flatMap((entry) => entry?.split(',') ?? [])
    .map((entry) => entry.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  try {
    const url = new URL(value);
    if (allowedOrigins.includes(url.origin)) {
      return url.toString();
    }
  } catch {
    return '/';
  }

  return '/';
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
