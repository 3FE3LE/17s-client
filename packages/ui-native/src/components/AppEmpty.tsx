import type { ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';
import { AppButton } from './AppButton';

export interface AppEmptyProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
  style?: ViewStyle;
}

export function AppEmpty({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  children,
  style,
}: AppEmptyProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;

  return (
    <View
      style={[
        {
          width: '100%',
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: theme.grayscale[3],
          borderRadius: theme.borderRadius.lg,
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.lg,
          alignItems: 'center',
          gap: theme.spacing.sm,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: theme.borderRadius.full,
          backgroundColor: `${theme.colors.brandPrimary}22`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: theme.colors.brandPrimary,
            fontFamily: subtitleType.nativeFamily,
            fontSize: 18,
            lineHeight: 22,
          }}
        >
          {icon ?? '...'}
        </Text>
      </View>
      <Text
        style={{
          color: theme.colors.text,
          textAlign: 'center',
          fontFamily: subtitleType.nativeFamily,
          fontSize: subtitleType.fontSize,
          lineHeight: Math.round(subtitleType.fontSize * subtitleType.lineHeightRecommended),
          letterSpacing: subtitleType.letterSpacingPx,
        }}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            color: theme.colors.muted,
            textAlign: 'center',
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
            lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
            letterSpacing: bodyType.letterSpacingPx,
          }}
        >
          {description}
        </Text>
      ) : null}
      {children}
      {actionLabel && onAction ? (
        <AppButton variant="info" onPress={onAction}>
          {actionLabel}
        </AppButton>
      ) : null}
    </View>
  );
}
