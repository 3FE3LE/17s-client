import { useAppTheme } from '../theme/theme-context';

export interface AppTitleProps {
  text: string;
}

export function AppTitle({ text }: AppTitleProps) {
  const { theme } = useAppTheme();
  const titleType = theme.typography.styles.subtitle1;
  return (
    <p
      style={{
        color: theme.colors.text,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        fontSize: titleType.fontSize,
        fontFamily: titleType.webFamily,
        lineHeight: titleType.fontSize * titleType.lineHeightRecommended,
        letterSpacing: titleType.letterSpacingEm,
        fontWeight: titleType.fontWeight,
      }}
    >
      {text}
    </p>
  );
}
