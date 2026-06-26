'use client';

import { useSignIn } from '@clerk/nextjs';
import { AppButton, AppInput, AppLinkAction } from '@17suit/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, type FormEvent } from 'react';
import { AuthFormError } from '../components/AuthFormError';
import { AuthShell } from '../components/AuthShell';

function getClerkErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const errors = (
      error as { errors?: Array<{ code?: string; message?: string; longMessage?: string }> }
    ).errors;
    if (errors && errors.length > 0) {
      const first = errors[0];
      if (first?.longMessage) return first.longMessage;
      if (first?.message) return first.message;
      if (first?.code) return first.code;
    }
  }
  return 'No fue posible restablecer la contrasena.';
}

function resolveRedirectTarget(rawValue: string | null): string {
  if (!rawValue || rawValue.trim().length === 0) {
    return '/';
  }
  if (rawValue.startsWith('/') && !rawValue.startsWith('//')) {
    return rawValue;
  }
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL,
    process.env.NEXT_PUBLIC_SEVEN_RC_WEB_URL,
    process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS,
    typeof window === 'undefined' ? undefined : window.location.origin,
  ]
    .flatMap((entry) => entry?.split(',') ?? [])
    .map((entry) => entry.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  try {
    const url = new URL(rawValue);
    if (allowedOrigins.includes(url.origin)) {
      return url.toString();
    }
  } catch {
    return '/';
  }

  return '/';
}

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
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;
    if (newPassword !== confirmNewPassword) {
      setError('Las contrasenas no coinciden.');
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

      setError('No se pudo completar el restablecimiento.');
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      pageLabel="Restablecer contrasena"
      title="Recupera el acceso"
      description="Restablece tu contrasena y vuelve a entrar con el mismo flujo de autenticacion."
    >
      <div className="mx-auto grid w-full max-w-form gap-sm">
        {step === 'request' ? (
          <form className="grid gap-sm" onSubmit={sendResetCode}>
            <AppInput
              type="email"
              name="email"
              value={email}
              onChangeText={setEmail}
              label="Correo electronico"
              placeholder="tu@empresa.com"
              autoComplete="email"
              spellCheck={false}
              required
              error={Boolean(error)}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar codigo'}
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
              label="Codigo de verificacion"
              placeholder="Codigo de verificacion"
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
              label="Nueva contrasena"
              placeholder="Nueva contrasena"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              label="Confirmar nueva contrasena"
              placeholder="Confirmar nueva contrasena"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? 'Actualizando...' : 'Actualizar contrasena'}
            </AppButton>
            <AuthFormError message={error} />
          </form>
        )}

        <AppLinkAction
          onPress={() => router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`)}
        >
          Volver a iniciar sesion
        </AppLinkAction>
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
