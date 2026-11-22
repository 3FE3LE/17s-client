import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { AppButton, AppDivider, AppLinkAction, GapView } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { View } from 'react-native';
import { useState } from 'react';
import { FormError, FormField } from '../../components/form-field';
import { Screen } from '../../components/screen';
import { humanizeClerkError } from '../../lib/error-messages';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const emailError = submitAttempted && email.trim().length === 0 ? 'Ingresa tu correo.' : null;
  const passwordError =
    submitAttempted && password.trim().length === 0 ? 'Ingresa tu contraseña.' : null;

  const handlePasswordSignIn = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    setFormError(null);
    if (email.trim().length === 0 || password.trim().length === 0) return;

    setIsSubmitting(true);
    try {
      const result = await signIn.create({ identifier: email.trim(), password });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      setFormError('Tu cuenta requiere un paso adicional de verificación para iniciar sesión.');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos iniciar sesión. Inténtalo de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow();
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch {
      setFormError('No pudimos iniciar sesión con Google. Inténtalo de nuevo.');
    }
  };

  return (
    <Screen
      back={false}
      title="Seven Reservations Club"
      subtitle="Inicia sesión para reservar o administrar tus canchas."
    >
      <GapView gap="sm">
        <AppButton variant="neutral" onPress={handleGoogleSignIn}>
          Continuar con Google
        </AppButton>

        <AppDivider />

        <FormField
          label="Correo"
          kind="email"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@correo.com"
          error={emailError}
          returnKeyType="next"
        />
        <FormField
          label="Contraseña"
          kind="password"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          returnKeyType="go"
          onSubmitEditing={() => {
            void handlePasswordSignIn();
          }}
        />
        <FormError message={formError} />
        <AppButton onPress={handlePasswordSignIn} disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </AppButton>
        <View className="mt-2 flex-row flex-wrap items-center gap-4">
          <AppLinkAction onPress={() => router.push('/sign-up')}>Crear cuenta</AppLinkAction>
          <AppLinkAction onPress={() => router.push('/forgot-password')}>
            Olvidé mi contraseña
          </AppLinkAction>
        </View>
      </GapView>
    </Screen>
  );
}
