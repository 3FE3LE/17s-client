import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { AppButton, AppDivider, AppFrame, AppInput, AppLinkAction, GapView } from '@17suit/ui';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

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
  return 'No fue posible iniciar sesion con email y password.';
}

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordSignIn = async () => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        return;
      }

      Alert.alert('Sign in', 'Tu sesion requiere un paso adicional.');
    } catch (err) {
      Alert.alert('Sign in error', getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch {
      Alert.alert('Sign in error', 'No fue posible iniciar sesion con Google.');
    }
  };

  return (
    <AppFrame
      appName="Five Barber Go"
      subtitle="Inicia sesion con email y password o continua con Google."
    >
      <GapView gap="sm">
        <AppButton variant="neutral" onPress={handleGoogleSignIn}>
          Continuar con Google
        </AppButton>

        <AppDivider />

        <AppInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@company.com"
        />
        <AppInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
        />
        <AppButton onPress={handlePasswordSignIn}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </AppButton>
        <GapView gap="md" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <AppLinkAction onPress={() => router.push('/sign-up')}>No tengo cuenta</AppLinkAction>
          <AppLinkAction onPress={() => router.push('/forgot-password')}>
            Olvide mi contrasena
          </AppLinkAction>
        </GapView>
      </GapView>
    </AppFrame>
  );
}
