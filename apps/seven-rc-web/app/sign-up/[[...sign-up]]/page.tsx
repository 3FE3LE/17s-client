'use client';

import { useSignUp } from '@clerk/nextjs';
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
  return 'No fue posible crear la cuenta.';
}

export default function SignUpPage() {
  const bodyType = suitTheme.typography.styles.body;
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
        router.replace('/');
        return;
      }

      if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setNeedsVerification(true);
        return;
      }

      setError('No se pudo iniciar el proceso de registro. Intenta de nuevo.');
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
        router.replace('/');
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
    <AppFrame appName="Seven Reservations Club" subtitle="Crea tu cuenta con email y password.">
      <div
        style={{
          width: '100%',
          maxWidth: suitTheme.sizes.layout.form,
          display: 'grid',
          gap: suitTheme.spacing.md,
        }}
      >
        {!needsVerification ? (
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
            <AppInput
              type="password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar password"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppButton onPress={handleCreateAccount}>
              {isSubmitting ? 'Creando...' : 'Crear cuenta'}
            </AppButton>
            <div id="clerk-captcha" />
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
            <AppButton onPress={handleVerifyEmail}>
              {isSubmitting ? 'Verificando...' : 'Verificar email'}
            </AppButton>
          </div>
        )}

        <AppLinkAction onPress={() => router.push('/sign-in')}>Ya tengo cuenta</AppLinkAction>

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
