import { Feather } from '@expo/vector-icons';
import {
  AppAlert,
  AppBadge,
  AppEmpty,
  AppSkeleton,
  GapView,
  useAppTheme,
  useAppToast,
} from '@17suit/ui';
import { AppButton } from '@17suit/ui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Screen } from '../../../components/screen';
import { confirmDestructive } from '../../../lib/confirm';
import { humanizeError } from '../../../lib/error-messages';
import { useCancelReservationMutation, useMyReservationsQuery } from '../../../lib/player-queries';
import {
  formatVenueLongDay,
  formatVenueTime,
  isReservationCancellable,
  reservationBadgeVariant,
  reservationStatusLabel,
} from '../../../lib/reservation-format';
import { venueTimeLabel } from '../../../lib/timezone-label';

const PENDING_POLL_MS = 30_000;

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: 'map-pin' | 'grid' | 'calendar' | 'clock' | 'users' | 'file-text';
  label: string;
  value: string;
}) {
  const { theme } = useAppTheme();
  const captionType = theme.typography.styles.caption;
  const bodyType = theme.typography.styles.body;

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'flex-start' }}
    >
      <Feather name={icon} size={18} color={theme.colors.muted} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            color: theme.colors.muted,
            fontFamily: captionType.nativeFamily,
            fontSize: captionType.fontSize,
            lineHeight: 18,
            letterSpacing: captionType.letterSpacingPx,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
            lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
            letterSpacing: bodyType.letterSpacingPx,
            fontVariant: ['tabular-nums'],
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ReservationDetailScreen() {
  const router = useRouter();
  const toast = useAppToast();
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<{ reservationId?: string | string[] }>();
  const reservationId = Array.isArray(params.reservationId)
    ? params.reservationId[0]
    : params.reservationId;
  // Refresh on return to the app, and poll while the venue has not answered yet.
  const reservationsQuery = useMyReservationsQuery({
    refetchOnWindowFocus: true,
    refetchInterval: (query) =>
      query.state.data?.find((item) => item.id === reservationId)?.status === 'pending_confirmation'
        ? PENDING_POLL_MS
        : false,
  });
  const cancelMutation = useCancelReservationMutation();
  const reservation = reservationsQuery.data?.find((item) => item.id === reservationId);

  // A just-created reservation arrives with the post-mutation refetch.
  if (reservationsQuery.isLoading || (!reservation && reservationsQuery.isFetching)) {
    return (
      <Screen title="Reserva">
        <AppSkeleton height={220} rounded="lg" />
      </Screen>
    );
  }

  if (reservationsQuery.error && !reservation) {
    return (
      <Screen title="Reserva">
        <AppAlert
          variant="warning"
          title="No pudimos cargar la reserva"
          description={humanizeError(reservationsQuery.error, 'load')}
          action={
            <AppButton
              variant="warning"
              onPress={() => {
                void reservationsQuery.refetch();
              }}
            >
              Reintentar
            </AppButton>
          }
        />
      </Screen>
    );
  }

  if (!reservation) {
    return (
      <Screen title="Reserva">
        <AppEmpty
          title="No encontramos esta reserva"
          description="Puede que se haya eliminado. Vuelve al inicio para ver tus reservas."
          icon={<Feather name="search" size={20} color={theme.colors.brandPrimary} />}
          actionLabel="Ir al inicio"
          onAction={() => router.replace('/home')}
        />
      </Screen>
    );
  }

  const timeZone = reservation.venue?.timezone;
  const canCancel = isReservationCancellable(reservation.status, reservation.startAt);
  const isCancelling = cancelMutation.isPending;
  const timeRange = `${formatVenueTime(reservation.startAt, timeZone)}–${formatVenueTime(
    reservation.endAt,
    timeZone,
  )}`;

  const runCancel = async () => {
    try {
      await cancelMutation.mutateAsync(reservation.id);
      toast.success('Reserva cancelada', 'Liberamos el horario para otros jugadores.');
    } catch (error) {
      toast.error('No se pudo cancelar', humanizeError(error, 'cancel'));
    }
  };

  const bookAgain = () => {
    router.push({
      pathname: '/reservations/new',
      params: { venueId: reservation.venueId, pitchId: reservation.pitchId },
    });
  };

  const confirmCancel = () => {
    confirmDestructive(
      {
        title: '¿Cancelar esta reserva?',
        message: `${reservation.pitch?.name ?? 'Cancha'} · ${formatVenueLongDay(reservation.startAt, timeZone)}, ${timeRange}. Esta acción no se puede deshacer.`,
        confirmText: 'Cancelar reserva',
        cancelText: 'Mantener reserva',
      },
      () => {
        void runCancel();
      },
    );
  };

  return (
    <Screen
      title={reservation.venue?.name ?? 'Reserva'}
      onRefresh={() => {
        void reservationsQuery.refetch();
      }}
      refreshing={reservationsQuery.isFetching && !reservationsQuery.isLoading}
      footer={
        canCancel ? (
          <AppButton
            variant="destructive"
            onPress={confirmCancel}
            disabled={isCancelling}
            busy={isCancelling}
          >
            {isCancelling ? 'Cancelando…' : 'Cancelar reserva'}
          </AppButton>
        ) : (
          <AppButton
            onPress={bookAgain}
            accessibilityHint="Abre una reserva nueva en la misma cancha"
          >
            Reservar de nuevo
          </AppButton>
        )
      }
    >
      <GapView gap="md">
        <View style={{ flexDirection: 'row' }}>
          <AppBadge variant={reservationBadgeVariant(reservation.status)}>
            {reservationStatusLabel(reservation.status)}
          </AppBadge>
        </View>

        {reservation.status === 'pending_confirmation' ? (
          <Text
            style={{
              color: theme.colors.muted,
              fontFamily: theme.typography.styles.body.nativeFamily,
              fontSize: theme.typography.styles.body.fontSize,
              lineHeight: 22,
            }}
          >
            El complejo aún debe confirmar tu reserva. Revisamos el estado cada 30 segundos mientras
            tengas esta pantalla abierta, y al volver a la app.
          </Text>
        ) : null}

        <View
          style={{
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.grayscale[3],
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            gap: theme.spacing.md,
          }}
        >
          <DetailRow icon="grid" label="Cancha" value={reservation.pitch?.name ?? 'Cancha'} />
          <DetailRow
            icon="calendar"
            label="Fecha"
            value={formatVenueLongDay(reservation.startAt, timeZone)}
          />
          <DetailRow icon="clock" label={venueTimeLabel(timeZone)} value={timeRange} />
          {reservation.venue?.address ? (
            <DetailRow icon="map-pin" label="Dirección" value={reservation.venue.address} />
          ) : null}
          {reservation.invitedCount > 0 ? (
            <DetailRow icon="users" label="Invitados" value={String(reservation.invitedCount)} />
          ) : null}
          {reservation.notes ? (
            <DetailRow icon="file-text" label="Notas" value={reservation.notes} />
          ) : null}
        </View>
      </GapView>
    </Screen>
  );
}
