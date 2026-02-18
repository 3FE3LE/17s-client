import { createElement, type ComponentType, type PropsWithChildren } from 'react';
import { isWeb, Paragraph, YStack } from 'tamagui';
import { suitTheme } from '../../theme';

interface ProductShellProps extends PropsWithChildren {
  productName: string;
  subtitle: string;
}

const YStackAny = YStack as unknown as ComponentType<Record<string, unknown>>;
const ParagraphAny = Paragraph as unknown as ComponentType<Record<string, unknown>>;

export function ProductShell({ productName, subtitle, children }: ProductShellProps) {
  const overlineType = suitTheme.typography.styles.overline;
  const titleType = suitTheme.typography.styles.subtitle1;
  const bodyType = suitTheme.typography.styles.body;

  const shellBadge = createElement(ParagraphAny, {
    key: 'badge',
    style: {
      margin: 0,
      color: suitTheme.colors.brandSecondary,
      fontFamily: isWeb ? overlineType.webFamily : overlineType.nativeFamily,
      fontSize: overlineType.fontSize,
      lineHeight: isWeb
        ? overlineType.fontSize * overlineType.lineHeightRecommended
        : Math.round(overlineType.fontSize * overlineType.lineHeightRecommended),
      fontWeight: isWeb ? overlineType.fontWeight : undefined,
      letterSpacing: isWeb ? overlineType.letterSpacingEm : overlineType.letterSpacingPx,
    },
    children: '17SUIT PRODUCT',
  });

  const title = createElement(ParagraphAny, {
    key: 'title',
    style: {
      margin: 0,
      color: suitTheme.colors.text,
      fontFamily: isWeb ? titleType.webFamily : titleType.nativeFamily,
      fontSize: titleType.fontSize,
      lineHeight: isWeb
        ? titleType.fontSize * titleType.lineHeightRecommended
        : Math.round(titleType.fontSize * titleType.lineHeightRecommended),
      fontWeight: isWeb ? titleType.fontWeight : undefined,
      letterSpacing: isWeb ? titleType.letterSpacingEm : titleType.letterSpacingPx,
    },
    children: productName,
  });

  const subtitleText = createElement(ParagraphAny, {
    key: 'subtitle',
    style: {
      margin: 0,
      color: suitTheme.colors.muted,
      maxWidth: isWeb ? suitTheme.sizes.layout.bodyNarrow : undefined,
      fontFamily: isWeb ? bodyType.webFamily : bodyType.nativeFamily,
      fontSize: bodyType.fontSize,
      lineHeight: isWeb
        ? bodyType.fontSize * bodyType.lineHeightRecommended
        : Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
      fontWeight: isWeb ? bodyType.fontWeight : undefined,
      letterSpacing: isWeb ? bodyType.letterSpacingEm : bodyType.letterSpacingPx,
    },
    children: subtitle,
  });

  const content = createElement(YStackAny, {
    key: 'content',
    marginTop: suitTheme.spacing.xl,
    children,
  });

  return createElement(YStackAny, {
    flex: 1,
    paddingTop: isWeb ? suitTheme.spacing.xxl : 64,
    paddingHorizontal: isWeb ? suitTheme.spacing.xxl : suitTheme.spacing.lg,
    backgroundColor: suitTheme.colors.background,
    '$platform-web': {
      minHeight: '100vh',
      background: `radial-gradient(circle at 10% 10%, ${suitTheme.colors.surface}, ${suitTheme.colors.background})`,
    },
    children: createElement(YStackAny, {
      maxWidth: isWeb ? suitTheme.sizes.layout.wideContent : undefined,
      marginHorizontal: isWeb ? 'auto' : undefined,
      children: [shellBadge, title, subtitleText, content],
    }),
  });
}
