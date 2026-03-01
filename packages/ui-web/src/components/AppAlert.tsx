import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { useAppTheme } from '../theme/theme-context';

type AppAlertVariant = 'info' | 'success' | 'warning' | 'destructive';

export interface AppAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  variant?: AppAlertVariant;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
}

export function AppAlert({
  variant = 'info',
  title,
  description,
  icon,
  action,
  style,
  ...rest
}: AppAlertProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;
  const variantStyles: Record<
    AppAlertVariant,
    { border: string; background: string; icon: string }
  > = {
    info: {
      border: theme.colors.info,
      background: `${theme.colors.info}22`,
      icon: theme.colors.info,
    },
    success: {
      border: theme.colors.success,
      background: `${theme.colors.success}22`,
      icon: theme.colors.success,
    },
    warning: {
      border: theme.colors.warning,
      background: `${theme.colors.warning}22`,
      icon: theme.colors.warning,
    },
    destructive: {
      border: theme.colors.destructive,
      background: `${theme.colors.destructive}22`,
      icon: theme.colors.destructive,
    },
  };

  return (
    <div
      {...rest}
      role="alert"
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: theme.spacing.sm,
        borderLeft: `4px solid ${variantStyles[variant].border}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        backgroundColor: variantStyles[variant].background,
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 24,
          height: 24,
          borderRadius: theme.borderRadius.full,
          border: `1px solid ${variantStyles[variant].icon}`,
          color: variantStyles[variant].icon,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: subtitleType.webFamily,
          fontSize: 12,
          fontWeight: subtitleType.fontWeight,
        }}
      >
        {icon ?? '!'}
      </span>
      <div style={{ display: 'grid', gap: theme.spacing.xs }}>
        <p
          style={{
            margin: 0,
            color: theme.colors.text,
            fontFamily: subtitleType.webFamily,
            fontWeight: subtitleType.fontWeight,
            fontSize: subtitleType.fontSize,
            lineHeight: subtitleType.fontSize * subtitleType.lineHeightRecommended,
            letterSpacing: subtitleType.letterSpacingEm,
          }}
        >
          {title}
        </p>
        {description ? (
          <p
            style={{
              margin: 0,
              color: theme.colors.muted,
              fontFamily: bodyType.webFamily,
              fontWeight: bodyType.fontWeight,
              fontSize: bodyType.fontSize,
              lineHeight: bodyType.fontSize * bodyType.lineHeightRecommended,
              letterSpacing: bodyType.letterSpacingEm,
            }}
          >
            {description}
          </p>
        ) : null}
        {action ? <div style={{ marginTop: theme.spacing.xs }}>{action}</div> : null}
      </div>
    </div>
  );
}
