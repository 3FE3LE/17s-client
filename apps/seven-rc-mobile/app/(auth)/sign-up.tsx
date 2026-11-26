import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpValues } from '@17suit/core';
import { useSignUp } from '@clerk/clerk-expo';
import { AppButton, AppLinkAction, GapView } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormError, FormField } from '../../components/form-field';
import { Screen } from '../../components/screen';
import { authErrorText } from '../../lib/auth-errors';
import { humanizeClerkError } from '../../lib/error-messages';

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const handleCreateAccount = handleSubmit(async (values) => {
    if (!isLoaded) return;
    setFormError(null);
    try {
      const result = await signUp.create({ emailAddress: values.email, password: values.password });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push('/sign-up-verify');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos crear la cuenta. Inténtalo de nuevo.'));
    }
  });

  return (
    <Screen
      back={false}
      title="Crear cuenta"
      subtitle="Te enviaremos un código para verificar tu correo."
    >
      <GapView gap="sm">
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
              returnKeyType="next"
              error={authErrorText(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <FormField
              label="Contraseña"
              kind="new-password"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Mínimo 8 caracteres"
              returnKeyType="next"
              error={authErrorText(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormField
              label="Repetir contraseña"
              kind="new-password"
              value={field.value}
              onChangeText={field.onChange}
              returnKeyType="go"
              onSubmitEditing={() => {
                void handleCreateAccount();
              }}
              error={authErrorText(fieldState.error?.message)}
            />
          )}
        />
        <FormError message={formError} />
        <AppButton onPress={handleCreateAccount} disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </AppButton>
        <AppLinkAction onPress={() => router.push('/sign-in')}>Ya tengo una cuenta</AppLinkAction>
      </GapView>
    </Screen>
  );
}
