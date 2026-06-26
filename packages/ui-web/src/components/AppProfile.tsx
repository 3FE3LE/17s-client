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

  return (
    <div
      style={{
        width: '100%',
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.surface}`,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <p
        style={{
          margin: 0,
          color: theme.colors.text,
          fontFamily: subtitleType.webFamily,
          fontSize: subtitleType.fontSize,
          lineHeight: subtitleType.lineHeightRecommended,
          fontWeight: subtitleType.fontWeight,
          letterSpacing: subtitleType.letterSpacingEm,
        }}
      >
        {fullName || 'Usuario'}
      </p>
      <p
        style={{
          margin: 0,
          color: theme.colors.muted,
          fontFamily: bodyType.webFamily,
          fontSize: bodyType.fontSize,
          lineHeight: bodyType.lineHeightRecommended,
          fontWeight: bodyType.fontWeight,
          letterSpacing: bodyType.letterSpacingEm,
        }}
      >
        {email || 'Sin email'}
      </p>
      <p
        style={{
          margin: 0,
          color: theme.colors.muted,
          fontFamily: captionType.webFamily,
          fontSize: captionType.fontSize,
          lineHeight: captionType.lineHeightRecommended,
          fontWeight: captionType.fontWeight,
          letterSpacing: captionType.letterSpacingEm,
        }}
      >
        {`ID: ${userId || '-'}`}
      </p>
      <div
        style={{
          marginTop: theme.spacing.xs,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppButton variant="destructive" onPress={onSignOut}>
          Cerrar sesion
        </AppButton>
      </div>
    </div>
  );
}
