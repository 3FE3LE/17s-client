import { useCallback, useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  sevenRcQueryKeys,
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppButton,
  AppEmpty,
  AppInput,
  AppSkeleton,
  AppSpinner,
  AppTypography,
  GapView,
  useAppTheme,
} from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { Pressable, Text } from 'react-native';
import { Screen } from '../../../components/screen';
import {
  OWNER_INBOX_MAX_VENUES,
  ownerReservationsRange,
  useOwnerVenuesQuery,
  useOwnerVenuesReservationsQueries,
  type VenueReservation,
} from '../../../lib/owner-queries';
import { VenueCard } from '../../../components/venue-card';
import { useMyReservationsQuery, usePlayerVenuesQuery } from '../../../lib/player-queries';
import { PlayerVenueCard } from '../../../components/player-venue-card';
import { ReservationRow } from '../../../components/reservation-row';
import { OwnerReservationCard } from '../../../components/owner-reservation-card';
import { humanizeError } from '../../../lib/error-messages';
import { isAwaitingOwner, isReservationUpcoming } from '../../../lib/reservation-format';
import { formatUpdatedAgo, useNow, useScreenFocus } from '../../../lib/focus';
import { useOwnerReservationActions } from '../../../lib/use-owner-reservation-actions';
import { usePullRefresh } from '../../../lib/use-pull-refresh';
import { OwnerActionSheet } from '../../../components/owner-action-sheet';
import { venueRouteParams } from '../../../lib/venue-params';

/** Owner inbox refresh cadence while home is on screen. */
const PENDING_POLL_MS = 45_000;
/** Returning to home skips what was fetched this recently: the API allows 60 requests a minute. */
const FOCUS_REFRESH_MIN_AGE_MS = 10_000;
const MAX_INBOX_ITEMS = 10;
const MAX_UPCOMING = 3;
const MAX_HISTORY = 20;
const MAX_VENUES = 6;

function SectionTitle({ children }: { children: string }) {
  return (
    <AppTypography variant="subtitle2" accessibilityRole="header" style={{ marginTop: 8 }}>
      {children}
    </AppTypography>
  );
}

function Caption({ children }: { children: string }) {
  const { theme } = useAppTheme();
  return (
    // Not a live region: "Actualizado hace X" would be read out every minute.
    <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>{children}</Text>
  );
}

