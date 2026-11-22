import {
  sevenRcQueryKeys,
  useCurrentUserRoleQuery,
} from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppButton,
  AppCard,
  AppEmpty,
  AppSeparator,
  AppSkeleton,
  AppTypography,
  GapView,
  useAppTheme,
} from '@17suit/ui-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../../components/screen';
import { OwnerActionSheet } from '../../../components/owner-action-sheet';
import { OwnerReservationCard } from '../../../components/owner-reservation-card';
import { humanizeError } from '../../../lib/error-messages';
import { formatUpdatedAgo, useNow, useScreenFocus } from '../../../lib/focus';
import { isAwaitingOwner, venueDateKey } from '../../../lib/reservation-format';
import {
  ownerReservationsRange,
  useOwnerVenuePitchesQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
} from '../../../lib/owner-queries';
import { pitchSummary, sportIcon } from '../../../lib/sports';
import { usePullRefresh } from '../../../lib/use-pull-refresh';
import { useOwnerReservationActions } from '../../../lib/use-owner-reservation-actions';
import type { VenueReservation } from '../../../lib/seven-rc-api';

const PENDING_POLL_MS = 45_000;

function byStart(a: VenueReservation, b: VenueReservation) {
  return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
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
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();
  const iconColor = theme.colors.brandPrimary;
  const venuesQuery = useOwnerVenuesQuery();
  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
  const [range] = useState(() => ownerReservationsRange());
  const refreshVenue = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId) }),
        queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenueReservationsBase(venueId),
        }),
      ]),
    [queryClient, venueId],
  );
  const pullRefresh = usePullRefresh(() => Promise.all([venuesQuery.refetch(), refreshVenue()]));
  const focused = useScreenFocus(refreshVenue);
  const now = useNow(30_000);
  const reservationsQuery = useOwnerVenueReservationsQuery(venueId, range.from, range.to, {
    refetchOnWindowFocus: true,
    refetchInterval: focused ? PENDING_POLL_MS : false,
    refetchIntervalInBackground: false,
  });
  const actions = useOwnerReservationActions();

  const venue = (venuesQuery.data ?? []).find((item) => item.id === venueId);
  const timeZone = venue?.timezone;
  // Times and day buckets need the venue's zone; never fall back to the phone's.
  const resolvingVenue = !timeZone && venuesQuery.isFetching;
  const loadingAgenda = reservationsQuery.isLoading || resolvingVenue;
  const pitches = pitchesQuery.data ?? [];

  // Day buckets use the venue's calendar, not the phone's. Expired requests
  // fall out of "Por confirmar" into their day, marked "Vencida".
  const sections = useMemo(() => {
    const all = [...(reservationsQuery.data ?? [])].sort(byStart);
    const today = venueDateKey(new Date(now), timeZone);
    const pending = all.filter((item) => isAwaitingOwner(item, now));
    const rest = all.filter((item) => !isAwaitingOwner(item, now));
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
  }, [reservationsQuery.data, timeZone, now]);

  const hasAnyReservation =
    sections.pending.length +
      sections.today.length +
      sections.upcoming.length +
      sections.history.length >
    0;
  const updatedLabel = formatUpdatedAgo(reservationsQuery.dataUpdatedAt, now);

  function renderReservation(reservation: VenueReservation) {
    return (
      <OwnerReservationCard
        key={reservation.id}
        reservation={reservation}
        timeZone={timeZone}
        now={now}
        actions={actions}
      />
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
      subtitle={updatedLabel ?? 'Canchas y reservas del complejo'}
      onRefresh={pullRefresh.onRefresh}
      refreshing={pullRefresh.refreshing}
    >
      <GapView gap="md">
        <OwnerActionSheet actions={actions} />
        {!timeZone && !venuesQuery.isFetching ? (
          <AppAlert
            variant="warning"
            title="No pudimos cargar este complejo"
            description={
              venuesQuery.error
                ? humanizeError(venuesQuery.error, 'load')
                : 'No lo encontramos entre tus complejos.'
            }
            action={
              <AppButton variant="warning" onPress={() => void venuesQuery.refetch()}>
                Reintentar
              </AppButton>
            }
          />
        ) : null}

        {loadingAgenda ? (
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

        {timeZone && !loadingAgenda && !reservationsQuery.error ? (
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
            footer={
              <AppButton
                variant="info"
                onPress={() => router.push(`/complexes/${venueId}/courts/${pitch.id}/slots`)}
              >
                Configurar horarios
              </AppButton>
            }
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
              <MaterialCommunityIcons
                name={sportIcon(pitch.sportType)}
                size={22}
                color={theme.colors.muted}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
              <AppTypography variant="body" color={theme.colors.muted} style={{ flex: 1 }}>
                {pitchSummary(pitch)}
              </AppTypography>
            </View>
          </AppCard>
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
