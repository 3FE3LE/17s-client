import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { AppButton, AppDivider, AppFrame, AppInput, AppLinkAction, GapView } from '@17suit/ui';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Text, View } from 'react-native';
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
  return 'No fue posible iniciar sesion.';
}

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handlePasswordSignIn = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      Alert.alert('Iniciar sesion', 'Tu sesion requiere un paso adicional para completarse.');
    } catch (err) {
      Alert.alert('Error de inicio de sesion', getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch {
      Alert.alert('Error de inicio de sesion', 'No fue posible iniciar sesion con Google.');
    }
  };

  return (
    <AppFrame
      appName="Seven Reservations Club"
      subtitle="Inicia sesion con correo y contrasena o continua con Google."
    >
      <GapView gap="sm">
        <View className="mb-2 rounded-md border border-brand-primary bg-brand-light px-3 py-2">
          <Text className="font-amaranth text-xs tracking-plus0_4 text-brand-dark">
            Tailwind/NativeWind activo en esta pantalla
          </Text>
        </View>
        <AppButton variant="neutral" onPress={handleGoogleSignIn}>
          Continuar con Google
        </AppButton>

        <AppDivider />

        <AppInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="tu@empresa.com"
        />
        {submitAttempted && email.trim().length === 0 ? (
          <Text className="text-xs text-destructive">Ingresa tu correo.</Text>
        ) : null}
        <AppInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contrasena"
        />
        {submitAttempted && password.trim().length === 0 ? (
          <Text className="text-xs text-destructive">Ingresa tu contrasena.</Text>
        ) : null}
        <AppButton onPress={handlePasswordSignIn} disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Iniciando sesion...' : 'Iniciar sesion'}
        </AppButton>
        <View className="mt-2 flex-row flex-wrap items-center gap-4">
          <AppLinkAction onPress={() => router.push('/sign-up')}>Crear cuenta</AppLinkAction>
          <AppLinkAction onPress={() => router.push('/forgot-password')}>
            Olvide mi contrasena
          </AppLinkAction>
        </View>
      </GapView>
    </AppFrame>
  );
}
