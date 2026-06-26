import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { useAppTheme } from '../theme/theme-context';
import { AppButton } from './AppButton';

export interface AppEmptyProps extends PropsWithChildren {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: CSSProperties;
}

export function AppEmpty({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  style,
  children,
}: AppEmptyProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;

  return (
    <div
      style={{
        width: '100%',
        border: `1px dashed ${theme.grayscale[3]}`,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        display: 'grid',
        gap: theme.spacing.sm,
        justifyItems: 'center',
        textAlign: 'center',
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 44,
          height: 44,
          borderRadius: theme.borderRadius.full,
          backgroundColor: `${theme.colors.brandPrimary}22`,
          color: theme.colors.brandPrimary,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: subtitleType.webFamily,
          fontSize: 18,
          fontWeight: subtitleType.fontWeight,
        }}
      >
        {icon ?? '...'}
      </span>
      <p
        style={{
          margin: 0,
          color: theme.colors.text,
          fontFamily: subtitleType.webFamily,
          fontWeight: subtitleType.fontWeight,
          fontSize: subtitleType.fontSize,
          lineHeight: subtitleType.lineHeightRecommended,
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
            lineHeight: bodyType.lineHeightRecommended,
            letterSpacing: bodyType.letterSpacingEm,
            maxWidth: 480,
          }}
        >
          {description}
        </p>
      ) : null}
      {children}
      {actionLabel && onAction ? (
        <div style={{ width: '100%', maxWidth: 260 }}>
          <AppButton variant="info" onPress={onAction}>
            {actionLabel}
          </AppButton>
        </div>
      ) : null}
    </div>
  );
}
