import type { CSSProperties, HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { useAppTheme } from '../theme/theme-context';

type AppCardTone = 'default' | 'accent';

export interface AppCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'style'>, PropsWithChildren {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  tone?: AppCardTone;
  onPress?: () => void;
  style?: CSSProperties;
}

export function AppCard({
  children,
  title,
  subtitle,
  footer,
  tone = 'default',
  onPress,
  style,
  ...rest
}: AppCardProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;
  const borderColor = tone === 'accent' ? theme.colors.brandPrimary : theme.grayscale[3];

  return (
    <div
      {...rest}
      onClick={onPress}
      role={onPress ? 'button' : undefined}
      tabIndex={onPress ? 0 : undefined}
      style={{
        width: '100%',
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${borderColor}`,
        backgroundColor: theme.colors.surface,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.12)',
        padding: theme.spacing.md,
        display: 'grid',
        gap: theme.spacing.sm,
        cursor: onPress ? 'pointer' : 'default',
        transition: 'transform 140ms ease, box-shadow 140ms ease',
        ...style,
      }}
    >
      {title ? (
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
      ) : null}
      {subtitle ? (
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
          {subtitle}
        </p>
      ) : null}
      {children}
      {footer ? (
        <div
          style={{
            marginTop: theme.spacing.xs,
            paddingTop: theme.spacing.sm,
            borderTop: `1px solid ${theme.grayscale[3]}`,
          }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
