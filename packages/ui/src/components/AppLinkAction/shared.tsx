import { createElement, type ComponentType, type PropsWithChildren } from 'react';
import { Paragraph, isWeb } from 'tamagui';
import { suitTheme } from '../../theme';

const ParagraphAny = Paragraph as unknown as ComponentType<Record<string, unknown>>;

export interface AppLinkActionProps extends PropsWithChildren {
  onPress?: () => void;
}

export function AppLinkAction({ children, onPress }: AppLinkActionProps) {
  const bodyType = suitTheme.typography.styles.body;
  const lineHeight = isWeb
    ? bodyType.fontSize * bodyType.lineHeightRecommended
    : Math.round(bodyType.fontSize * bodyType.lineHeightRecommended);

  return createElement(ParagraphAny, {
    onPress,
    style: {
      margin: 0,
      paddingVertical: suitTheme.spacing.xs,
      color: suitTheme.colors.info,
      textDecorationLine: 'none',
      fontFamily: isWeb ? bodyType.webFamily : bodyType.nativeFamily,
      fontSize: bodyType.fontSize,
      lineHeight,
      fontWeight: isWeb ? bodyType.fontWeight : undefined,
      letterSpacing: isWeb ? bodyType.letterSpacingEm : bodyType.letterSpacingPx,
      textAlign: 'left',
      cursor: isWeb ? 'pointer' : undefined,
    },
    children,
  });
}
