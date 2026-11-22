import { Redirect, useRootNavigationState } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { AppFrame, AppSpinner } from '@17suit/ui-native';
import { View } from 'react-native';

export default function NotFound() {
  const rootNavigationState = useRootNavigationState();
  const { isLoaded, isSignedIn } = useAuth();

  if (rootNavigationState?.key && isLoaded) {
    const target = isSignedIn ? '/' : '/sign-in';
    return <Redirect href={target} />;
  }

  return (
    <AppFrame appName="Seven Reservations Club" subtitle="Ruta no encontrada.">
      <View accessible accessibilityRole="progressbar" accessibilityLabel="Preparando navegación">
        <AppSpinner size="large" />
      </View>
    </AppFrame>
  );
}
