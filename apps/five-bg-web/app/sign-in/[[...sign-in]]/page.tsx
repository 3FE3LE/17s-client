'use client';

import { useSignIn } from '@clerk/nextjs';
import { AppButton, AppDivider, AppFrame, AppInput, AppLinkAction, suitTheme } from '@17suit/ui';
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
  return 'No fue posible iniciar sesion.';
}

export default function SignInPage() {
  const bodyType = suitTheme.typography.styles.body;
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordSignIn = async () => {
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
        router.replace('/');
        return;
      }

      setError('Tu sesion requiere un paso adicional para completarse.');
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onGoogleSSO = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err) {
      setError(getClerkErrorMessage(err));
    }
  };

  const onSignUp = () => {
    router.push('/sign-up');
  };

  const onForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <AppFrame
      appName="Five Barber Go"
      subtitle="Inicia sesion con email y password o continua con Google."
    >
      <div
        style={{
          width: '100%',
          maxWidth: suitTheme.sizes.layout.form,
          display: 'grid',
          gap: suitTheme.spacing.md,
        }}
      >
        <AppButton variant="neutral" onPress={onGoogleSSO}>
          Continuar con Google
        </AppButton>

        <AppDivider />

        <div style={{ display: 'grid', gap: suitTheme.spacing.sm }}>
          <AppInput
            type="email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
          <AppInput
            type="password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <AppButton onPress={handlePasswordSignIn}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </AppButton>
        </div>
        <div style={{ display: 'flex', gap: suitTheme.spacing.md, flexWrap: 'wrap' }}>
          <AppLinkAction onPress={onSignUp}>No tengo cuenta</AppLinkAction>
          <AppLinkAction onPress={onForgotPassword}>Olvide mi contrasena</AppLinkAction>
        </div>

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
