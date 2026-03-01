import type { ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

type AppAlertVariant = 'info' | 'success' | 'warning' | 'destructive';

export interface AppAlertProps {
  variant?: AppAlertVariant;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  style?: ViewStyle;
}

export function AppAlert({
  variant = 'info',
  title,
  description,
  icon,
  action,
  style,
}: AppAlertProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;
  const variantStyles: Record<
    AppAlertVariant,
    { border: string; background: string; icon: string }
  > = {
    info: {
      border: theme.colors.info,
      background: `${theme.colors.info}22`,
      icon: theme.colors.info,
    },
    success: {
      border: theme.colors.success,
      background: `${theme.colors.success}22`,
      icon: theme.colors.success,
    },
    warning: {
      border: theme.colors.warning,
      background: `${theme.colors.warning}22`,
      icon: theme.colors.warning,
    },
    destructive: {
      border: theme.colors.destructive,
      background: `${theme.colors.destructive}22`,
      icon: theme.colors.destructive,
    },
  };

  return (
    <View
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          gap: theme.spacing.sm,
          borderLeftWidth: 4,
          borderLeftColor: variantStyles[variant].border,
          borderRadius: theme.borderRadius.md,
          backgroundColor: variantStyles[variant].background,
          padding: theme.spacing.md,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: theme.borderRadius.full,
          borderWidth: 1,
          borderColor: variantStyles[variant].icon,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: variantStyles[variant].icon,
            fontFamily: subtitleType.nativeFamily,
            fontSize: 12,
            lineHeight: 14,
            letterSpacing: subtitleType.letterSpacingPx,
          }}
        >
          {icon ?? '!'}
        </Text>
      </View>
      <View style={{ flex: 1, gap: theme.spacing.xs }}>
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
        {description ? (
          <Text
            style={{
              color: theme.colors.muted,
              fontFamily: bodyType.nativeFamily,
              fontSize: bodyType.fontSize,
              lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
              letterSpacing: bodyType.letterSpacingPx,
            }}
          >
            {description}
          </Text>
        ) : null}
        {action}
      </View>
    </View>
  );
}
