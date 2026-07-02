import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear cuenta | Nine Care Companion',
};

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

export default async function SignUpPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const fallbackRedirectUrl = resolveRedirectTarget(params.redirect_url);

  return (
    <main className="flex min-h-screen items-center justify-center bg-suit-landing-canvas p-[var(--spacing-lg)]">
      <SignUp
        fallbackRedirectUrl={fallbackRedirectUrl}
        signInUrl="/sign-in"
        forceRedirectUrl={fallbackRedirectUrl}
      />
    </main>
  );
}
