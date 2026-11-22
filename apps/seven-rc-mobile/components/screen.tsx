import type { PropsWithChildren, ReactNode } from 'react';
import { View } from 'react-native';
import { useCanGoBack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppFrame, useAppTheme } from '@17suit/ui';

interface ScreenProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  /** Show the 44pt back chevron when the stack can go back. Tab roots pass `false`. */
  back?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  /**
   * Pinned below the scroll area, inside the bottom safe area. Use it for the
   * screen's primary action so it stays reachable with the keyboard closed.
   */
  footer?: ReactNode;
}

/**
 * App screen chrome. Navigation (push, swipe-back, Android Back) is owned by
 * the expo-router Stack / Tabs layouts; this only lays out title + content.
 */
export function Screen({
  title,
  subtitle,
  back = true,
  onRefresh,
  refreshing,
  footer,
  children,
}: ScreenProps) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppFrame
        appName={title}
        {...(subtitle ? { subtitle } : {})}
        {...(back && canGoBack ? { onBack: () => router.back() } : {})}
        {...(onRefresh ? { onRefresh, refreshing: Boolean(refreshing) } : {})}
      >
        {children}
      </AppFrame>
      {footer ? (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.grayscale[3],
            backgroundColor: theme.colors.background,
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.sm,
            paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xs,
            gap: theme.spacing.sm,
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
