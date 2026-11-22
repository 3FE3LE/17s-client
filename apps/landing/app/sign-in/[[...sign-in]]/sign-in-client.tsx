'use client';

import { useSignIn } from '@clerk/nextjs';
import { AppButton, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AuthFormError } from '../../components/AuthFormError';
import { AuthShell } from '../../components/AuthShell';
import { getClerkErrorMessage, isAlreadySignedInError } from '../../lib/clerk-errors';

const GENERIC_ERROR = 'No pudimos iniciar sesión. Inténtalo de nuevo en unos minutos.';

export function SignInClient({ redirectTarget }: { redirectTarget: string }) {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(redirectTarget);
        return;
      }

      setError(
        'No pudimos completar el inicio de sesión. Inténtalo de nuevo o restablece tu contraseña.',
      );
    } catch (err) {
      if (isAlreadySignedInError(err)) {
        router.replace(redirectTarget);
        return;
      }
      setError(getClerkErrorMessage(err, GENERIC_ERROR));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onGoogleSSO = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `/sso-callback?redirect_url=${encodeURIComponent(redirectTarget)}`,
        redirectUrlComplete: redirectTarget,
      });
    } catch (err) {
      // Session already active: skip SSO and continue to the product home.
      if (isAlreadySignedInError(err)) {
        router.replace(redirectTarget);
        return;
      }
      setError(getClerkErrorMessage(err, GENERIC_ERROR));
    }
  };

  return (
    <AuthShell
      title="Inicia sesión en 17Suit"
      description="Entra con Google o con tu correo y sigue en la app donde estabas."
    >
      <div className="mx-auto grid w-full max-w-form gap-sm">
        <button
          type="button"
          onClick={onGoogleSSO}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-sm rounded-[var(--radius-control)] border border-line bg-surface px-md text-md font-bold leading-[1.3] text-text transition-[border-color,box-shadow] duration-200 hover:border-[color-mix(in_oklab,var(--color-text)_36%,transparent)] hover:shadow-panel"
        >
          <GoogleMark />
          Continuar con Google
        </button>

        <p className="m-0 flex items-center gap-sm text-sm leading-[18px] text-muted before:h-px before:flex-1 before:bg-line before:content-[''] after:h-px after:flex-1 after:bg-line after:content-['']">
          o con tu correo
        </p>

        <form className="grid gap-sm" onSubmit={handlePasswordSignIn}>
          <AppInput
            type="email"
            name="email"
            value={email}
            onChangeText={setEmail}
            label="Correo electrónico"
            placeholder="tu@empresa.com"
            autoComplete="email"
            spellCheck={false}
            required
            error={Boolean(error)}
          />
          <AppInput
            type="password"
            name="password"
            value={password}
            onChangeText={setPassword}
            label="Contraseña"
            placeholder="Tu contraseña"
            autoComplete="current-password"
            required
            error={Boolean(error)}
          />
          <AppButton type="submit" compact disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </AppButton>
          <div id="clerk-captcha" />
          <AuthFormError message={error} />
        </form>

        <div className="flex flex-wrap justify-between gap-x-md">
          <Link
            href={`/sign-up?redirect_url=${encodeURIComponent(redirectTarget)}`}
            className="inline-flex min-h-11 items-center font-bold text-text underline underline-offset-4"
          >
            Crear cuenta
          </Link>
          <Link
            href={`/forgot-password?redirect_url=${encodeURIComponent(redirectTarget)}`}
            className="inline-flex min-h-11 items-center font-bold text-text underline underline-offset-4"
          >
            Olvidé mi contraseña
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
