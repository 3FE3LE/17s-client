import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { AppFrame } from '@17suit/ui';

export default function OAuthNativeCallback() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!rootNavigationState?.key || !isLoaded) {
      return;
    }

    if (isSignedIn) {
      console.log('[nav] oauth-callback -> /');
      router.replace('/');
      return;
    }

    console.log('[nav] oauth-callback -> /sign-in');
    router.replace('/sign-in');
  }, [isLoaded, isSignedIn, rootNavigationState?.key, router]);

  return <AppFrame appName="Seven Reservations Club" subtitle="Procesando autenticacion..." />;
}
