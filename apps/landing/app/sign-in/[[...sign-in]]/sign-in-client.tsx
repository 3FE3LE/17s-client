'use client';

import { useAuth, useSignIn } from '@clerk/nextjs';
import { AppButton, AppInput, AppLinkAction, AppTypography, suitTheme } from '@17suit/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  return 'No fue posible iniciar sesion.';
}

export function SignInClient({ redirectTarget }: { redirectTarget: string }) {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already authenticated (e.g. returning user or Clerk "already signed in"):
  // skip the form and continue to the product that initiated the sign-in.
  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.replace(redirectTarget);
    }
  }, [authLoaded, isSignedIn, redirectTarget, router]);

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
        router.replace(redirectTarget);
        return;
      }

      setError('Tu sesion necesita un paso adicional para completarse.');
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
        redirectUrlComplete: redirectTarget,
      });
    } catch (err) {
      setError(getClerkErrorMessage(err));
    }
  };

  return (
    <AuthShell
      pageLabel="Iniciar sesion"
      title="Accede y continua en tu flujo"
      description="Entra con Google o con tu correo para abrir tus herramientas sin pasos extra."
    >
      <div className="mx-auto grid w-full max-w-form gap-sm">
        <AppButton
          variant="neutral"
          onPress={onGoogleSSO}
          compact
          fullWidth={false}
          style={{ justifySelf: 'start' }}
        >
          Continuar con Google
        </AppButton>

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
          />
          <AppInput
            type="password"
            value={password}
            onChangeText={setPassword}
            label=""
            placeholder="Contrasena"
            autoComplete="current-password"
            required
            compact
          />
          <AppButton onPress={handlePasswordSignIn} compact>
            {isSubmitting ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </AppButton>
          <div id="clerk-captcha" />
        </div>

        <div className="flex flex-wrap gap-sm">
          <AppLinkAction
            onPress={() =>
              router.push(`/sign-up?redirect_url=${encodeURIComponent(redirectTarget)}`)
            }
          >
            Crear cuenta
          </AppLinkAction>
          <AppLinkAction
            onPress={() =>
              router.push(`/forgot-password?redirect_url=${encodeURIComponent(redirectTarget)}`)
            }
          >
            Olvide mi contrasena
          </AppLinkAction>
        </div>

        {error ? (
          <AppTypography variant="body" color={suitTheme.colors.destructive} style={{ margin: 0 }}>
            {error}
          </AppTypography>
        ) : null}
      </div>
    </AuthShell>
  );
}
