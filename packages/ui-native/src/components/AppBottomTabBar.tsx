import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/theme-context';

import { withGap } from '../utils/withGap';

type Tone = 'OWNER' | 'PLAYER' | null | undefined;
export type AppBottomTabIconName = 'home' | 'profile';

export interface AppBottomTabItem {
  key: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
  iconName?: AppBottomTabIconName;
  icon?: ReactNode;
}

export interface AppBottomTabBarProps {
  items: AppBottomTabItem[];
  tone?: Tone;
  showLabels?: boolean;
}

function getActiveColors(tone: Tone, theme: ReturnType<typeof useAppTheme>['theme']) {
  if (tone === 'OWNER') {
    return {
      backgroundColor: theme.colors.success,
      textColor: theme.colors.brandDark,
    };
  }

  return {
    backgroundColor: theme.colors.brandPrimary,
    textColor: theme.colors.brandDark,
  };
}

function resolveIconName(iconName: AppBottomTabIconName): 'home' | 'user' {
  return iconName === 'profile' ? 'user' : 'home';
}

function TabButton({
  item,
  showLabels,
  lineHeight,
  activeColors,
}: {
  item: AppBottomTabItem;
  showLabels: boolean;
  lineHeight: number;
  activeColors: { backgroundColor: string; textColor: string };
}) {
  const { theme } = useAppTheme();
  const buttonType = theme.typography.styles.button;
  const progress = useRef(new Animated.Value(item.isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: item.isActive ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [item.isActive, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surface, activeColors.backgroundColor],
  });
  const borderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.grayscale[3], activeColors.backgroundColor],
  });
  const borderWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const shadowOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.35],
  });
  const shadowRadius = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });
  const elevation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });
  const iconColor = item.isActive ? theme.colors.brandDark : theme.colors.muted;
  const textColor = item.isActive ? activeColors.textColor : theme.colors.muted;

  const iconNode =
    item.icon ??
    (item.iconName ? (
      <Feather name={resolveIconName(item.iconName)} size={20} color={iconColor} />
    ) : null);

  return (
    <Pressable onPress={item.onPress} style={{ flex: 1, minWidth: 0 }}>
      <Animated.View
        style={{
          backgroundColor,
          borderWidth,
          borderColor,
          borderRadius: theme.borderRadius.md,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: theme.sizes.control.md,
          paddingHorizontal: theme.spacing.sm,
          shadowColor: activeColors.backgroundColor,
          shadowOpacity,
          shadowRadius,
          shadowOffset: { width: 0, height: 4 },
          elevation,
        }}
      >
        <Animated.View
          style={{ alignItems: 'center', justifyContent: 'center', transform: [{ scale }] }}
        >
          {iconNode ? (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>{iconNode}</View>
          ) : null}
          {showLabels && iconNode ? <View style={{ height: 4 }} /> : null}
          {showLabels || !iconNode ? (
            <Text
              style={{
                textAlign: 'center',
                fontFamily: buttonType.nativeFamily,
                fontSize: buttonType.fontSize,
                lineHeight,
                letterSpacing: buttonType.letterSpacingPx,
                color: textColor,
              }}
            >
              {item.label}
            </Text>
          ) : null}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export function AppBottomTabBar({ items, tone, showLabels = true }: AppBottomTabBarProps) {
  const { theme } = useAppTheme();
  const buttonType = theme.typography.styles.button;
  const lineHeight = Math.round(buttonType.fontSize * buttonType.lineHeightRecommended);
  const insets = useSafeAreaInsets();
  const activeColors = getActiveColors(tone, theme);
  return (
    <View
      style={{
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: theme.colors.surface,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        paddingBottom: insets.bottom + theme.spacing.x4l,
      }}
    >
      <View style={{ width: '100%', flexDirection: 'row' }}>
        {withGap(
          items.map((item) => (
            <TabButton
              key={item.key}
              item={item}
              showLabels={showLabels}
              lineHeight={lineHeight}
              activeColors={activeColors}
            />
          )),
          8,
          'row',
          1,
        )}
      </View>
    </View>
  );
}
