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
  useAppToast,
} from '@17suit/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { AuthTabScreen } from '../../../components/auth-tab-screen';
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

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function toDateKey(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return formatDate(date);
}

function formatReservationStatus(status: string): string {
  return status.replaceAll('_', ' ');
}

function reservationBadgeVariant(
  status: string,
): 'neutral' | 'success' | 'destructive' | 'warning' | 'info' {
  if (status === 'confirmed') return 'success';
  if (status === 'pending_confirmation') return 'warning';
  if (status === 'rejected' || status === 'cancelled') return 'destructive';
  if (status === 'completed') return 'info';
  return 'neutral';
}

export default function VenueDetailScreen() {
  const router = useRouter();
  const toast = useAppToast();
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
      toast.success('Reserva confirmada', 'El jugador ya puede ver su reserva confirmada.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo confirmar la reserva.';
      toast.error('Error al confirmar', message);
    } finally {
      setReservationAction(null);
    }
  }

  async function rejectReservation(reservationId: string) {
    try {
      setReservationAction({ reservationId, action: 'reject' });
      await rejectReservationMutation.mutateAsync(reservationId);
      toast.success('Reserva rechazada', 'La reserva quedo marcada como rechazada.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo rechazar la reserva.';
      toast.error('Error al rechazar', message);
    } finally {
      setReservationAction(null);
    }
  }

  function renderReservationRow(reservation: VenueReservation, allowActions: boolean) {
    return (
      <AppCard
        key={reservation.id}
        title={reservation.pitch?.name ?? 'Cancha'}
        subtitle={`${formatDay(reservation.startAt)} · ${formatTime(reservation.startAt)} - ${formatTime(
          reservation.endAt,
        )}`}
        tone={reservation.status === 'pending_confirmation' ? 'accent' : 'default'}
        footer={
          <GapView gap="sm">
            <AppBadge variant={reservationBadgeVariant(reservation.status)}>
              {formatReservationStatus(reservation.status)}
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
                  onPress={() => {
                    void rejectReservation(reservation.id);
                  }}
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
      <AuthTabScreen appName="Complejo" subtitle="Solo disponible para cuentas OWNER." role={role}>
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>Volver al inicio</AppButton>
        </GapView>
      </AuthTabScreen>
    );
  }

  return (
    <AuthTabScreen
      appName={venue?.name ?? 'Complejo'}
      subtitle="Listado de canchas y reservas del complejo."
      role={role}
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
            title="Este complejo aun no tiene canchas"
            description="Crea la primera cancha para comenzar a recibir reservas."
            icon="+"
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
            title="No se pudo cargar canchas"
            description={
              pitchesQuery.error instanceof Error
                ? pitchesQuery.error.message
                : 'Error desconocido.'
            }
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
            title="Sin reservas en la ventana de consulta"
            description="Mostramos historial reciente y reservas proximas para operar mejor."
            icon="..."
          />
        ) : null}

        {!reservationsQuery.isLoading ? (
          <GapView gap="md">
            <AppTypography variant="subtitle2">Pendientes de confirmacion</AppTypography>
            {pendingReservations.length === 0 ? (
              <AppEmpty
                title="Sin pendientes"
                description="No hay reservas esperando confirmacion."
                icon="..."
              />
            ) : null}
            {pendingReservations.map((reservation) => renderReservationRow(reservation, true))}

            <AppTypography variant="subtitle2">Reservas de hoy</AppTypography>
            {reservationsToday.length === 0 ? (
              <AppEmpty
                title="Sin reservas para hoy"
                description="No hay reservas para la fecha actual."
                icon="..."
              />
            ) : null}
            {reservationsToday.map((reservation) => renderReservationRow(reservation, false))}

            <AppTypography variant="subtitle2">Proximas reservas</AppTypography>
            {upcomingReservations.length === 0 ? (
              <AppEmpty
                title="Sin reservas futuras"
                description="No hay reservas en fechas posteriores."
                icon="..."
              />
            ) : null}
            {upcomingReservations.map((reservation) => renderReservationRow(reservation, false))}

            <AppTypography variant="subtitle2">Historial reciente</AppTypography>
            {historyReservations.length === 0 ? (
              <AppEmpty
                title="Sin historial reciente"
                description="No se encontraron reservas previas en los ultimos 30 dias."
                icon="..."
              />
            ) : null}
            {historyReservations.map((reservation) => renderReservationRow(reservation, false))}
          </GapView>
        ) : null}

        {reservationsQuery.error ? (
          <AppAlert
            variant="warning"
            title="No se pudo cargar reservas"
            description={
              reservationsQuery.error instanceof Error
                ? reservationsQuery.error.message
                : 'Error desconocido.'
            }
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

        <AppButton variant="neutral" onPress={() => router.replace('/home')}>
          Volver al listado de complejos
        </AppButton>
      </GapView>
    </AuthTabScreen>
  );
}
