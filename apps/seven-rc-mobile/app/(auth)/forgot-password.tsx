import { zodResolver } from '@hookform/resolvers/zod';
import {
  emailOnlySchema,
  resetPasswordSchema,
  type EmailOnlyValues,
  type ResetPasswordValues,
} from '@17suit/core';
import { useSignIn } from '@clerk/clerk-expo';
import { AppButton, AppLinkAction, GapView } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormError, FormField } from '../../components/form-field';
import { Screen } from '../../components/screen';
import { authErrorText } from '../../lib/auth-errors';
import { humanizeClerkError } from '../../lib/error-messages';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [sentTo, setSentTo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const requestForm = useForm<EmailOnlyValues>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: '' },
  });
  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: '', password: '', confirmPassword: '' },
  });

  const sendResetCode = requestForm.handleSubmit(async (values) => {
    if (!isLoaded) return;
    setFormError(null);
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: values.email });
      setSentTo(values.email);
      setStep('reset');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos enviar el código. Inténtalo de nuevo.'));
    }
  });

  const resetPassword = resetForm.handleSubmit(async (values) => {
    if (!isLoaded) return;
    setFormError(null);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: values.code,
        password: values.password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      setFormError('No pudimos completar el cambio de contraseña. Inténtalo de nuevo.');
    } catch (err) {
      setFormError(
        humanizeClerkError(err, 'No pudimos cambiar la contraseña. Inténtalo de nuevo.'),
      );
    }
  });

  return (
    <Screen
      back={false}
      title="Recuperar contraseña"
      subtitle={
        step === 'request'
          ? 'Te enviaremos un código a tu correo.'
          : `Escribe el código que enviamos a ${sentTo} y tu nueva contraseña.`
      }
    >
      <GapView gap="sm">
        {step === 'request' ? (
          <>
            <Controller
              control={requestForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormField
                  label="Correo"
                  kind="email"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="tu@correo.com"
                  returnKeyType="send"
                  onSubmitEditing={() => {
                    void sendResetCode();
                  }}
                  error={authErrorText(fieldState.error?.message)}
                />
              )}
            />
            <FormError message={formError} />
            <AppButton onPress={sendResetCode} disabled={requestForm.formState.isSubmitting}>
              {requestForm.formState.isSubmitting ? 'Enviando…' : 'Enviar código'}
            </AppButton>
          </>
        ) : (
          <>
            <Controller
              control={resetForm.control}
              name="code"
              render={({ field, fieldState }) => (
                <FormField
                  label="Código de verificación"
                  kind="code"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={authErrorText(fieldState.error?.message)}
                />
              )}
            />
            <Controller
              control={resetForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormField
                  label="Nueva contraseña"
                  kind="new-password"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Mínimo 8 caracteres"
                  error={authErrorText(fieldState.error?.message)}
                />
              )}
            />
            <Controller
              control={resetForm.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormField
                  label="Repetir nueva contraseña"
                  kind="new-password"
                  value={field.value}
                  onChangeText={field.onChange}
                  returnKeyType="go"
                  onSubmitEditing={() => {
                    void resetPassword();
                  }}
                  error={authErrorText(fieldState.error?.message)}
                />
              )}
            />
            <FormError message={formError} />
            <AppButton onPress={resetPassword} disabled={resetForm.formState.isSubmitting}>
              {resetForm.formState.isSubmitting ? 'Actualizando…' : 'Cambiar contraseña'}
            </AppButton>
          </>
        )}

        <AppLinkAction onPress={() => router.back()}>Volver a iniciar sesión</AppLinkAction>
      </GapView>
    </Screen>
  );
}
