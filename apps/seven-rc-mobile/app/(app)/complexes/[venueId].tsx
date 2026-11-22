import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppBadge,
  AppButton,
  AppButtonGroup,
  AppCard,
  AppEmpty,
  AppSeparator,
  AppSkeleton,
  AppTypography,
  GapView,
  useAppTheme,
  useAppToast,
} from '@17suit/ui';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Screen } from '../../../components/screen';
import { confirmDestructive } from '../../../lib/confirm';
import { humanizeError } from '../../../lib/error-messages';
import {
  formatVenueRange,
  reservationBadgeVariant,
  reservationStatusLabel,
} from '../../../lib/reservation-format';
import {
  useConfirmVenueReservationMutation,
  useOwnerVenuePitchesQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
  useRejectVenueReservationMutation,
} from '../../../lib/owner-queries';
import type { VenueReservation } from '../../../lib/seven-rc-api';
import { useMemo, useState } from 'react';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateKey(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return formatDate(date);
}

export default function VenueDetailScreen() {
  const router = useRouter();
  const toast = useAppToast();
  const { theme } = useAppTheme();
  const iconColor = theme.colors.brandPrimary;
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const { user } = useUser();
  const { role } = useCurrentUserRoleQuery({
    userId: user?.id ?? null,
    enabled: Boolean(user?.id),
  });
  const venuesQuery = useOwnerVenuesQuery();
  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
  const today = useMemo(() => formatDate(new Date()), []);
  const reservationsRange = useMemo(
    () => ({
      from: formatDate(addDays(new Date(), -30)),
      to: formatDate(addDays(new Date(), 60)),
    }),
    [],
  );
  const reservationsQuery = useOwnerVenueReservationsQuery(
    venueId,
    reservationsRange.from,
    reservationsRange.to,
  );
  const confirmReservationMutation = useConfirmVenueReservationMutation(venueId);
  const rejectReservationMutation = useRejectVenueReservationMutation(venueId);
  const [reservationAction, setReservationAction] = useState<{
    reservationId: string;
    action: 'confirm' | 'reject';
  } | null>(null);

  const venue = (venuesQuery.data ?? []).find((item) => item.id === venueId);
  const reservations = reservationsQuery.data ?? [];
  const pendingReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status === 'pending_confirmation'),
    [reservations],
  );
  const nonPendingReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status !== 'pending_confirmation'),
    [reservations],
  );
  const reservationsToday = useMemo(
    () =>
      nonPendingReservations.filter((reservation) => {
        const key = toDateKey(reservation.startAt);
        return key === today;
      }),
    [nonPendingReservations, today],
  );
  const upcomingReservations = useMemo(
    () =>
      nonPendingReservations.filter((reservation) => {
        const key = toDateKey(reservation.startAt);
        return key !== null && key > today;
      }),
    [nonPendingReservations, today],
  );
  const historyReservations = useMemo(
    () =>
      nonPendingReservations.filter((reservation) => {
        const key = toDateKey(reservation.startAt);
        return key !== null && key < today;
      }),
    [nonPendingReservations, today],
  );
  const isActionInProgress =
    confirmReservationMutation.isPending || rejectReservationMutation.isPending;

  async function confirmReservation(reservationId: string) {
    try {
      setReservationAction({ reservationId, action: 'confirm' });
      await confirmReservationMutation.mutateAsync(reservationId);
      toast.success('Reserva confirmada', 'El jugador ya ve su reserva como confirmada.');
    } catch (error) {
      toast.error('No se pudo confirmar', humanizeError(error, 'confirm'));
    } finally {
      setReservationAction(null);
    }
  }

  async function rejectReservation(reservationId: string) {
    try {
      setReservationAction({ reservationId, action: 'reject' });
      await rejectReservationMutation.mutateAsync(reservationId);
      toast.success('Reserva rechazada', 'El jugador verá la reserva como rechazada.');
    } catch (error) {
      toast.error('No se pudo rechazar', humanizeError(error, 'reject'));
    } finally {
      setReservationAction(null);
    }
  }

  function askRejectReservation(reservation: VenueReservation) {
    const who = reservation.user?.name ?? reservation.customerName ?? 'El jugador';
    confirmDestructive(
      {
        title: '¿Rechazar esta reserva?',
        message: `${reservation.pitch?.name ?? 'Cancha'} · ${formatVenueRange(
          reservation.startAt,
          reservation.endAt,
          venue?.timezone,
        )}. ${who} verá la reserva como rechazada y el horario quedará libre.`,
        confirmText: 'Rechazar',
        cancelText: 'Volver',
      },
      () => {
        void rejectReservation(reservation.id);
      },
    );
  }

  function renderReservationRow(reservation: VenueReservation, allowActions: boolean) {
    return (
      <AppCard
        key={reservation.id}
        title={reservation.pitch?.name ?? 'Cancha'}
        subtitle={formatVenueRange(reservation.startAt, reservation.endAt, venue?.timezone)}
        tone={reservation.status === 'pending_confirmation' ? 'accent' : 'default'}
        footer={
          <GapView gap="sm">
            <AppBadge variant={reservationBadgeVariant(reservation.status)}>
              {reservationStatusLabel(reservation.status)}
            </AppBadge>
            {allowActions && reservation.status === 'pending_confirmation' ? (
              <AppButtonGroup>
                <AppButton
                  variant="success"
                  disabled={isActionInProgress}
                  onPress={() => {
                    void confirmReservation(reservation.id);
                  }}
                >
                  {reservationAction?.reservationId === reservation.id &&
                  reservationAction.action === 'confirm'
                    ? 'Confirmando...'
                    : 'Confirmar'}
                </AppButton>
                <AppButton
                  variant="destructive"
                  disabled={isActionInProgress}
                  onPress={() => askRejectReservation(reservation)}
                >
                  {reservationAction?.reservationId === reservation.id &&
                  reservationAction.action === 'reject'
                    ? 'Rechazando...'
                    : 'Rechazar'}
                </AppButton>
              </AppButtonGroup>
            ) : null}
          </GapView>
        }
      />
    );
  }

  if (role !== 'OWNER') {
    return (
      <Screen
        title="Complejo"
        subtitle="Solo las cuentas que administran complejos pueden ver esta pantalla."
      >
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>Volver al inicio</AppButton>
        </GapView>
      </Screen>
    );
  }

  return (
    <Screen
      title={venue?.name ?? 'Complejo'}
      subtitle="Canchas y reservas del complejo"
      onRefresh={() => {
        void venuesQuery.refetch();
        void pitchesQuery.refetch();
        void reservationsQuery.refetch();
      }}
      refreshing={pitchesQuery.isFetching || reservationsQuery.isFetching}
    >
      <GapView gap="md">
        <AppButton onPress={() => router.push(`/complexes/${venueId}/courts/new`)}>
          Crear cancha
        </AppButton>

        <AppSeparator />
        <AppTypography variant="subtitle2">Canchas</AppTypography>

        {pitchesQuery.isLoading || pitchesQuery.isFetching ? (
          <GapView gap="sm">
            <AppSkeleton height={90} rounded="lg" />
            <AppSkeleton height={90} rounded="lg" />
          </GapView>
        ) : null}

        {!pitchesQuery.isLoading &&
        !pitchesQuery.isFetching &&
        (pitchesQuery.data ?? []).length === 0 ? (
          <AppEmpty
            title="Este complejo aún no tiene canchas"
            description="Crea la primera cancha para empezar a recibir reservas."
            icon={<Feather name="plus" size={20} color={iconColor} />}
            actionLabel="Crear cancha"
            onAction={() => router.push(`/complexes/${venueId}/courts/new`)}
          />
        ) : null}

        {(pitchesQuery.data ?? []).map((pitch) => (
          <AppCard
            key={pitch.id}
            title={pitch.name}
            subtitle={`${pitch.sportType} · ${pitch.capacity} jugadores · ${pitch.slotDurationMinutes} min`}
            footer={
              <AppButton
                variant="info"
                onPress={() => router.push(`/complexes/${venueId}/courts/${pitch.id}/slots`)}
              >
                Configurar horarios
              </AppButton>
            }
          />
        ))}

        {pitchesQuery.error ? (
          <AppAlert
            variant="warning"
            title="No pudimos cargar las canchas"
            description={humanizeError(pitchesQuery.error, 'load')}
            action={
              <AppButton
                variant="warning"
                onPress={() => {
                  void pitchesQuery.refetch();
                }}
              >
                Reintentar
              </AppButton>
            }
          />
        ) : null}

        <AppSeparator />
        <AppTypography variant="subtitle2">Reservas del complejo</AppTypography>

        {reservationsQuery.isLoading ? (
          <GapView gap="sm">
            <AppSkeleton height={100} rounded="lg" />
            <AppSkeleton height={100} rounded="lg" />
          </GapView>
        ) : null}

        {!reservationsQuery.isLoading && reservations.length === 0 ? (
          <AppEmpty
            title="Aún no hay reservas"
            description="Aquí verás las reservas de los últimos 30 días y de los próximos 60."
            icon={<Feather name="calendar" size={20} color={iconColor} />}
          />
        ) : null}

        {!reservationsQuery.isLoading ? (
          <GapView gap="md">
            <AppTypography variant="subtitle2">Pendientes de confirmación</AppTypography>
            {pendingReservations.length === 0 ? (
              <AppEmpty
                title="Sin pendientes"
                description="No hay reservas esperando tu confirmación."
                icon={<Feather name="check-circle" size={20} color={iconColor} />}
              />
            ) : null}
            {pendingReservations.map((reservation) => renderReservationRow(reservation, true))}

            <AppTypography variant="subtitle2">Reservas de hoy</AppTypography>
            {reservationsToday.length === 0 ? (
              <AppEmpty
                title="Sin reservas para hoy"
                description="No hay reservas para la fecha actual."
                icon={<Feather name="sun" size={20} color={iconColor} />}
              />
            ) : null}
            {reservationsToday.map((reservation) => renderReservationRow(reservation, false))}

            <AppTypography variant="subtitle2">Próximas reservas</AppTypography>
            {upcomingReservations.length === 0 ? (
              <AppEmpty
                title="Sin reservas futuras"
                description="No hay reservas en fechas posteriores."
                icon={<Feather name="calendar" size={20} color={iconColor} />}
              />
            ) : null}
            {upcomingReservations.map((reservation) => renderReservationRow(reservation, false))}

            <AppTypography variant="subtitle2">Historial reciente</AppTypography>
            {historyReservations.length === 0 ? (
              <AppEmpty
                title="Sin historial reciente"
                description="No hubo reservas en los últimos 30 días."
                icon={<Feather name="clock" size={20} color={iconColor} />}
              />
            ) : null}
            {historyReservations.map((reservation) => renderReservationRow(reservation, false))}
          </GapView>
        ) : null}

        {reservationsQuery.error ? (
          <AppAlert
            variant="warning"
            title="No pudimos cargar las reservas"
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
        ) : null}
      </GapView>
    </Screen>
  );
}
