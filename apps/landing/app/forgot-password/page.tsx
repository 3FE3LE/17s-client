'use client';

import { useSignIn } from '@clerk/nextjs';
import { AppButton, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, type FormEvent } from 'react';
import { AuthFormError } from '../components/AuthFormError';
import { AuthShell } from '../components/AuthShell';
import { resolveRedirectTarget } from '../lib/auth-redirect';
import { getClerkErrorMessage } from '../lib/clerk-errors';

const GENERIC_ERROR = 'No pudimos restablecer tu contraseña. Inténtalo de nuevo en unos minutos.';

function ForgotPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(() => {
    return resolveRedirectTarget(searchParams.get('redirect_url'));
  }, [searchParams]);

  const sendResetCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setStep('reset');
    } catch (err) {
      setError(getClerkErrorMessage(err, GENERIC_ERROR));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;
    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(redirectTarget);
        return;
      }

      setError('No pudimos restablecer tu contraseña. Solicita un código nuevo.');
    } catch (err) {
      setError(getClerkErrorMessage(err, GENERIC_ERROR));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Recupera el acceso"
      description="Te enviamos un código a tu correo para que elijas una contraseña nueva."
    >
      <div className="mx-auto grid w-full max-w-form gap-sm">
        {step === 'request' ? (
          <form className="grid gap-sm" onSubmit={sendResetCode}>
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
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? 'Enviando…' : 'Enviar código'}
            </AppButton>
            <div id="clerk-captcha" />
            <AuthFormError message={error} />
          </form>
        ) : (
          <form className="grid gap-sm" onSubmit={resetPassword}>
            <AppInput
              type="text"
              name="code"
              value={code}
              onChangeText={setCode}
              label="Código de verificación"
              placeholder="123456"
              autoComplete="one-time-code"
              spellCheck={false}
              required
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              name="newPassword"
              value={newPassword}
              onChangeText={setNewPassword}
              label="Nueva contraseña"
              placeholder="Nueva contraseña"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              label="Confirmar nueva contraseña"
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? 'Actualizando…' : 'Actualizar contraseña'}
            </AppButton>
            <AuthFormError message={error} />
          </form>
        )}

        <Link
          href={`/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`}
          className="inline-flex min-h-11 w-fit items-center font-bold text-text underline underline-offset-4"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
