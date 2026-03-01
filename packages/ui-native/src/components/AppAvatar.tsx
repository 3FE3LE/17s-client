import { useMemo } from 'react';
import { Image, Text, View, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

export interface AppAvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: number;
  shape?: 'circle' | 'rounded';
  style?: ViewStyle;
}

function initialsFromName(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return tokens.map((token) => token[0]?.toUpperCase() ?? '').join('') || 'U';
}

export function AppAvatar({ src, alt, name, size = 40, shape = 'circle', style }: AppAvatarProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const initials = useMemo(() => initialsFromName(name ?? alt ?? 'User'), [alt, name]);
  const borderRadius = shape === 'circle' ? theme.borderRadius.full : theme.borderRadius.md;

  if (src) {
    return (
      <Image
        source={{ uri: src }}
        accessibilityLabel={alt ?? name ?? 'Avatar'}
        style={[
          {
            width: size,
            height: size,
            borderRadius,
            borderWidth: 1,
            borderColor: theme.grayscale[3],
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      accessibilityLabel={alt ?? name ?? 'Avatar'}
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          borderWidth: 1,
          borderColor: theme.grayscale[3],
          backgroundColor: theme.grayscale[4],
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{
          color: theme.colors.brandDark,
          fontFamily: subtitleType.nativeFamily,
          fontSize: Math.max(12, Math.floor(size * 0.38)),
          lineHeight: Math.max(14, Math.floor(size * 0.42)),
          letterSpacing: subtitleType.letterSpacingPx,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
