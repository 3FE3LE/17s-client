/* eslint-disable no-restricted-syntax -- TODO(useEffect): migrate to RSC / event handlers / derived state per audit policy. */
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
      router.replace('/');
      return;
    }

    router.replace('/sign-in');
  }, [isLoaded, isSignedIn, rootNavigationState?.key, router]);

  return <AppFrame appName="Seven Reservations Club" subtitle="Procesando autenticacion..." />;
}
