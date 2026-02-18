import { createElement, type ComponentType } from 'react';
import { Paragraph, YStack, isWeb } from 'tamagui';
import { AppButton } from '../AppButton';
import { suitTheme } from '../../theme';

const YStackAny = YStack as unknown as ComponentType<Record<string, unknown>>;
const ParagraphAny = Paragraph as unknown as ComponentType<Record<string, unknown>>;

export interface AppProfileProps {
  fullName?: string | null;
  email?: string | null;
  userId?: string | null;
  onSignOut?: () => void;
}

export function AppProfile({ fullName, email, userId, onSignOut }: AppProfileProps) {
  const subtitleType = suitTheme.typography.styles.subtitle2;
  const bodyType = suitTheme.typography.styles.body;
  const captionType = suitTheme.typography.styles.caption;
  const subtitleLineHeight = isWeb
    ? subtitleType.fontSize * subtitleType.lineHeightRecommended
    : Math.round(subtitleType.fontSize * subtitleType.lineHeightRecommended);
  const bodyLineHeight = isWeb
    ? bodyType.fontSize * bodyType.lineHeightRecommended
    : Math.round(bodyType.fontSize * bodyType.lineHeightRecommended);
  const captionLineHeight = isWeb
    ? captionType.fontSize * captionType.lineHeightRecommended
    : Math.round(captionType.fontSize * captionType.lineHeightRecommended);

  const title = createElement(ParagraphAny, {
    key: 'name',
    style: {
      margin: 0,
      color: suitTheme.colors.text,
      fontFamily: isWeb ? subtitleType.webFamily : subtitleType.nativeFamily,
      fontSize: subtitleType.fontSize,
      lineHeight: subtitleLineHeight,
      fontWeight: isWeb ? subtitleType.fontWeight : undefined,
      letterSpacing: isWeb ? subtitleType.letterSpacingEm : subtitleType.letterSpacingPx,
    },
    children: fullName || 'Usuario',
  });

  const emailNode = createElement(ParagraphAny, {
    key: 'email',
    style: {
      margin: 0,
      color: suitTheme.colors.muted,
      fontFamily: isWeb ? bodyType.webFamily : bodyType.nativeFamily,
      fontSize: bodyType.fontSize,
      lineHeight: bodyLineHeight,
      fontWeight: isWeb ? bodyType.fontWeight : undefined,
      letterSpacing: isWeb ? bodyType.letterSpacingEm : bodyType.letterSpacingPx,
    },
    children: email || 'Sin email',
  });

  const idNode = createElement(ParagraphAny, {
    key: 'id',
    style: {
      margin: 0,
      color: suitTheme.colors.muted,
      fontFamily: isWeb ? captionType.webFamily : captionType.nativeFamily,
      fontSize: captionType.fontSize,
      lineHeight: captionLineHeight,
      fontWeight: isWeb ? captionType.fontWeight : undefined,
      letterSpacing: isWeb ? captionType.letterSpacingEm : captionType.letterSpacingPx,
    },
    children: `ID: ${userId || '-'}`,
  });

  const buttonBlock = createElement(YStackAny, {
    key: 'actions',
    marginTop: suitTheme.spacing.xs,
    children: createElement(AppButton, {
      variant: 'destructive',
      onPress: onSignOut,
      children: 'Cerrar sesion',
    }),
  });

  return createElement(YStackAny, {
    width: '100%',
    borderRadius: suitTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: suitTheme.colors.surface,
    backgroundColor: suitTheme.colors.brandDark,
    padding: suitTheme.spacing.md,
    gap: suitTheme.spacing.sm,
    children: [title, emailNode, idNode, buttonBlock],
  });
}
