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
