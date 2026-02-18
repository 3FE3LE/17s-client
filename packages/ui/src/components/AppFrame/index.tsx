import { createElement, type ComponentType } from 'react';
import { isWeb, Paragraph, YStack } from 'tamagui';
import { suitTheme } from '../../theme';
import { AppTitle } from '../AppTitle';
import { APP_FRAME_BADGE, type AppFrameProps } from './shared';

const YStackAny = YStack as unknown as ComponentType<Record<string, unknown>>;
const ParagraphAny = Paragraph as unknown as ComponentType<Record<string, unknown>>;

export function AppFrame({ appName, subtitle, children }: AppFrameProps) {
  const overlineType = suitTheme.typography.styles.overline;
  const bodyType = suitTheme.typography.styles.body;

  const overline = createElement(ParagraphAny, {
    key: 'badge',
    style: {
      color: suitTheme.colors.info,
      margin: 0,
      fontSize: overlineType.fontSize,
      fontFamily: isWeb ? overlineType.webFamily : overlineType.nativeFamily,
      lineHeight: isWeb
        ? overlineType.fontSize * overlineType.lineHeightRecommended
        : Math.round(overlineType.fontSize * overlineType.lineHeightRecommended),
      letterSpacing: isWeb ? overlineType.letterSpacingEm : overlineType.letterSpacingPx,
      fontWeight: isWeb ? overlineType.fontWeight : undefined,
    },
    children: APP_FRAME_BADGE,
  });

  const subtitleNode = subtitle
    ? createElement(ParagraphAny, {
        key: 'subtitle',
        style: {
          color: suitTheme.colors.muted,
          margin: 0,
          fontSize: bodyType.fontSize,
          fontFamily: isWeb ? bodyType.webFamily : bodyType.nativeFamily,
          lineHeight: isWeb
            ? bodyType.fontSize * bodyType.lineHeightRecommended
            : Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
          letterSpacing: isWeb ? bodyType.letterSpacingEm : bodyType.letterSpacingPx,
          fontWeight: isWeb ? bodyType.fontWeight : undefined,
          maxWidth: isWeb ? suitTheme.sizes.layout.bodyMeasure : undefined,
        },
        children: subtitle,
      })
    : null;

  const content = createElement(YStackAny, {
    key: 'content',
    marginTop: suitTheme.spacing.lg,
    gap: suitTheme.spacing.md,
    children,
  });

  const card = createElement(YStackAny, {
    width: '100%',
    marginTop: suitTheme.spacing.md,
    borderRadius: suitTheme.borderRadius.xl,
    padding: suitTheme.spacing.lg,
    backgroundColor: suitTheme.colors.surface,
    '$platform-web': {
      maxWidth: suitTheme.sizes.layout.content,
      alignSelf: 'center',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.35), 0 6px 20px rgba(0, 0, 0, 0.25)',
    },
    children: [
      overline,
      createElement(AppTitle, { key: 'title', text: appName }),
      subtitleNode,
      content,
    ],
  });

  return createElement(YStackAny, {
    flex: 1,
    backgroundColor: suitTheme.colors.background,
    padding: suitTheme.spacing.lg,
    children: card,
  });
}
