import { Redirect, useRootNavigationState } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { AppFrame, GapView, AppButton } from '@17suit/ui';

export default function NotFound() {
  const rootNavigationState = useRootNavigationState();
  const { isLoaded, isSignedIn } = useAuth();

  if (rootNavigationState?.key && isLoaded) {
    const target = isSignedIn ? '/' : '/sign-in';
    console.log(`[nav] not-found -> ${target}`);
    return <Redirect href={target} />;
  }

  return (
    <AppFrame appName="Seven Reservations Club" subtitle="Ruta no encontrada.">
      <GapView gap="md">
        <AppButton variant="neutral" disabled>
          Preparando navegacion...
        </AppButton>
      </GapView>
    </AppFrame>
  );
}
