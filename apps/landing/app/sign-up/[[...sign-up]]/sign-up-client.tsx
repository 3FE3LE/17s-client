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

const GENERIC_ERROR = 'No pudimos crear tu cuenta. Inténtalo de nuevo en unos minutos.';
const ERROR_ID = 'sign-up-error';
const PASSWORD_HINT_ID = 'sign-up-password-hint';

type SignUpErrorField = AuthErrorField | 'confirmPassword';

export function SignUpClient({ redirectTarget }: { redirectTarget: string }) {
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

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
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
        router.replace(redirectTarget);
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
        router.replace(redirectTarget);
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
        router.replace(redirectTarget);
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
      description="Regístrate una vez con tu correo y usa la misma cuenta en todas las apps de 17Suit."
    >
      <div className="mx-auto grid w-full max-w-form gap-sm">
        {!needsVerification ? (
          <form className="grid gap-sm" onSubmit={handleCreateAccount}>
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
              error={isInvalid('email')}
              aria-describedby={describedBy('email')}
            />
            <AppInput
              type="password"
              name="password"
              value={password}
              onChangeText={setPassword}
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
              onChangeText={setConfirmPassword}
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              required
              error={isInvalid('confirmPassword')}
              aria-describedby={describedBy('confirmPassword')}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
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
            <AuthFormError id={ERROR_ID} message={error} />
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
          <form className="grid gap-sm" onSubmit={handleVerifyEmail}>
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
          Ya tengo una cuenta
        </Link>
      </div>
    </AuthShell>
  );
}
