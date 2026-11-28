import { zodResolver } from '@hookform/resolvers/zod';
import { verifyCodeSchema, type VerifyCodeValues } from '@17suit/core';
import { useSignUp } from '@clerk/clerk-expo';
import { useTranslation } from '@17suit/i18n/react';
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
  const { t } = useTranslation('mobile');
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

      setFormError(t('auth.verify.incomplete'));
    } catch (err) {
      setFormError(humanizeClerkError(err, t('auth.verify.failed'), t));
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
      setFormError(humanizeClerkError(err, t('auth.verify.resendFailed'), t));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Screen back={false} title={t('auth.verify.title')} subtitle={t('auth.verify.subtitle')}>
      <GapView gap="sm">
        <Controller
          control={control}
          name="code"
          render={({ field, fieldState }) => (
            <FormField
              label={t('auth.verificationCode')}
              kind="code"
              value={field.value}
              onChangeText={field.onChange}
              returnKeyType="go"
              onSubmitEditing={() => {
                void handleVerifyEmail();
              }}
              error={authErrorText(fieldState.error?.message, t)}
            />
          )}
        />
        <FormError message={formError} />
        {resent ? (
          <View accessibilityLiveRegion="polite">
            <AppTypography variant="body">{t('auth.verify.resent')}</AppTypography>
          </View>
        ) : null}
        <AppButton onPress={handleVerifyEmail} disabled={isSubmitting}>
          {isSubmitting ? t('auth.verify.submitting') : t('auth.verify.submit')}
        </AppButton>
        <AppButton variant="neutral" onPress={handleResendCode} disabled={isSubmitting}>
          {t('auth.verify.resend')}
        </AppButton>
        <AppLinkAction onPress={() => router.back()}>{t('auth.verify.changeEmail')}</AppLinkAction>
      </GapView>
    </Screen>
  );
}
