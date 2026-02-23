import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { useAppTheme } from '../theme/theme-context';

type AppButtonVariant = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'neutral';

export interface AppButtonProps
  extends PropsWithChildren, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onPress?: (() => void) | undefined;
  variant?: AppButtonVariant;
  disabled?: boolean;
}

export function AppButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  ...rest
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
  const lineHeight = buttonType.fontSize * buttonType.lineHeightRecommended;

  return (
    <button
      {...rest}
      type="button"
      onClick={onPress}
      disabled={disabled}
      style={{
        backgroundColor: colors.backgroundColor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: theme.sizes.control.md,
        padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.35)',
        transition: 'transform 120ms ease, filter 120ms ease',
        opacity: disabled ? 0.75 : 1,
      }}
    >
      <span
        style={{
          color: colors.textColor,
          margin: 0,
          textAlign: 'center',
          fontFamily: buttonType.webFamily,
          fontSize: buttonType.fontSize,
          lineHeight,
          fontWeight: buttonType.fontWeight,
          letterSpacing: buttonType.letterSpacingEm,
        }}
      >
        {children}
      </span>
    </button>
  );
}