/** Low-weight disclosure row ("Ver historial (4)"). */
function DisclosureLink({
  label,
  expanded,
  onPress,
}: {
  label: string;
  expanded: boolean;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();
  const type = theme.typography.styles.button;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      style={({ pressed }) => ({
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Feather
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={18}
        color={theme.colors.text}
      />
      <Text
        style={{ color: theme.colors.text, fontFamily: type.nativeFamily, fontSize: type.fontSize }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Role switch. Owner and player data live in separate components so only the
 * active role's queries mount.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { role, isLoading, error, refetch } = useCurrentUserRoleQuery({
    userId: user?.id ?? null,
    enabled: Boolean(user?.id),
  });

  // If role is missing once data has loaded, send the user to onboarding.
  useRoleGate({ required: '*', router, onboardingPath: '/role' });

  if (isLoading) {
    return (
      <Screen title="Inicio" subtitle="Cargando tu panel…" back={false}>
        <GapView gap="md">
          <AppSpinner size={28} />
        </GapView>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen title="Inicio" back={false}>
        <AppAlert
          variant="destructive"
          title="No pudimos cargar tu cuenta"
          description={humanizeError(error, 'load')}
          action={
            <AppButton
              onPress={() => {
                void refetch();
              }}
            >
              Reintentar
            </AppButton>
          }
        />
      </Screen>
    );
  }

  if (role === 'OWNER') return <OwnerHome />;
  if (role === 'PLAYER') return <PlayerHome />;

  // No role yet: `useRoleGate` is redirecting to onboarding.
  return (
    <Screen title="Inicio" back={false}>
      <AppSpinner size={28} />
    </Screen>
  );
}

interface InboxItem {
  reservation: VenueReservation;
  venueName: string;
  timeZone: string | undefined;
}

function OwnerHome() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();
  const venuesQuery = useOwnerVenuesQuery();
  const venues = useMemo(() => venuesQuery.data ?? [], [venuesQuery.data]);
  const [range] = useState(() => ownerReservationsRange());

  const refreshOwnerData = useCallback(
    () => queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenues }),
    [queryClient],
  );
  const pullRefresh = usePullRefresh(refreshOwnerData);
  // Back on home from a venue or the profile tab. The app returning to the
  // foreground is covered by the reservation queries' refetchOnWindowFocus.
  const refreshOnFocus = useCallback(
    () =>
      queryClient.refetchQueries({
        queryKey: sevenRcQueryKeys.ownerVenues,
        type: 'active',
        predicate: (query) => Date.now() - query.state.dataUpdatedAt > FOCUS_REFRESH_MIN_AGE_MS,
      }),
    [queryClient],
  );
  const focused = useScreenFocus(refreshOnFocus);
  const now = useNow(30_000);

  const venueIds = useMemo(() => venues.map((venue) => venue.id), [venues]);
  const reservationQueries = useOwnerVenuesReservationsQueries(
    venueIds,
    range.from,
    range.to,
    focused ? PENDING_POLL_MS : false,
  );
  const actions = useOwnerReservationActions();

  const { inbox, pendingByVenue } = useMemo(() => {
    const items: InboxItem[] = [];
    const counts = new Map<string, number>();
    reservationQueries.forEach((query, index) => {
      const venue = venues[index];
      if (!venue) return;
      for (const reservation of query.data ?? []) {
        if (!isAwaitingOwner(reservation, now)) continue;
        counts.set(venue.id, (counts.get(venue.id) ?? 0) + 1);
        items.push({ reservation, venueName: venue.name, timeZone: venue.timezone });
      }
    });
    items.sort(
      (a, b) =>
        new Date(a.reservation.startAt).getTime() - new Date(b.reservation.startAt).getTime(),
    );
    return { inbox: items, pendingByVenue: counts };
  }, [reservationQueries, venues, now]);

  const inboxLoading = reservationQueries.some((query) => query.isLoading);
  const inboxError = reservationQueries.find((query) => query.error)?.error ?? null;
  // The inbox is only as fresh as its oldest venue, e.g. one whose poll is failing.
  const updateTimes = reservationQueries
    .map((query) => query.dataUpdatedAt)
    .filter((updatedAt) => updatedAt > 0);
  const updatedLabel =
    updateTimes.length > 0 ? formatUpdatedAgo(Math.min(...updateTimes), now) : null;

  const visibleInbox = inbox.slice(0, MAX_INBOX_ITEMS);
  const hiddenInbox = inbox.length - visibleInbox.length;

  return (
    <Screen
      title="Inicio"
      subtitle="Administras tus complejos"
      back={false}
      onRefresh={pullRefresh.onRefresh}
      refreshing={pullRefresh.refreshing}
    >
      <GapView gap="md">
        <OwnerActionSheet actions={actions} />
        {venues.length > 0 ? (
          <GapView gap="sm">
            <SectionTitle>
              {inbox.length > 0 ? `Por confirmar (${inbox.length})` : 'Por confirmar'}
            </SectionTitle>
            {updatedLabel ? <Caption>{updatedLabel}</Caption> : null}

            {inboxLoading && inbox.length === 0 ? <AppSkeleton height={140} rounded="lg" /> : null}

            {inboxError ? (
              <AppAlert
                variant="warning"
                title="No pudimos cargar algunas solicitudes"
                description={humanizeError(inboxError, 'load')}
                action={
                  <AppButton variant="warning" onPress={() => void refreshOwnerData()}>
                    Reintentar
                  </AppButton>
                }
              />
            ) : null}

            {!inboxLoading && !inboxError && inbox.length === 0 ? (
              <Caption>No tienes solicitudes pendientes. Las nuevas aparecerán aquí.</Caption>
            ) : null}

            {visibleInbox.map((item) => (
              <OwnerReservationCard
                key={item.reservation.id}
                reservation={item.reservation}
                venueName={venues.length > 1 ? item.venueName : undefined}
                timeZone={item.timeZone}
                now={now}
                actions={actions}
              />
            ))}

            {hiddenInbox > 0 ? (
              <Caption>
                {`Y ${hiddenInbox} ${hiddenInbox === 1 ? 'solicitud más' : 'solicitudes más'}. Ábrelas desde cada complejo.`}
              </Caption>
            ) : null}
            {venues.length > OWNER_INBOX_MAX_VENUES ? (
              <Caption>{`Mostramos las solicitudes de tus primeros ${OWNER_INBOX_MAX_VENUES} complejos.`}</Caption>
            ) : null}
          </GapView>
        ) : null}

        <SectionTitle>Mis complejos</SectionTitle>

        {venuesQuery.isLoading ? (
          <GapView gap="sm">
            <AppSkeleton height={96} rounded="lg" />
            <AppSkeleton height={96} rounded="lg" />
          </GapView>
        ) : null}

        {venuesQuery.error ? (
          <AppAlert
            variant="warning"
            title="No pudimos cargar tus complejos"
            description={humanizeError(venuesQuery.error, 'load')}
            action={
              <AppButton
                variant="warning"
                onPress={() => {
                  void venuesQuery.refetch();
                }}
              >
                Reintentar
              </AppButton>
            }
          />
        ) : null}

        {!venuesQuery.isLoading && !venuesQuery.error && venues.length === 0 ? (
          <AppEmpty
            title="Aún no tienes complejos"
            description="Crea tu primer complejo para habilitar canchas y recibir reservas."
            icon={<Feather name="plus" size={20} color={theme.colors.brandPrimary} />}
            actionLabel="Crear complejo"
            onAction={() => router.push('/complexes/new')}
          />
        ) : null}

        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            pendingCount={pendingByVenue.get(venue.id) ?? 0}
          />
        ))}

        {venues.length > 0 ? (
          <AppButton variant="neutral" onPress={() => router.push('/complexes/new')}>
            Crear complejo
          </AppButton>
        ) : null}
      </GapView>
    </Screen>
  );
}

