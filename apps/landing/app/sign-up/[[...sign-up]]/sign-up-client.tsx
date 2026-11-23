'use client';

import { useSignUp } from '@clerk/nextjs';
import { AppButton, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AuthFormError } from '../../components/AuthFormError';
import { AuthShell } from '../../components/AuthShell';
import {
  getClerkErrorField,
  getClerkErrorMessage,
  isAlreadySignedInError,
  type AuthErrorField,
} from '../../lib/clerk-errors';
import { afterAuthPath } from '../../lib/session-handoff';

const GENERIC_ERROR = 'No pudimos crear tu cuenta. Inténtalo de nuevo en unos minutos.';
const ERROR_ID = 'sign-up-error';
const PASSWORD_HINT_ID = 'sign-up-password-hint';

type SignUpErrorField = AuthErrorField | 'confirmPassword';

interface SignUpClientProps {
  redirectTarget: string;
  productContext?: { accentKey: string; text: string } | undefined;
}

export function SignUpClient({ redirectTarget, productContext }: SignUpClientProps) {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<SignUpErrorField>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
    setErrorField(null);
  };
  const fail = (err: unknown, fallback: string) => {
    setError(getClerkErrorMessage(err, fallback));
    setErrorField(getClerkErrorField(err));
  };
  const isInvalid = (field: Exclude<SignUpErrorField, null>) =>
    Boolean(error) && errorField === field;
  const describedBy = (field: Exclude<SignUpErrorField, null>, hintId?: string) =>
    [hintId, isInvalid(field) ? ERROR_ID : null].filter(Boolean).join(' ') || undefined;

  const MISMATCH_ERROR = 'Las contraseñas no coinciden.';

  // Checked on blur so the mismatch shows before submit; submit checks again.
  const handleConfirmBlur = () => {
    if (confirmPassword && password !== confirmPassword) {
      setError(MISMATCH_ERROR);
      setErrorField('confirmPassword');
    } else if (errorField === 'confirmPassword') {
      clearError();
    }
  };

  // Typing in either password field clears a stale mismatch error.
  const clearMismatch = () => {
    if (errorField === 'confirmPassword') clearError();
  };

  const onGoogleSSO = async () => {
    if (!isLoaded || isGooglePending) return;

    setIsGooglePending(true);
    clearError();

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `/sso-callback?redirect_url=${encodeURIComponent(redirectTarget)}`,
        redirectUrlComplete: afterAuthPath(redirectTarget),
      });
    } catch (err) {
      // Session already active: skip SSO and continue to the target.
      if (isAlreadySignedInError(err)) {
        router.replace(afterAuthPath(redirectTarget));
        return;
      }
      fail(err, GENERIC_ERROR);
      // The redirect only happens on success, so the button is re-enabled on failure.
      setIsGooglePending(false);
    }
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      setError(MISMATCH_ERROR);
      setErrorField('confirmPassword');
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(afterAuthPath(redirectTarget));
        return;
      }

      if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setNeedsVerification(true);
        return;
      }

      setError('No pudimos crear tu cuenta. Inténtalo de nuevo.');
    } catch (err) {
      if (isAlreadySignedInError(err)) {
        router.replace(afterAuthPath(redirectTarget));
        return;
      }
      fail(err, GENERIC_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    setIsSubmitting(true);
    clearError();
    setResendNotice(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(afterAuthPath(redirectTarget));
        return;
      }

      setError('No pudimos verificar el código. Revisa tu correo e inténtalo de nuevo.');
      setErrorField('code');
    } catch (err) {
      fail(err, GENERIC_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || isResending) return;

    setIsResending(true);
    clearError();
    setResendNotice(null);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setCode('');
      setResendNotice(`Te enviamos un código nuevo a ${email.trim()}.`);
    } catch (err) {
      fail(err, 'No pudimos reenviar el código. Espera unos minutos e inténtalo de nuevo.');
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    setNeedsVerification(false);
    setCode('');
    setResendNotice(null);
    clearError();
  };

  return (
    <AuthShell
      title="Crea tu cuenta 17Suit"
      description="Regístrate una vez con Google o con tu correo y usa la misma cuenta en todas las apps de 17Suit."
      context={productContext}
    >
      <div className="mx-auto grid w-full max-w-form gap-sm">
        {!needsVerification ? (
          <>
            <button
              type="button"
              onClick={onGoogleSSO}
              disabled={!isLoaded || isGooglePending || isSubmitting}
              aria-busy={isGooglePending}
              className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-sm rounded-[var(--radius-control)] border border-line bg-surface px-md text-md font-bold leading-[1.3] text-text transition-[border-color,box-shadow] duration-200 hover:border-[color-mix(in_oklab,var(--color-text)_36%,transparent)] hover:shadow-panel disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line disabled:hover:shadow-none"
            >
              <GoogleMark />
              {isGooglePending ? 'Abriendo Google…' : 'Continuar con Google'}
            </button>

            <p className="m-0 flex items-center gap-sm text-sm leading-[18px] text-muted before:h-px before:flex-1 before:bg-line before:content-[''] after:h-px after:flex-1 after:bg-line after:content-['']">
              o con tu correo
            </p>
          </>
        ) : null}

        {!needsVerification ? (
          <form method="post" className="grid gap-sm" onSubmit={handleCreateAccount}>
            <AppInput
              type="email"
              name="email"
              value={email}
              onChangeText={setEmail}
              label="Correo electrónico"
              placeholder="tu@correo.com"
              autoComplete="email"
              spellCheck={false}
              required
              error={isInvalid('email')}
              aria-describedby={describedBy('email')}
            />
            <AppInput
              type="password"
              name="password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearMismatch();
              }}
              label="Contraseña"
              placeholder="Crea una contraseña"
              autoComplete="new-password"
              required
              error={isInvalid('password')}
              aria-describedby={describedBy('password', PASSWORD_HINT_ID)}
            />
            <p id={PASSWORD_HINT_ID} className="m-0 -mt-[4px] text-sm leading-[1.4] text-muted">
              Usa al menos 8 caracteres. Evita contraseñas que ya usas en otros sitios.
            </p>
            <AppInput
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearMismatch();
              }}
              onBlur={handleConfirmBlur}
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              required
              error={isInvalid('confirmPassword')}
              aria-describedby={describedBy('confirmPassword')}
            />
            {/* Mismatch shows right under its field; other errors stay at the form end.
                The line is reserved: an error appearing on blur would move the control
                being tapped and swallow that tap. */}
            <div className="-my-[4px] min-h-[18px]">
              {isInvalid('confirmPassword') ? (
                <AuthFormError id={ERROR_ID} message={error} />
              ) : null}
            </div>
            <AppButton type="submit" compact disabled={isSubmitting || isGooglePending}>
              {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
            </AppButton>
            <p className="m-0 text-sm leading-[18px] text-muted">
              {/* TODO(legal): switch to "Al crear tu cuenta aceptas…" once the terms are final. */}
              Consulta los{' '}
              <Link href="/terminos" className="font-bold text-text underline underline-offset-4">
                Términos
              </Link>{' '}
              y la{' '}
              <Link href="/privacidad" className="font-bold text-text underline underline-offset-4">
                Política de privacidad
              </Link>
              .
            </p>
            <div id="clerk-captcha" />
            {isInvalid('confirmPassword') ? null : <AuthFormError id={ERROR_ID} message={error} />}
          </form>
        ) : (
          <div className="grid gap-sm">
            <h2 className="m-0 font-arvo text-lg font-bold leading-[1.25] text-text">
              Revisa tu correo
            </h2>
            <p className="m-0 text-md leading-[1.5] text-muted">
              Te enviamos un código a {email.trim()}. Escríbelo aquí para activar tu cuenta.
            </p>
          </div>
        )}

        {needsVerification ? (
          <form method="post" className="grid gap-sm" onSubmit={handleVerifyEmail}>
            <AppInput
              type="text"
              name="code"
              value={code}
              onChangeText={setCode}
              label="Código de verificación"
              placeholder="123456"
              autoComplete="one-time-code"
              inputMode="numeric"
              spellCheck={false}
              required
              error={isInvalid('code')}
              aria-describedby={describedBy('code')}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? 'Verificando…' : 'Verificar correo'}
            </AppButton>
            <AuthFormError id={ERROR_ID} message={error} />
            <p
              aria-live="polite"
              className="m-0 min-h-0 text-sm leading-[18px] text-muted empty:hidden"
            >
              {resendNotice}
            </p>
            <div className="flex flex-wrap justify-between gap-x-md">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending || isSubmitting}
                className="inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 text-md font-bold text-text underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending ? 'Enviando código…' : 'Reenviar código'}
              </button>
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={isSubmitting}
                className="inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 text-md font-bold text-text underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cambiar correo
              </button>
            </div>
          </form>
        ) : null}

        <Link
          href={`/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`}
          className="inline-flex min-h-11 w-fit items-center font-bold text-text underline underline-offset-4"
        >
          Ya tengo cuenta
        </Link>
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
