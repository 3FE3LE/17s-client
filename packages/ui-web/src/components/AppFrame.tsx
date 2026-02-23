import type { PropsWithChildren } from 'react';
import { useAppTheme } from '../theme/theme-context';
import { AppTitle } from './AppTitle';

export interface AppFrameProps extends PropsWithChildren {
  appName: string;
  subtitle?: string;
  onBack?: () => void;
}

const APP_FRAME_BADGE = '17SUIT';

export function AppFrame({ appName, subtitle, onBack, children }: AppFrameProps) {
  const { theme } = useAppTheme();
  const overlineType = theme.typography.styles.overline;
  const bodyType = theme.typography.styles.body;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: '100%',
          marginTop: theme.spacing.md,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.surface,
          maxWidth: theme.sizes.layout.content,
          alignSelf: 'center',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.35), 0 6px 20px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          {typeof onBack === 'function' ? (
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.surface}`,
                background: 'transparent',
                color: theme.colors.brandLight,
                cursor: 'pointer',
              }}
            >
              ←
            </button>
          ) : null}
          <p
            style={{
              color: theme.colors.info,
              margin: 0,
              fontSize: overlineType.fontSize,
              fontFamily: overlineType.webFamily,
              lineHeight: overlineType.fontSize * overlineType.lineHeightRecommended,
              letterSpacing: overlineType.letterSpacingEm,
              fontWeight: overlineType.fontWeight,
            }}
          >
            {APP_FRAME_BADGE}
          </p>
        </div>
        <AppTitle text={appName} />
        {subtitle ? (
          <p
            style={{
              color: theme.colors.muted,
              margin: 0,
              fontSize: bodyType.fontSize,
              fontFamily: bodyType.webFamily,
              lineHeight: bodyType.fontSize * bodyType.lineHeightRecommended,
              letterSpacing: bodyType.letterSpacingEm,
              fontWeight: bodyType.fontWeight,
              maxWidth: theme.sizes.layout.bodyMeasure,
            }}
          >
            {subtitle}
          </p>
        ) : null}
        <div
          style={{
            marginTop: theme.spacing.lg,
            gap: theme.spacing.md,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
