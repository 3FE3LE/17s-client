import type { PropsWithChildren } from 'react';
import { useAppTheme } from '../theme/theme-context';

interface ProductShellProps extends PropsWithChildren {
  productName: string;
  subtitle: string;
}

export function ProductShell({ productName, subtitle, children }: ProductShellProps) {
  const { theme } = useAppTheme();
  const overlineType = theme.typography.styles.overline;
  const titleType = theme.typography.styles.subtitle1;
  const bodyType = theme.typography.styles.body;

  return (
    <div
      style={{
        flex: 1,
        paddingTop: theme.spacing.x2l,
        paddingLeft: theme.spacing.x2l,
        paddingRight: theme.spacing.x2l,
        background: `radial-gradient(circle at 10% 10%, ${theme.colors.surface}, ${theme.colors.background})`,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          maxWidth: theme.sizes.layout.wideContent,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p
          style={{
            margin: 0,
            color: theme.colors.brandSecondary,
            fontFamily: overlineType.webFamily,
            fontSize: overlineType.fontSize,
            lineHeight: overlineType.fontSize * overlineType.lineHeightRecommended,
            fontWeight: overlineType.fontWeight,
            letterSpacing: overlineType.letterSpacingEm,
          }}
        >
          17SUIT PRODUCT
        </p>
        <p
          style={{
            margin: 0,
            color: theme.colors.text,
            fontFamily: titleType.webFamily,
            fontSize: titleType.fontSize,
            lineHeight: titleType.fontSize * titleType.lineHeightRecommended,
            fontWeight: titleType.fontWeight,
            letterSpacing: titleType.letterSpacingEm,
          }}
        >
          {productName}
        </p>
        <p
          style={{
            margin: 0,
            color: theme.colors.muted,
            maxWidth: theme.sizes.layout.bodyNarrow,
            fontFamily: bodyType.webFamily,
            fontSize: bodyType.fontSize,
            lineHeight: bodyType.fontSize * bodyType.lineHeightRecommended,
            fontWeight: bodyType.fontWeight,
            letterSpacing: bodyType.letterSpacingEm,
          }}
        >
          {subtitle}
        </p>
        <div style={{ marginTop: theme.spacing.xl, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
