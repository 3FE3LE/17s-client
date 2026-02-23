import type { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

type AppButtonVariant = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'neutral';

export interface AppButtonProps extends PropsWithChildren {
  onPress?: (() => void) | undefined;
  variant?: AppButtonVariant;
  disabled?: boolean;
}

export function AppButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
}: AppButtonProps) {
  const { theme } = useAppTheme();
  const variantStyles: Record<AppButtonVariant, { backgroundColor: string; textColor: string }> = {
    primary: {
      backgroundColor: theme.colors.brandPrimary,
      textColor: theme.colors.brandDark,
    },
    success: {
      backgroundColor: theme.colors.success,
      textColor: theme.colors.brandDark,
    },
    destructive: {
      backgroundColor: theme.colors.destructive,
      textColor: theme.colors.brandLight,
    },
    warning: {
      backgroundColor: theme.colors.warning,
      textColor: theme.colors.background,
    },
    info: {
      backgroundColor: theme.colors.info,
      textColor: theme.colors.brandLight,
    },
    neutral: {
      backgroundColor: theme.grayscale[4],
      textColor: theme.colors.brandDark,
    },
  };
  const colors = variantStyles[variant];
  const buttonType = theme.typography.styles.button;
  const lineHeight = Math.round(buttonType.fontSize * buttonType.lineHeightRecommended);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: colors.backgroundColor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: theme.sizes.control.md,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        opacity: disabled ? 0.75 : 1,
      }}
    >
      <Text
        style={{
          color: colors.textColor,
          textAlign: 'center',
          fontFamily: buttonType.nativeFamily,
          fontSize: buttonType.fontSize,
          lineHeight,
          letterSpacing: buttonType.letterSpacingPx,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
