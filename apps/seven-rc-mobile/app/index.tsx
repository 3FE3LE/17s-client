import {
  useCurrentUserRoleQuery,
  getSevenReservationsClubRoleHomePath,
} from '@17suit/module-seven-reservations-club/client';
import { useAppTheme } from '@17suit/ui';
import { usePulseAnimation, useRouteRoleSplash } from '@17suit/ui-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Animated, Image, View } from 'react-native';
import logo from '../assets/icon-17suit.png';

export default function IndexScreen() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { role, isLoading, error } = useCurrentUserRoleQuery({
    userId: user?.id,
    enabled: Boolean(user?.id),
  });
  const { theme } = useAppTheme();
  const pulse = usePulseAnimation();
  const isNavigationReady = Boolean(rootNavigationState?.key);

  useRouteRoleSplash({
    router,
    isAuthLoaded: isLoaded,
    isSignedIn,
    isLoading,
    role,
    error,
    roleOnboardingPath: '/role',
    signedOutPath: '/sign-in',
    resolveHomePath: getSevenReservationsClubRoleHomePath,
    ready: isNavigationReady,
  });

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.04] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Image source={logo} style={{ width: 140, height: 140 }} />
      </Animated.View>
    </View>
  );
}
