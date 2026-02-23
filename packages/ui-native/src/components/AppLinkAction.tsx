import type { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

export interface AppLinkActionProps extends PropsWithChildren {
  onPress?: () => void;
}

export function AppLinkAction({ children, onPress }: AppLinkActionProps) {
  const { theme } = useAppTheme();
  const bodyType = theme.typography.styles.body;
  const lineHeight = Math.round(bodyType.fontSize * bodyType.lineHeightRecommended);

  return (
    <Pressable onPress={onPress}>
      <Text
        style={{
          paddingVertical: theme.spacing.xs,
          color: theme.colors.info,
          fontFamily: bodyType.nativeFamily,
          fontSize: bodyType.fontSize,
          lineHeight,
          letterSpacing: bodyType.letterSpacingPx,
          textAlign: 'left',
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
