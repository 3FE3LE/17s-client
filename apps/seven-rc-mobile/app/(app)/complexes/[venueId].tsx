import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppBadge,
  AppButtonGroup,
  AppCard,
  AppEmpty,
  AppSeparator,
  AppSkeleton,
  GapView,
  useAppTheme,
  useAppToast,
} from '@17suit/ui';
import { AppButton, AppTypography } from '@17suit/ui-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Text } from 'react-native';
import { Screen } from '../../../components/screen';
import { confirmDestructive } from '../../../lib/confirm';
import { humanizeError } from '../../../lib/error-messages';
import {
  formatVenueRange,
  reservationBadgeVariant,
  reservationStatusLabel,
  venueDateKey,
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

/** Device-local `YYYY-MM-DD` for the API's date-range filter. */
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

function byStart(a: VenueReservation, b: VenueReservation) {
  return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
}

function playerName(reservation: VenueReservation) {
  return reservation.user?.name?.trim() || reservation.customerName?.trim() || null;
}

/**
 * Role gate. Owner-only queries mount in `OwnerVenueDetail`, so a player (or a
 * role still loading) never fires them and never sees a "not allowed" flash.
 */
export default function VenueDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const { user } = useUser();
  const { role, isLoading } = useCurrentUserRoleQuery({
    userId: user?.id ?? null,
    enabled: Boolean(user?.id),
  });

  if (isLoading || !user) {
    return (
      <Screen title="Complejo">
        <GapView gap="sm">
          <AppSkeleton height={44} rounded="md" />
          <AppSkeleton height={120} rounded="lg" />
          <AppSkeleton height={120} rounded="lg" />
        </GapView>
      </Screen>
    );
  }

  if (role !== 'OWNER' || !venueId) {
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

  return <OwnerVenueDetail venueId={venueId} />;
}

function OwnerVenueDetail({ venueId }: { venueId: string }) {
  const router = useRouter();
  const toast = useAppToast();
  const { theme } = useAppTheme();
  const iconColor = theme.colors.brandPrimary;
  const venuesQuery = useOwnerVenuesQuery();
  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
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
    { refetchOnWindowFocus: true },
  );
  const confirmReservationMutation = useConfirmVenueReservationMutation(venueId);
  const rejectReservationMutation = useRejectVenueReservationMutation(venueId);
  const [reservationAction, setReservationAction] = useState<{
    reservationId: string;
    action: 'confirm' | 'reject';
  } | null>(null);

  const venue = (venuesQuery.data ?? []).find((item) => item.id === venueId);
  const timeZone = venue?.timezone;
  const pitches = pitchesQuery.data ?? [];

  // Day buckets use the venue's calendar, not the phone's.
  const sections = useMemo(() => {
    const all = [...(reservationsQuery.data ?? [])].sort(byStart);
    const today = venueDateKey(new Date(), timeZone);
    const pending = all.filter((item) => item.status === 'pending_confirmation');
    const rest = all.filter((item) => item.status !== 'pending_confirmation');
    const keyOf = (item: VenueReservation) => venueDateKey(item.startAt, timeZone);
    return {
      pending,
      today: rest.filter((item) => today !== null && keyOf(item) === today),
      upcoming: rest.filter((item) => {
        const key = keyOf(item);
        return today !== null && key !== null && key > today;
      }),
      history: rest
        .filter((item) => {
          const key = keyOf(item);
          return today !== null && key !== null && key < today;
        })
        .reverse(),
    };
  }, [reservationsQuery.data, timeZone]);

  const isActionInProgress =
    confirmReservationMutation.isPending || rejectReservationMutation.isPending;
  const hasAnyReservation =
    sections.pending.length +
      sections.today.length +
      sections.upcoming.length +
      sections.history.length >
    0;

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
    const who = playerName(reservation) ?? 'El jugador';
    confirmDestructive(
      {
        title: '¿Rechazar esta reserva?',
        message: `${reservation.pitch?.name ?? 'Cancha'} · ${formatVenueRange(
          reservation.startAt,
          reservation.endAt,
          timeZone,
        )}. ${who} verá la reserva como rechazada y el horario quedará libre.`,
        confirmText: 'Rechazar',
        cancelText: 'Volver',
      },
      () => {
        void rejectReservation(reservation.id);
      },
    );
  }

  function renderReservation(reservation: VenueReservation) {
    const isPending = reservation.status === 'pending_confirmation';
    const name = playerName(reservation);
    const details = [
      name ?? 'Jugador sin nombre',
      reservation.invitedCount > 0
        ? `${reservation.invitedCount} ${reservation.invitedCount === 1 ? 'invitado' : 'invitados'}`
        : null,
    ]
      .filter(Boolean)
      .join(' · ');
    const isBusy = reservationAction?.reservationId === reservation.id;

    return (
      <AppCard
        key={reservation.id}
        title={reservation.pitch?.name ?? 'Cancha'}
        subtitle={formatVenueRange(reservation.startAt, reservation.endAt, timeZone)}
        tone={isPending ? 'accent' : 'default'}
        footer={
          <GapView gap="sm">
            <AppBadge variant={reservationBadgeVariant(reservation.status)}>
              {reservationStatusLabel(reservation.status)}
            </AppBadge>
            {isPending ? (
              <AppButtonGroup>
                <AppButton
                  variant="success"
                  disabled={isActionInProgress}
                  busy={isBusy && reservationAction?.action === 'confirm'}
                  onPress={() => {
                    void confirmReservation(reservation.id);
                  }}
                >
                  {isBusy && reservationAction?.action === 'confirm' ? 'Confirmando…' : 'Confirmar'}
                </AppButton>
                <AppButton
                  variant="destructive"
                  disabled={isActionInProgress}
                  busy={isBusy && reservationAction?.action === 'reject'}
                  onPress={() => askRejectReservation(reservation)}
                >
                  {isBusy && reservationAction?.action === 'reject' ? 'Rechazando…' : 'Rechazar'}
                </AppButton>
              </AppButtonGroup>
            ) : null}
          </GapView>
        }
      >
        <Text style={{ color: theme.colors.text, fontSize: 15, lineHeight: 22 }}>{details}</Text>
        {reservation.notes ? (
          <Text style={{ color: theme.colors.muted, fontSize: 14, lineHeight: 20 }}>
            {`“${reservation.notes}”`}
          </Text>
        ) : null}
      </AppCard>
    );
  }

  function renderSection(title: string, items: VenueReservation[]) {
    if (items.length === 0) return null;
    return (
      <GapView gap="sm">
        <AppTypography variant="subtitle2" accessibilityRole="header">
          {`${title} (${items.length})`}
        </AppTypography>
        {items.map(renderReservation)}
      </GapView>
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
      refreshing={
        (pitchesQuery.isFetching && !pitchesQuery.isLoading) ||
        (reservationsQuery.isFetching && !reservationsQuery.isLoading)
      }
    >
      <GapView gap="md">
        {reservationsQuery.isLoading ? (
          <GapView gap="sm">
            <AppSkeleton height={100} rounded="lg" />
            <AppSkeleton height={100} rounded="lg" />
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

        {!reservationsQuery.isLoading && !reservationsQuery.error ? (
          hasAnyReservation ? (
            <GapView gap="lg">
              {renderSection('Por confirmar', sections.pending)}
              {renderSection('Hoy', sections.today)}
              {renderSection('Próximas', sections.upcoming)}
              {renderSection('Historial reciente', sections.history)}
            </GapView>
          ) : (
            <AppEmpty
              title="Aún no hay reservas"
              description="Aquí verás primero las reservas por confirmar, y luego las de hoy, las próximas y las de los últimos 30 días."
              icon={<Feather name="calendar" size={20} color={iconColor} />}
            />
          )
        ) : null}

        <AppSeparator />
        <AppTypography variant="subtitle2" accessibilityRole="header">
          {pitches.length > 0 ? `Canchas (${pitches.length})` : 'Canchas'}
        </AppTypography>

        {pitchesQuery.isLoading ? (
          <GapView gap="sm">
            <AppSkeleton height={90} rounded="lg" />
            <AppSkeleton height={90} rounded="lg" />
          </GapView>
        ) : null}

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

        {!pitchesQuery.isLoading && !pitchesQuery.error && pitches.length === 0 ? (
          <AppEmpty
            title="Este complejo aún no tiene canchas"
            description="Crea la primera cancha para empezar a recibir reservas."
            icon={<Feather name="plus" size={20} color={iconColor} />}
            actionLabel="Crear cancha"
            onAction={() => router.push(`/complexes/${venueId}/courts/new`)}
          />
        ) : null}

        {pitches.map((pitch) => (
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

        {pitches.length > 0 ? (
          <AppButton
            variant="neutral"
            onPress={() => router.push(`/complexes/${venueId}/courts/new`)}
          >
            Crear cancha
          </AppButton>
        ) : null}
      </GapView>
    </Screen>
  );
}
