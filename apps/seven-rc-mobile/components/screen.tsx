import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useCanGoBack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppFrame, useAppTheme } from '@17suit/ui-native';

interface ScreenProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  /** Show the 44pt back chevron when the stack can go back. Tab roots pass `false`. */
  back?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  /**
   * Pinned below the scroll area, inside the bottom safe area. Use it for the
   * screen's primary action; it rises above the keyboard with the content.
   */
  footer?: ReactNode;
  /** Show the language picker below the content (sign-in and home screens). */
  showLanguageSelect?: boolean;
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
  showLanguageSelect = false,
  children,
}: ScreenProps) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  // iOS scroll-only screens use the scroll view's own keyboard inset. A pinned
  // footer needs the whole screen resized, and so does Android, whose
  // edge-to-edge window no longer resizes for the keyboard.
  const resizeForKeyboard = Boolean(footer) || Platform.OS === 'android';

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={resizeForKeyboard}
      // The view measures itself below the app's top safe area. With a footer,
      // let the keyboard cover the footer's home-indicator padding.
      keyboardVerticalOffset={insets.top - (footer ? insets.bottom : 0)}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <AppFrame
        appName={title}
        automaticallyAdjustKeyboardInsets={!resizeForKeyboard}
        showLanguageSelect={showLanguageSelect}
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
    </KeyboardAvoidingView>
  );
}