function PlayerHome() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const iconColor = theme.colors.brandPrimary;
  const [searchText, setSearchText] = useState('');
  // Search runs on submit, not per keystroke, so typing costs no requests.
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAllVenues, setShowAllVenues] = useState(false);
  const now = useNow(60_000);
  const myReservationsQuery = useMyReservationsQuery({ refetchOnWindowFocus: true });
  const playerVenuesQuery = usePlayerVenuesQuery(searchQuery || undefined);

  const { nextReservation, upcoming, past } = useMemo(() => {
    const all = myReservationsQuery.data ?? [];
    const active = all
      .filter((reservation) => isReservationUpcoming(reservation, now))
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    const activeIds = new Set(active.map((reservation) => reservation.id));
    const history = all
      .filter((reservation) => !activeIds.has(reservation.id))
      .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
    return { nextReservation: active[0] ?? null, upcoming: active.slice(1), past: history };
  }, [myReservationsQuery.data, now]);

  const playerVenues = playerVenuesQuery.data ?? [];
  const visibleVenues = showAllVenues ? playerVenues : playerVenues.slice(0, MAX_VENUES);
  const pullRefresh = usePullRefresh(() =>
    Promise.all([myReservationsQuery.refetch(), playerVenuesQuery.refetch()]),
  );
  const openReservation = (id: string) => router.push(`/reservations/${id}`);
  const submitSearch = () => setSearchQuery(searchText.trim());
  const clearSearch = () => {
    setSearchText('');
    setSearchQuery('');
  };

  const visibleUpcoming = showAllUpcoming ? upcoming : upcoming.slice(0, MAX_UPCOMING);
  const visibleHistory = past.slice(0, MAX_HISTORY);
  const lastPast = past[0] ?? null;
  const firstVenue = playerVenues[0] ?? null;

  let emptyAction: { label: string; onPress: () => void } | null = null;
  if (lastPast?.venue) {
    const venue = lastPast.venue;
    emptyAction = {
      label: `Reservar de nuevo en ${venue.name}`,
      onPress: () =>
        router.push({
          pathname: '/reservations/new',
          params: { ...venueRouteParams(venue), pitchId: lastPast.pitchId },
        }),
    };
  } else if (firstVenue) {
    emptyAction = {
      label: `Ver canchas en ${firstVenue.name}`,
      onPress: () =>
        router.push({ pathname: '/venues/[venueId]', params: venueRouteParams(firstVenue) }),
    };
  }

  return (
    <Screen
      title="Inicio"
      subtitle="Reservas como jugador"
      back={false}
      onRefresh={pullRefresh.onRefresh}
      refreshing={pullRefresh.refreshing}
    >
      <GapView gap="md">
        <SectionTitle>Próxima reserva</SectionTitle>

        {myReservationsQuery.isLoading ? <AppSkeleton height={120} rounded="lg" /> : null}

        {myReservationsQuery.error ? (
          <AppAlert
            variant="warning"
            title="No pudimos cargar tus reservas"
            description={humanizeError(myReservationsQuery.error, 'load')}
            action={
              <AppButton
                variant="warning"
                onPress={() => {
                  void myReservationsQuery.refetch();
                }}
              >
                Reintentar
              </AppButton>
            }
          />
        ) : null}

        {nextReservation ? (
          <ReservationRow
            featured
            reservation={nextReservation}
            onPress={() => openReservation(nextReservation.id)}
          />
        ) : null}

        {!myReservationsQuery.isLoading && !myReservationsQuery.error && !nextReservation ? (
          <AppEmpty
            title="No tienes reservas próximas"
            description="Elige un complejo y reserva tu cancha."
            icon={<Feather name="calendar" size={20} color={iconColor} />}
            {...(emptyAction
              ? { actionLabel: emptyAction.label, onAction: emptyAction.onPress }
              : {})}
          />
        ) : null}

        <SectionTitle>Complejos</SectionTitle>

        <AppInput
          value={searchText}
          onChangeText={(value) => {
            setSearchText(value);
            if (value.trim().length === 0) setSearchQuery('');
          }}
          label="Buscar complejo"
          placeholder="Nombre o zona"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={submitSearch}
          leftIcon={<Feather name="search" size={16} color={theme.colors.muted} />}
          {...(searchText.length > 0
            ? {
                rightIcon: <Feather name="x" size={16} color={theme.colors.muted} />,
                onRightIconPress: clearSearch,
                rightIconAccessibilityLabel: 'Borrar búsqueda',
              }
            : {})}
        />

        {playerVenuesQuery.isLoading ? (
          <GapView gap="sm">
            <AppSkeleton height={96} rounded="lg" />
            <AppSkeleton height={96} rounded="lg" />
          </GapView>
        ) : null}

        {playerVenuesQuery.error ? (
          <AppAlert
            variant="warning"
            title="No pudimos cargar los complejos"
            description={humanizeError(playerVenuesQuery.error, 'load')}
            action={
              <AppButton
                variant="warning"
                onPress={() => {
                  void playerVenuesQuery.refetch();
                }}
              >
                Reintentar
              </AppButton>
            }
          />
        ) : null}

        {!playerVenuesQuery.isLoading && !playerVenuesQuery.error && playerVenues.length === 0 ? (
          searchQuery ? (
            <AppEmpty
              title={`Sin resultados para “${searchQuery}”`}
              description="Prueba con otro nombre o zona."
              icon={<Feather name="search" size={20} color={iconColor} />}
              actionLabel="Ver todos"
              onAction={clearSearch}
            />
          ) : (
            <AppEmpty
              title="No hay complejos disponibles"
              description="Cuando un complejo publique sus canchas, aparecerá aquí."
              icon={<Feather name="map-pin" size={20} color={iconColor} />}
            />
          )
        ) : null}

        {visibleVenues.map((venue) => (
          <PlayerVenueCard key={venue.id} venue={venue} />
        ))}
        {playerVenues.length > MAX_VENUES ? (
          <DisclosureLink
            label={showAllVenues ? 'Ver menos' : `Ver los ${playerVenues.length} complejos`}
            expanded={showAllVenues}
            onPress={() => setShowAllVenues((current) => !current)}
          />
        ) : null}

        {upcoming.length > 0 || past.length > 0 ? <SectionTitle>Mis reservas</SectionTitle> : null}

        {upcoming.length > 0 ? (
          <GapView gap="sm">
            <AppTypography variant="body" color={theme.colors.muted} accessibilityRole="header">
              {`Próximas (${upcoming.length})`}
            </AppTypography>
            {visibleUpcoming.map((reservation) => (
              <ReservationRow
                key={reservation.id}
                reservation={reservation}
                onPress={() => openReservation(reservation.id)}
              />
            ))}
            {upcoming.length > MAX_UPCOMING ? (
              <DisclosureLink
                label={showAllUpcoming ? 'Ver menos' : `Ver las ${upcoming.length} próximas`}
                expanded={showAllUpcoming}
                onPress={() => setShowAllUpcoming((current) => !current)}
              />
            ) : null}
          </GapView>
        ) : null}

        {past.length > 0 ? (
          <GapView gap="sm">
            <DisclosureLink
              label={showHistory ? 'Ocultar historial' : `Ver historial (${past.length})`}
              expanded={showHistory}
              onPress={() => setShowHistory((current) => !current)}
            />
            {showHistory
              ? visibleHistory.map((reservation) => (
                  <ReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    onPress={() => openReservation(reservation.id)}
                  />
                ))
              : null}
            {showHistory && past.length > MAX_HISTORY ? (
              <Caption>{`Mostramos tus últimas ${MAX_HISTORY} reservas.`}</Caption>
            ) : null}
          </GapView>
        ) : null}
      </GapView>
    </Screen>
  );
}
