import { createElement, type ComponentType } from 'react';
import { ScrollView } from 'react-native';
import { Paragraph, YStack } from 'tamagui';
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
      fontFamily: overlineType.nativeFamily,
      lineHeight: Math.round(overlineType.fontSize * overlineType.lineHeightRecommended),
      letterSpacing: overlineType.letterSpacingPx,
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
          fontFamily: bodyType.nativeFamily,
          lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
          letterSpacing: bodyType.letterSpacingPx,
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
    children: [
      overline,
      createElement(AppTitle, { key: 'title', text: appName }),
      subtitleNode,
      content,
    ],
  });

  return createElement(ScrollView, {
    style: {
      flex: 1,
      backgroundColor: suitTheme.colors.background,
    },
    contentContainerStyle: {
      padding: suitTheme.spacing.lg,
      paddingBottom: suitTheme.spacing.xxl,
    },
    keyboardShouldPersistTaps: 'handled',
    children: card,
  });
}
