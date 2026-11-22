import type { CSSProperties, HTMLAttributes } from 'react';
import { useAppTheme } from '../theme/theme-context';

type AppBadgeVariant = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'neutral';
type AppBadgeSize = 'sm' | 'md';

export interface AppBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  variant?: AppBadgeVariant;
  size?: AppBadgeSize;
  rounded?: boolean;
  style?: CSSProperties;
}

export function AppBadge({
  children,
  variant = 'neutral',
  size = 'sm',
  rounded = true,
  style,
  ...rest
}: AppBadgeProps) {
  const { theme, resolvedMode } = useAppTheme();
  const captionType = theme.typography.styles.caption;
  // Text on the saturated destructive/info fills (WCAG AA, 4.5:1 for caption text):
  // light #e10812 / #1876ae need pure white (4.95:1; brandLight #f0f0f0 was 4.34:1).
  // dark #f8333c / #1e91d6 fail with any light text (white 3.80 / 3.46:1), so they
  // take brandDark (4.84 / 5.32:1). The other fills already pass with brandDark
  // (primary 7.11, success 6.64, warning 7.26, neutral 11.8:1).
  const onSaturatedFill = resolvedMode === 'light' ? '#ffffff' : theme.colors.brandDark;
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
      color: onSaturatedFill,
    },
    warning: {
      backgroundColor: theme.colors.warning,
      color: theme.colors.brandDark,
    },
    info: {
      backgroundColor: theme.colors.info,
      color: onSaturatedFill,
    },
    neutral: {
      backgroundColor: theme.grayscale[3],
      color: theme.colors.brandDark,
    },
  };

  return (
    <span
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding:
          size === 'sm'
            ? `${theme.spacing.xs}px ${theme.spacing.sm}px`
            : `${theme.spacing.sm}px ${theme.spacing.md}px`,
        borderRadius: rounded ? theme.borderRadius.full : theme.borderRadius.sm,
        fontFamily: captionType.webFamily,
        fontWeight: captionType.fontWeight,
        fontSize: captionType.fontSize,
        lineHeight: captionType.lineHeightRecommended,
        letterSpacing: captionType.letterSpacingEm,
        whiteSpace: 'nowrap',
        backgroundColor: variantStyles[variant].backgroundColor,
        color: variantStyles[variant].color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
