import { zodResolver } from '@hookform/resolvers/zod';
import { verifyCodeSchema, type VerifyCodeValues } from '@17suit/core';
import { useSignUp } from '@clerk/clerk-expo';
import { AppButton, AppLinkAction, AppTypography, GapView } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { FormError, FormField } from '../../components/form-field';
import { Screen } from '../../components/screen';
import { authErrorText } from '../../lib/auth-errors';
import { humanizeClerkError } from '../../lib/error-messages';

export default function SignUpVerifyScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isResending, setIsResending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const { control, handleSubmit, formState } = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' },
  });
  const isSubmitting = formState.isSubmitting || isResending;

  const handleVerifyEmail = handleSubmit(async (values) => {
    if (!isLoaded) return;
    setFormError(null);
    setResent(false);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: values.code });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      setFormError('No pudimos completar la verificación. Inténtalo de nuevo.');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos verificar tu correo.'));
    }
  });

  const handleResendCode = async () => {
    if (!isLoaded) return;
    setFormError(null);
    setResent(false);
    setIsResending(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setResent(true);
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos reenviar el código.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Screen
      back={false}
      title="Verifica tu correo"
      subtitle="Escribe el código de verificación que te enviamos por correo."
    >
      <GapView gap="sm">
        <Controller
          control={control}
          name="code"
          render={({ field, fieldState }) => (
            <FormField
              label="Código de verificación"
              kind="code"
              value={field.value}
              onChangeText={field.onChange}
              returnKeyType="go"
              onSubmitEditing={() => {
                void handleVerifyEmail();
              }}
              error={authErrorText(fieldState.error?.message)}
            />
          )}
        />
        <FormError message={formError} />
        {resent ? (
          <View accessibilityLiveRegion="polite">
            <AppTypography variant="body">
              Código enviado. Revisa tu correo, también la carpeta de spam.
            </AppTypography>
          </View>
        ) : null}
        <AppButton onPress={handleVerifyEmail} disabled={isSubmitting}>
          {isSubmitting ? 'Verificando…' : 'Verificar correo'}
        </AppButton>
        <AppButton variant="neutral" onPress={handleResendCode} disabled={isSubmitting}>
          Reenviar código
        </AppButton>
        <AppLinkAction onPress={() => router.back()}>Cambiar correo</AppLinkAction>
      </GapView>
    </Screen>
  );
}
