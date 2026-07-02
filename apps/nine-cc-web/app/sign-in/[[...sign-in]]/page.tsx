import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar sesion | Nine Care Companion',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolveRedirectTarget(rawValue: string | string[] | undefined): string {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  if (!value || value.trim().length === 0) return '/';
  if (value.startsWith('/') && !value.startsWith('//')) return value;

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_NINE_CC_WEB_URL,
    process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS,
  ]
    .flatMap((entry) => entry?.split(',') ?? [])
    .map((entry) => entry.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  try {
    const url = new URL(value);
    if (allowedOrigins.includes(url.origin)) return url.toString();
  } catch {
    return '/';
  }
  return '/';
}

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const fallbackRedirectUrl = resolveRedirectTarget(params.redirect_url);

  return (
    <main className="flex min-h-screen items-center justify-center bg-suit-landing-canvas p-[var(--spacing-lg)]">
      <SignIn
        fallbackRedirectUrl={fallbackRedirectUrl}
        signUpUrl="/sign-up"
        forceRedirectUrl={fallbackRedirectUrl}
      />
    </main>
  );
}
