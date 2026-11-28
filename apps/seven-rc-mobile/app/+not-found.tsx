import { useTranslation } from '@17suit/i18n/react';
import { Redirect, useRootNavigationState } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { AppFrame, AppSpinner } from '@17suit/ui-native';
import { View } from 'react-native';

export default function NotFound() {
  const { t } = useTranslation('mobile');
  const rootNavigationState = useRootNavigationState();
  const { isLoaded, isSignedIn } = useAuth();

  if (rootNavigationState?.key && isLoaded) {
    const target = isSignedIn ? '/' : '/sign-in';
    return <Redirect href={target} />;
  }

  return (
    <AppFrame appName="Seven Reservations Club" subtitle={t('notFound.title')}>
      <View accessible accessibilityRole="progressbar" accessibilityLabel={t('notFound.preparing')}>
        <AppSpinner size="large" />
      </View>
    </AppFrame>
  );
}
