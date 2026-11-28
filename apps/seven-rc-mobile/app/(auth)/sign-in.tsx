import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInValues } from '@17suit/core';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { useTranslation } from '@17suit/i18n/react';
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
  const { t } = useTranslation('mobile');
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

      setFormError(t('auth.signIn.needsVerification'));
    } catch (err) {
      setFormError(humanizeClerkError(err, t('auth.signIn.failed'), t));
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
      setFormError(t('auth.signIn.googleFailed'));
    }
  };

  return (
    <Screen
      back={false}
      showLanguageSelect
      title="Seven Reservations Club"
      subtitle={t('auth.signIn.subtitle')}
    >
      <GapView gap="sm">
        <AppButton variant="neutral" onPress={handleGoogleSignIn}>
          {t('auth.signIn.google')}
        </AppButton>

        <AppDivider />

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
              error={authErrorText(fieldState.error?.message, t)}
              returnKeyType="next"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <FormField
              label={t('auth.password')}
              kind="password"
              value={field.value}
              onChangeText={field.onChange}
              error={authErrorText(fieldState.error?.message, t)}
              returnKeyType="go"
              onSubmitEditing={() => {
                void handlePasswordSignIn();
              }}
            />
          )}
        />
        <FormError message={formError} />
        <AppButton onPress={handlePasswordSignIn} disabled={formState.isSubmitting}>
          {formState.isSubmitting ? t('auth.signIn.submitting') : t('auth.signIn.submit')}
        </AppButton>
        <View className="mt-2 flex-row flex-wrap items-center gap-4">
          <AppLinkAction onPress={() => router.push('/sign-up')}>
            {t('auth.createAccount')}
          </AppLinkAction>
          <AppLinkAction onPress={() => router.push('/forgot-password')}>
            {t('auth.signIn.forgot')}
          </AppLinkAction>
        </View>
      </GapView>
    </Screen>
  );
}
