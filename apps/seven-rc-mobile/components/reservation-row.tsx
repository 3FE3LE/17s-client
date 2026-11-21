import { Feather } from '@expo/vector-icons';
import { AppBadge, useAppTheme } from '@17suit/ui';
import { Pressable, Text, View } from 'react-native';
import {
  formatVenueRange,
  reservationBadgeVariant,
  reservationStatusLabel,
} from '../lib/reservation-format';
import type { ReservationWithVenuePitch } from '../lib/player-queries';

interface ReservationRowProps {
  reservation: ReservationWithVenuePitch;
  onPress: () => void;
  /** Larger treatment for the "Próxima reserva" slot on home. */
  featured?: boolean;
}

export function ReservationRow({ reservation, onPress, featured = false }: ReservationRowProps) {
  const { theme } = useAppTheme();
  const venueName = reservation.venue?.name ?? 'Complejo';
  const pitchName = reservation.pitch?.name ?? 'Cancha';
  const when = formatVenueRange(
    reservation.startAt,
    reservation.endAt,
    reservation.venue?.timezone,
  );
  const status = reservationStatusLabel(reservation.status);
  const titleType = featured
    ? theme.typography.styles.subtitle1
    : theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${venueName}, ${pitchName}, ${when}, ${status}`}
      accessibilityHint="Abre el detalle de la reserva"
      style={({ pressed }) => ({
        width: '100%',
        minHeight: 44,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: featured ? theme.colors.brandPrimary : theme.grayscale[3],
        backgroundColor: theme.colors.surface,
        padding: featured ? theme.spacing.lg : theme.spacing.md,
        gap: theme.spacing.xs,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={2}
            style={{
              color: theme.colors.text,
              fontFamily: titleType.nativeFamily,
              fontSize: titleType.fontSize,
              lineHeight: Math.round(titleType.fontSize * titleType.lineHeightRecommended),
              letterSpacing: titleType.letterSpacingPx,
            }}
          >
            {`${venueName} · ${pitchName}`}
          </Text>
          <Text
            style={{
              color: theme.colors.muted,
              fontFamily: bodyType.nativeFamily,
              fontSize: bodyType.fontSize,
              lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
              letterSpacing: bodyType.letterSpacingPx,
              fontVariant: ['tabular-nums'],
            }}
          >
            {when}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={theme.colors.muted} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <AppBadge variant={reservationBadgeVariant(reservation.status)}>{status}</AppBadge>
      </View>
    </Pressable>
  );
}
