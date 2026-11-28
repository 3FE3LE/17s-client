import { zodResolver } from '@hookform/resolvers/zod';
import {
  emailOnlySchema,
  resetPasswordSchema,
  type EmailOnlyValues,
  type ResetPasswordValues,
} from '@17suit/core';
import { useSignIn } from '@clerk/clerk-expo';
import { useTranslation } from '@17suit/i18n/react';
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
  const { t } = useTranslation('mobile');
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
      setFormError(humanizeClerkError(err, t('auth.forgot.sendFailed'), t));
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

      setFormError(t('auth.forgot.incomplete'));
    } catch (err) {
      setFormError(humanizeClerkError(err, t('auth.forgot.resetFailed'), t));
    }
  });

  return (
    <Screen
      back={false}
      title={t('auth.forgot.title')}
      subtitle={
        step === 'request'
          ? t('auth.forgot.subtitleRequest')
          : t('auth.forgot.subtitleReset', { email: sentTo })
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
                  label={t('auth.email')}
                  kind="email"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('auth.emailPlaceholder')}
                  returnKeyType="send"
                  onSubmitEditing={() => {
                    void sendResetCode();
                  }}
                  error={authErrorText(fieldState.error?.message, t)}
                />
              )}
            />
            <FormError message={formError} />
            <AppButton onPress={sendResetCode} disabled={requestForm.formState.isSubmitting}>
              {requestForm.formState.isSubmitting
                ? t('auth.forgot.sending')
                : t('auth.forgot.send')}
            </AppButton>
          </>
        ) : (
          <>
            <Controller
              control={resetForm.control}
              name="code"
              render={({ field, fieldState }) => (
                <FormField
                  label={t('auth.verificationCode')}
                  kind="code"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={authErrorText(fieldState.error?.message, t)}
                />
              )}
            />
            <Controller
              control={resetForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormField
                  label={t('auth.newPassword')}
                  kind="new-password"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('auth.passwordHint')}
                  error={authErrorText(fieldState.error?.message, t)}
                />
              )}
            />
            <Controller
              control={resetForm.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormField
                  label={t('auth.repeatNewPassword')}
                  kind="new-password"
                  value={field.value}
                  onChangeText={field.onChange}
                  returnKeyType="go"
                  onSubmitEditing={() => {
                    void resetPassword();
                  }}
                  error={authErrorText(fieldState.error?.message, t)}
                />
              )}
            />
            <FormError message={formError} />
            <AppButton onPress={resetPassword} disabled={resetForm.formState.isSubmitting}>
              {resetForm.formState.isSubmitting
                ? t('auth.forgot.updating')
                : t('auth.forgot.submit')}
            </AppButton>
          </>
        )}

        <AppLinkAction onPress={() => router.back()}>{t('auth.forgot.backToSignIn')}</AppLinkAction>
      </GapView>
    </Screen>
  );
}
