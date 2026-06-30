import { BackHandler, View, useWindowDimensions } from 'react-native';
import type { PropsWithChildren } from 'react';
import { useCallback, useMemo } from 'react';
import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AppFrame } from '@17suit/ui';
import { useSwipeTransition } from '@17suit/ui-native';
import { AuthBottomNav } from './auth-bottom-nav';
import {
  consumeLastSwipeDirection,
  setExitAnimator,
  setLastSwipeDirection,
} from './tab-transition';

type UserRole = 'OWNER' | 'PLAYER' | null | undefined;

interface AuthTabScreenProps extends PropsWithChildren {
  appName: string;
  subtitle?: string;
  role?: UserRole;
  swipeRoutes?: {
    left?: string;
    right?: string;
  };
  onRefresh?: () => void;
  refreshing?: boolean;
}

const SWIPE_DISTANCE_RATIO = 0.25;
const SWIPE_VELOCITY = 800;

export function AuthTabScreen({
  appName,
  subtitle,
  role,
  swipeRoutes,
  onRefresh,
  refreshing,
  children,
}: AuthTabScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const canSwipe = Boolean(swipeRoutes?.left || swipeRoutes?.right);
  const swipeDistance = width * SWIPE_DISTANCE_RATIO;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const { runExit } = useSwipeTransition({
    translateX,
    consumeLastDirection: consumeLastSwipeDirection,
    setExitAnimator,
    replace: (href) => {
      router.replace(href);
    },
  });

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(canSwipe)
        .activeOffsetX([-10, 10])
        .failOffsetY([-12, 12])
        .onUpdate((event) => {
          translateX.value = Math.max(-width, Math.min(width, event.translationX));
        })
        .onEnd((event) => {
          const goLeft =
            Boolean(swipeRoutes?.left) &&
            (event.translationX < -swipeDistance || event.velocityX < -SWIPE_VELOCITY);
          const goRight =
            Boolean(swipeRoutes?.right) &&
            (event.translationX > swipeDistance || event.velocityX > SWIPE_VELOCITY);

          if (goLeft && swipeRoutes?.left) {
            runOnJS(setLastSwipeDirection)('left');
            runOnJS(runExit)('left', swipeRoutes.left);
            return;
          }

          if (goRight && swipeRoutes?.right) {
            runOnJS(setLastSwipeDirection)('right');
            runOnJS(runExit)('right', swipeRoutes.right);
            return;
          }

          translateX.value = withSpring(0, {
            damping: 18,
            stiffness: 180,
            mass: 0.4,
          });
        }),
    [canSwipe, runExit, router, swipeRoutes, swipeDistance, translateX, width],
  );

  useFocusEffect(
    useCallback(() => {
      if (isLoaded && !isSignedIn) {
        router.replace('/sign-in');
        return () => {};
      }

      const onBackPress = () => {
        if (pathname === '/home') {
          return false;
        }
        if (typeof router.canGoBack === 'function' && !router.canGoBack()) {
          return false;
        }
        router.back();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [isLoaded, isSignedIn, pathname, router]),
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <AppFrame
              appName={appName}
              {...(subtitle ? { subtitle } : {})}
              {...(pathname !== '/home' && pathname !== '/profile'
                ? { onBack: () => router.back() }
                : {})}
              {...(onRefresh ? { onRefresh, refreshing } : {})}
            >
              {children}
            </AppFrame>
          </Animated.View>
        </GestureDetector>
      </View>
      <AuthBottomNav role={role} />
    </View>
  );
}
