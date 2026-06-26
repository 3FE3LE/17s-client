'use client';

import { useSignIn } from '@clerk/nextjs';
import { AppButton, AppInput, AppLinkAction } from '@17suit/ui';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AuthFormError } from '../../components/AuthFormError';
import { AuthShell } from '../../components/AuthShell';

function getClerkErrors(error: unknown): Array<{ code?: string; message?: string }> {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    return (error as { errors?: Array<{ code?: string; message?: string }> }).errors ?? [];
  }
  return [];
}

// Clerk rejects sign-in attempts when a session is already active
// (single-session). Treat that as "continue to the product".
function isAlreadySignedInError(error: unknown): boolean {
  return getClerkErrors(error).some(
    (e) =>
      e.code === 'session_exists' ||
      e.code === 'identifier_already_signed_in' ||
      (e.message ?? '').toLowerCase().includes('already signed in'),
  );
}

function getClerkErrorMessage(error: unknown): string {
  const errors = getClerkErrors(error) as Array<{
    code?: string;
    message?: string;
    longMessage?: string;
  }>;
  const first = errors[0];
  if (first?.longMessage) return first.longMessage;
  if (first?.message) return first.message;
  if (first?.code) return first.code;
  return 'No fue posible iniciar sesion.';
}

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

      setError('Tu sesion necesita un paso adicional para completarse.');
    } catch (err) {
      if (isAlreadySignedInError(err)) {
        router.replace(redirectTarget);
        return;
      }
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
        redirectUrl: `/sso-callback?redirect_url=${encodeURIComponent(redirectTarget)}`,
        redirectUrlComplete: redirectTarget,
      });
    } catch (err) {
      // Session already active: skip SSO and continue to the product home.
      if (isAlreadySignedInError(err)) {
        router.replace(redirectTarget);
        return;
      }
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
        <AppButton variant="neutral" onPress={onGoogleSSO} compact>
          Continuar con Google
        </AppButton>

        <form className="grid gap-sm" onSubmit={handlePasswordSignIn}>
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
          <AppInput
            type="password"
            name="password"
            value={password}
            onChangeText={setPassword}
            label="Contrasena"
            placeholder="Ingresa tu contrasena"
            autoComplete="current-password"
            required
            error={Boolean(error)}
          />
          <AppButton type="submit" compact disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </AppButton>
          <div id="clerk-captcha" />
          <AuthFormError message={error} />
        </form>

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
      </div>
    </AuthShell>
  );
}
