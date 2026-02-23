import { Text } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

export interface AppTitleProps {
  text: string;
}

export function AppTitle({ text }: AppTitleProps) {
  const { theme } = useAppTheme();
  const titleType = theme.typography.styles.subtitle1;
  return (
    <Text
      style={{
        color: theme.colors.text,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        fontSize: titleType.fontSize,
        fontFamily: titleType.nativeFamily,
        lineHeight: Math.round(titleType.fontSize * titleType.lineHeightRecommended),
        letterSpacing: titleType.letterSpacingPx,
      }}
    >
      {text}
    </Text>
  );
}
