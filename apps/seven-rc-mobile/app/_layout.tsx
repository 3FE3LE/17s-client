import '@tamagui/native/setup-zeego';
import { ExpoAuthProvider, getExpoAuthRedirect } from '@17suit/core/auth/expo';
import {
  useCurrentUserRoleQuery,
  getSevenReservationsClubRoleHomePath,
} from '@17suit/module-seven-reservations-club/client';
import { AppProviders } from '@17suit/ui';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { SevenRcClientProviders } from '../components/seven-rc-client-providers';

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/forgot-password'];

function AuthRouteGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { role, isLoading: isRoleLoading } = useCurrentUserRoleQuery();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const target = getExpoAuthRedirect({
      isLoaded,
      isSignedIn,
      pathname,
      publicPaths: PUBLIC_PATHS,
      signedInPath: '/',
      signedOutPath: '/sign-in',
    });
    if (target && target !== pathname) {
      router.replace(target);
      return;
    }

    if (!isLoaded || !isSignedIn) {
      return;
    }

    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    if (isPublicPath) {
      router.replace('/');
      return;
    }

    if (isRoleLoading) {
      return;
    }

    if (!role) {
      if (pathname !== '/onboarding/role') {
        router.replace('/onboarding/role');
      }
      return;
    }

    const roleHome = getSevenReservationsClubRoleHomePath(role);
    if (pathname === '/' || pathname === '/onboarding/role') {
      router.replace(roleHome);
      return;
    }

    if (pathname === '/owner' && role !== 'OWNER') {
      router.replace(roleHome);
      return;
    }

    if (pathname === '/play' && role !== 'PLAYER') {
      router.replace(roleHome);
    }
  }, [isLoaded, isSignedIn, pathname, router, role, isRoleLoading]);

  if (!isLoaded) return null;
  return <Slot />;
}

export default function Layout() {
  return (
    <ExpoAuthProvider>
      <SevenRcClientProviders>
        <AppProviders>
          <AuthRouteGuard />
        </AppProviders>
      </SevenRcClientProviders>
    </ExpoAuthProvider>
  );
}
