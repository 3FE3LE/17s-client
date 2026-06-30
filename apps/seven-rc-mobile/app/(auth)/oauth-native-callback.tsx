import { useRootNavigationState } from 'expo-router';
import { AppFrame } from '@17suit/ui';
import { useReplaceOnceReady } from '@17suit/ui-native';

export default function OAuthNativeCallback() {
  const rootNavigationState = useRootNavigationState();
  const isNavigationReady = Boolean(rootNavigationState?.key);

  // After an OAuth native callback, hand off to the role gate (index.tsx)
  // which routes to /role or /home depending on the current role. We just
  // need the root navigation tree to be mounted first, otherwise the
  // `router.replace` call throws.
  useReplaceOnceReady({ ready: isNavigationReady, href: '/' });

  return <AppFrame appName="Seven Reservations Club" subtitle="Procesando autenticacion..." />;
}
