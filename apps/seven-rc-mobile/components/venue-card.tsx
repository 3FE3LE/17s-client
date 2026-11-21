import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@17suit/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { OwnerVenue } from '../lib/seven-rc-api';
import logo from '../assets/icon-17suit.png';

interface VenueCardProps {
  venue: OwnerVenue;
}

/**
 * Owner's complex tile. Pushes the complex detail screen (courts + reservations)
 * on the native stack instead of opening an overlay, so Back/swipe-back work.
 */
export function VenueCard({ venue }: VenueCardProps) {
  const { theme } = useAppTheme();
  const router = useRouter();
  const addressLabel = venue.address?.trim().length ? venue.address : 'Dirección pendiente';
  const pitches = venue._count?.pitches ?? 0;
  const reservations = venue._count?.reservations ?? 0;
  const countsLabel = `${pitches} ${pitches === 1 ? 'cancha' : 'canchas'} · ${reservations} ${
    reservations === 1 ? 'reserva' : 'reservas'
  }`;
  // Text sits on a fixed dark scrim in both themes, so it uses the light brand token.
  const onScrim = theme.colors.brandLight;
  const captionStyle = {
    color: onScrim,
    fontFamily: theme.typography.styles.caption.nativeFamily,
    fontSize: theme.typography.styles.caption.fontSize,
    letterSpacing: theme.typography.styles.caption.letterSpacingPx,
  } as const;

  return (
    <Pressable
      onPress={() => router.push(`/complexes/${venue.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${venue.name}, ${addressLabel}, ${countsLabel}`}
      accessibilityHint="Abre las canchas y reservas del complejo"
      style={({ pressed }) => ({
        width: '100%',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.grayscale[3],
        overflow: 'hidden',
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <ImageBackground
        source={logo}
        resizeMode="cover"
        style={{ width: '100%', minHeight: 160, justifyContent: 'flex-end' }}
        imageStyle={{ opacity: 0.25 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
          style={{ padding: theme.spacing.md }}
        >
          <Text
            numberOfLines={2}
            style={{
              color: onScrim,
              fontFamily: theme.typography.styles.subtitle2.nativeFamily,
              fontSize: theme.typography.styles.subtitle2.fontSize,
              letterSpacing: theme.typography.styles.subtitle2.letterSpacingPx,
            }}
          >
            {venue.name}
          </Text>
          <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Feather name="map-pin" size={14} color={onScrim} />
            <Text style={[captionStyle, { flex: 1 }]} numberOfLines={1}>
              {addressLabel}
            </Text>
          </View>
          <Text style={[captionStyle, { marginTop: 4, fontVariant: ['tabular-nums'] }]}>
            {countsLabel}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}
