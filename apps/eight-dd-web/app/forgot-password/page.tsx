'use client';

import { useSignIn } from '@clerk/nextjs';
import { AppButton, AppFrame, AppInput, AppLinkAction, suitTheme } from '@17suit/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

export default function ForgotPasswordPage() {
  const bodyType = suitTheme.typography.styles.body;
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendResetCode = async () => {
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

  const resetPassword = async () => {
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
        router.replace('/');
        return;
      }

      setError('No se pudo completar el restablecimiento de contrasena.');
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppFrame appName="Eight Dream Dishes" subtitle="Recupera tu contrasena con codigo por email.">
      <div
        style={{
          width: '100%',
          maxWidth: suitTheme.sizes.layout.form,
          display: 'grid',
          gap: suitTheme.spacing.md,
        }}
      >
        {step === 'request' ? (
          <div style={{ display: 'grid', gap: suitTheme.spacing.sm }}>
            <AppInput
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              autoComplete="email"
              required
              error={Boolean(error)}
            />
            <AppButton onPress={sendResetCode}>
              {isSubmitting ? 'Enviando...' : 'Enviar codigo'}
            </AppButton>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: suitTheme.spacing.sm }}>
            <AppInput
              type="text"
              value={code}
              onChangeText={setCode}
              placeholder="Codigo de verificacion"
              autoComplete="one-time-code"
              required
              compact
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva password"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Confirmar nueva password"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppButton onPress={resetPassword}>
              {isSubmitting ? 'Actualizando...' : 'Actualizar password'}
            </AppButton>
          </div>
        )}

        <AppLinkAction onPress={() => router.push('/sign-in')}>
          Volver a iniciar sesion
        </AppLinkAction>

        {error ? (
          <p
            style={{
              margin: 0,
              color: suitTheme.colors.destructive,
              fontFamily: bodyType.webFamily,
              fontSize: bodyType.fontSize,
              lineHeight: `${bodyType.lineHeightRecommended}`,
              fontWeight: bodyType.fontWeight,
              letterSpacing: bodyType.letterSpacingEm,
            }}
          >
            {error}
          </p>
        ) : null}
      </div>
    </AppFrame>
  );
}
