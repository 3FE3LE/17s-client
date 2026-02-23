import { ExpoAuthProvider, getExpoAuthRedirect } from '@17suit/core/auth/expo';
import { AppProviders } from '@17suit/ui';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';

function AuthRouteGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const target = getExpoAuthRedirect({
      isLoaded,
      isSignedIn,
      pathname,
      publicPaths: ['/sign-in', '/sign-up', '/forgot-password'],
      signedInPath: '/',
      signedOutPath: '/sign-in',
    });
    if (target && target !== pathname) {
      router.replace(target);
    }
  }, [isLoaded, isSignedIn, pathname, router]);

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
