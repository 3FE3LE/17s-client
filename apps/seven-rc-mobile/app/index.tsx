/* eslint-disable no-restricted-syntax -- TODO(useEffect): migrate to RSC / event handlers / derived state per audit policy. */
import { useEffect, useRef } from 'react';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { useAppTheme } from '@17suit/ui';
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
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!rootNavigationState?.key || !isLoaded) {
      return;
    }

    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    if (error) {
      router.replace('/role');
      return;
    }

    if (isLoading) {
      return;
    }

    if (!role) {
      router.replace('/role');
      return;
    }

    router.replace('/home');
  }, [error, isLoading, isLoaded, isSignedIn, role, router, rootNavigationState?.key]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

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
