import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpValues } from '@17suit/core';
import { useSignUp } from '@clerk/clerk-expo';
import { useTranslation } from '@17suit/i18n/react';
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
  const { t } = useTranslation('mobile');
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
      setFormError(humanizeClerkError(err, t('auth.signUp.failed'), t));
    }
  });

  return (
    <Screen back={false} title={t('auth.createAccount')} subtitle={t('auth.signUp.subtitle')}>
      <GapView gap="sm">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField
              label={t('auth.email')}
              kind="email"
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('auth.emailPlaceholder')}
              returnKeyType="next"
              error={authErrorText(fieldState.error?.message, t)}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <FormField
              label={t('auth.password')}
              kind="new-password"
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('auth.passwordHint')}
              returnKeyType="next"
              error={authErrorText(fieldState.error?.message, t)}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormField
              label={t('auth.repeatPassword')}
              kind="new-password"
              value={field.value}
              onChangeText={field.onChange}
              returnKeyType="go"
              onSubmitEditing={() => {
                void handleCreateAccount();
              }}
              error={authErrorText(fieldState.error?.message, t)}
            />
          )}
        />
        <FormError message={formError} />
        <AppButton onPress={handleCreateAccount} disabled={formState.isSubmitting}>
          {formState.isSubmitting ? t('auth.signUp.submitting') : t('auth.createAccount')}
        </AppButton>
        <AppLinkAction onPress={() => router.push('/sign-in')}>
          {t('auth.signUp.haveAccount')}
        </AppLinkAction>
      </GapView>
    </Screen>
  );
}
