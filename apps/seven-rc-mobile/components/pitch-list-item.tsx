import { Animated, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { useAppTheme } from '@17suit/ui';
import type { Pitch } from '../lib/seven-rc-api';

interface PitchListItemProps {
  pitch?: Pitch;
  loading?: boolean;
}

export function PitchListItem({ pitch, loading = false }: PitchListItemProps) {
  const { theme } = useAppTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [loading, shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  if (loading || !pitch) {
    return (
      <Animated.View
        style={{
          height: 56,
          borderRadius: theme.borderRadius.md,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.grayscale[3],
          opacity,
        }}
      />
    );
  }

  return (
    <View
      style={{
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.grayscale[3],
        backgroundColor: theme.colors.surface,
      }}
    >
      <View
        style={{
          height: 18,
          backgroundColor: 'transparent',
        }}
      />
      <Animated.Text
        style={{
          color: theme.colors.text,
          fontFamily: theme.typography.styles.body.nativeFamily,
          fontSize: theme.typography.styles.body.fontSize,
          letterSpacing: theme.typography.styles.body.letterSpacingPx,
        }}
      >
        {pitch.name}
      </Animated.Text>
      <Animated.Text
        style={{
          color: theme.colors.muted,
          fontFamily: theme.typography.styles.caption.nativeFamily,
          fontSize: theme.typography.styles.caption.fontSize,
          letterSpacing: theme.typography.styles.caption.letterSpacingPx,
          marginTop: 4,
        }}
      >
        {`${pitch.sportType} · ${pitch.capacity} jugadores`}
      </Animated.Text>
    </View>
  );
}
