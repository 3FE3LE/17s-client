import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInValues } from '@17suit/core';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { AppButton, AppDivider, AppLinkAction, GapView } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { View } from 'react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormError, FormField } from '../../components/form-field';
import { Screen } from '../../components/screen';
import { authErrorText } from '../../lib/auth-errors';
import { humanizeClerkError } from '../../lib/error-messages';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const handlePasswordSignIn = handleSubmit(async (values) => {
    if (!isLoaded) return;
    setFormError(null);
    try {
      const result = await signIn.create({ identifier: values.email, password: values.password });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      setFormError('Tu cuenta requiere un paso adicional de verificación para iniciar sesión.');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos iniciar sesión. Inténtalo de nuevo.'));
    }
  });

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
      showLanguageSelect
      title="Seven Reservations Club"
      subtitle="Inicia sesión para reservar o administrar tus canchas."
    >
      <GapView gap="sm">
        <AppButton variant="neutral" onPress={handleGoogleSignIn}>
          Continuar con Google
        </AppButton>

        <AppDivider />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField
              label="Correo"
              kind="email"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="tu@correo.com"
              error={authErrorText(fieldState.error?.message)}
              returnKeyType="next"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <FormField
              label="Contraseña"
              kind="password"
              value={field.value}
              onChangeText={field.onChange}
              error={authErrorText(fieldState.error?.message)}
              returnKeyType="go"
              onSubmitEditing={() => {
                void handlePasswordSignIn();
              }}
            />
          )}
        />
        <FormError message={formError} />
        <AppButton onPress={handlePasswordSignIn} disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
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
