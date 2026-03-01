import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

type AppCardTone = 'default' | 'accent';

export interface AppCardProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  tone?: AppCardTone;
  onPress?: () => void;
  style?: ViewStyle;
}

export function AppCard({
  children,
  title,
  subtitle,
  footer,
  tone = 'default',
  onPress,
  style,
}: AppCardProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;
  const borderColor = tone === 'accent' ? theme.colors.brandPrimary : theme.grayscale[3];
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={[
        {
          width: '100%',
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor,
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.md,
          gap: theme.spacing.sm,
        },
        style,
      ]}
    >
      {title ? (
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: subtitleType.nativeFamily,
            fontSize: subtitleType.fontSize,
            lineHeight: Math.round(subtitleType.fontSize * subtitleType.lineHeightRecommended),
            letterSpacing: subtitleType.letterSpacingPx,
          }}
        >
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text
          style={{
            color: theme.colors.muted,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
            lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
            letterSpacing: bodyType.letterSpacingPx,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
      {children}
      {footer ? (
        <View
          style={{
            marginTop: theme.spacing.xs,
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.grayscale[3],
          }}
        >
          {footer}
        </View>
      ) : null}
    </Container>
  );
}
