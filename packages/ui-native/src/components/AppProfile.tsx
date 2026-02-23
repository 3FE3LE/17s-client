import { Text, View } from 'react-native';
import { useAppTheme } from '../theme/theme-context';
import { AppButton } from './AppButton';

export interface AppProfileProps {
  fullName?: string | null;
  email?: string | null;
  userId?: string | null;
  onSignOut?: () => void;
}

export function AppProfile({ fullName, email, userId, onSignOut }: AppProfileProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;
  const captionType = theme.typography.styles.caption;
  const spacing = theme.spacing.sm;

  return (
    <View
      style={{
        width: '100%',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.surface,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
      }}
    >
      <Text
        style={{
          color: theme.colors.text,
          fontFamily: subtitleType.nativeFamily,
          fontSize: subtitleType.fontSize,
          lineHeight: Math.round(subtitleType.fontSize * subtitleType.lineHeightRecommended),
          letterSpacing: subtitleType.letterSpacingPx,
          marginBottom: spacing,
        }}
      >
        {fullName || 'Usuario'}
      </Text>
      <Text
        style={{
          color: theme.colors.muted,
          fontFamily: bodyType.nativeFamily,
          fontSize: bodyType.fontSize,
          lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
          letterSpacing: bodyType.letterSpacingPx,
          marginBottom: spacing,
        }}
      >
        {email || 'Sin email'}
      </Text>
      <Text
        style={{
          color: theme.colors.muted,
          fontFamily: captionType.nativeFamily,
          fontSize: captionType.fontSize,
          lineHeight: Math.round(captionType.fontSize * captionType.lineHeightRecommended),
          letterSpacing: captionType.letterSpacingPx,
          marginBottom: spacing,
        }}
      >
        {`ID: ${userId || '-'}`}
      </Text>
      <View style={{ marginTop: theme.spacing.xs }}>
        <AppButton variant="destructive" onPress={onSignOut}>
          Cerrar sesion
        </AppButton>
      </View>
    </View>
  );
}
