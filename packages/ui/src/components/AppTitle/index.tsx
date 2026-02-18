import { createElement, type ComponentType } from 'react';
import { isWeb, Paragraph } from 'tamagui';
import { suitTheme } from '../../theme';

const titleType = suitTheme.typography.styles.subtitle1;
const ParagraphAny = Paragraph as unknown as ComponentType<Record<string, unknown>>;

export interface AppTitleProps {
  text: string;
}

export function AppTitle({ text }: AppTitleProps) {
  return createElement(ParagraphAny, {
    style: {
      color: suitTheme.colors.text,
      marginTop: suitTheme.spacing.sm,
      marginBottom: suitTheme.spacing.sm,
      fontSize: titleType.fontSize,
      fontFamily: isWeb ? titleType.webFamily : titleType.nativeFamily,
      lineHeight: isWeb
        ? titleType.fontSize * titleType.lineHeightRecommended
        : Math.round(titleType.fontSize * titleType.lineHeightRecommended),
      letterSpacing: isWeb ? titleType.letterSpacingEm : titleType.letterSpacingPx,
      fontWeight: isWeb ? titleType.fontWeight : undefined,
    },
    children: text,
  });
}
