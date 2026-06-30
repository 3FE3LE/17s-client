import { ExpoAuthProvider } from '@17suit/core/auth/expo';
import { AppProviders } from '@17suit/ui';
import { useExpoAuthRedirect } from '@17suit/ui-native';
import { Slot } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

function AuthRouteGuard() {
  const { isLoaded } = useAuth();
  useExpoAuthRedirect({
    publicPaths: ['/sign-in', '/sign-up', '/forgot-password'],
    signedInPath: '/',
    signedOutPath: '/sign-in',
  });

  if (!isLoaded) return null;
  return <Slot />;
}

export default function Layout() {
  return (
    <ExpoAuthProvider>
      <AppProviders>
        <AuthRouteGuard />
      </AppProviders>
    </ExpoAuthProvider>
  );
}
