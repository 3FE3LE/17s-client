import type { PropsWithChildren } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

type AppBadgeVariant = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'neutral';
type AppBadgeSize = 'sm' | 'md';

export interface AppBadgeProps extends PropsWithChildren {
  variant?: AppBadgeVariant;
  size?: AppBadgeSize;
  rounded?: boolean;
  style?: ViewStyle;
}

export function AppBadge({
  children,
  variant = 'neutral',
  size = 'sm',
  rounded = true,
  style,
}: AppBadgeProps) {
  const { theme } = useAppTheme();
  const captionType = theme.typography.styles.caption;
  const variantStyles: Record<AppBadgeVariant, { backgroundColor: string; color: string }> = {
    primary: {
      backgroundColor: theme.colors.brandPrimary,
      color: theme.colors.brandDark,
    },
    success: {
      backgroundColor: theme.colors.success,
      color: theme.colors.brandDark,
    },
    destructive: {
      backgroundColor: theme.colors.destructive,
      color: theme.colors.brandLight,
    },
    warning: {
      backgroundColor: theme.colors.warning,
      color: theme.colors.brandDark,
    },
    info: {
      backgroundColor: theme.colors.info,
      color: theme.colors.brandLight,
    },
    neutral: {
      backgroundColor: theme.grayscale[3],
      color: theme.colors.brandDark,
    },
  };

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          paddingHorizontal: size === 'sm' ? theme.spacing.sm : theme.spacing.md,
          paddingVertical: size === 'sm' ? theme.spacing.xs : theme.spacing.sm,
          borderRadius: rounded ? theme.borderRadius.full : theme.borderRadius.sm,
          backgroundColor: variantStyles[variant].backgroundColor,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: variantStyles[variant].color,
          fontFamily: captionType.nativeFamily,
          fontSize: captionType.fontSize,
          lineHeight: Math.round(captionType.fontSize * captionType.lineHeightRecommended),
          letterSpacing: captionType.letterSpacingPx,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
