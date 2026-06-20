'use client';

import { useSignUp } from '@clerk/nextjs';
import { AppButton, AppInput, AppLinkAction, AppTypography, suitTheme } from '@17suit/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthShell } from '../../components/AuthShell';

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
  return 'No fue posible crear la cuenta.';
}

export function SignUpClient({ redirectTarget }: { redirectTarget: string }) {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAccount = async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

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

      setError('No se pudo iniciar el registro. Intenta de nuevo.');
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(redirectTarget);
        return;
      }

      setError('No se pudo completar la verificacion.');
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      pageLabel="Registro"
      title="Crea tu cuenta en minutos"
      description="Completa tu registro una vez y usa la suite completa con la misma identidad."
    >
      <div className="mx-auto grid w-full max-w-form gap-sm">
        {!needsVerification ? (
          <div className="grid gap-sm">
            <AppInput
              type="email"
              value={email}
              onChangeText={setEmail}
              label=""
              placeholder="tu@empresa.com"
              autoComplete="email"
              required
              compact
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              value={password}
              onChangeText={setPassword}
              label=""
              placeholder="Contrasena"
              autoComplete="new-password"
              required
              compact
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              label=""
              placeholder="Confirmar contrasena"
              autoComplete="new-password"
              required
              compact
              error={Boolean(error)}
            />
            <AppButton onPress={handleCreateAccount} compact>
              {isSubmitting ? 'Creando...' : 'Crear cuenta'}
            </AppButton>
            <div id="clerk-captcha" />
          </div>
        ) : (
          <div className="grid gap-sm">
            <AppTypography variant="overline" color={suitTheme.colors.muted}>
              Verificacion de correo
            </AppTypography>
            <AppTypography variant="body" color={suitTheme.colors.muted}>
              Ingresa el codigo que recibiste para activar tu cuenta.
            </AppTypography>
          </div>
        )}

        {needsVerification ? (
          <div className="grid gap-sm">
            <AppInput
              type="text"
              value={code}
              onChangeText={setCode}
              label=""
              placeholder="Codigo de verificacion"
              autoComplete="one-time-code"
              required
              compact
              error={Boolean(error)}
            />
            <AppButton onPress={handleVerifyEmail} compact>
              {isSubmitting ? 'Verificando...' : 'Verificar correo'}
            </AppButton>
          </div>
        ) : null}

        <AppLinkAction
          onPress={() => router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`)}
        >
          Ya tengo una cuenta
        </AppLinkAction>

        {error ? (
          <AppTypography variant="body" color={suitTheme.colors.destructive} style={{ margin: 0 }}>
            {error}
          </AppTypography>
        ) : null}
      </div>
    </AuthShell>
  );
}
