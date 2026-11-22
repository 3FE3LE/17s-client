import { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import { AppAlert, AppEmpty, AppSkeleton, AppSpinner, GapView, useAppTheme } from '@17suit/ui';
import { AppButton, AppInput, AppTypography } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Screen } from '../../../components/screen';
import { useOwnerVenuesQuery } from '../../../lib/owner-queries';
import { VenueCard } from '../../../components/venue-card';
import { useMyReservationsQuery, usePlayerVenuesQuery } from '../../../lib/player-queries';
import { PlayerVenueCard } from '../../../components/player-venue-card';
import { ReservationRow } from '../../../components/reservation-row';
import { humanizeError } from '../../../lib/error-messages';
import { isReservationUpcoming } from '../../../lib/reservation-format';

function SectionTitle({ children }: { children: string }) {
  return (
    <AppTypography variant="subtitle2" accessibilityRole="header" style={{ marginTop: 8 }}>
      {children}
    </AppTypography>
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

function OwnerHome() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const venuesQuery = useOwnerVenuesQuery();
  const venues = venuesQuery.data ?? [];

  return (
    <Screen
      title="Inicio"
      subtitle="Administras tus complejos"
      back={false}
      onRefresh={() => {
        void venuesQuery.refetch();
      }}
      refreshing={venuesQuery.isFetching && !venuesQuery.isLoading}
    >
      <GapView gap="md">
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
          <VenueCard key={venue.id} venue={venue} />
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
  const myReservationsQuery = useMyReservationsQuery();
  const playerVenuesQuery = usePlayerVenuesQuery(searchQuery || undefined);

  const { nextReservation, otherReservations } = useMemo(() => {
    const all = myReservationsQuery.data ?? [];
    const upcoming = all
      .filter((reservation) => isReservationUpcoming(reservation.status, reservation.startAt))
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    const next = upcoming[0] ?? null;
    const rest = all
      .filter((reservation) => reservation.id !== next?.id)
      .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
    return { nextReservation: next, otherReservations: rest };
  }, [myReservationsQuery.data]);

  const playerVenues = playerVenuesQuery.data ?? [];
  const openReservation = (id: string) => router.push(`/reservations/${id}`);
  const submitSearch = () => setSearchQuery(searchText.trim());
  const clearSearch = () => {
    setSearchText('');
    setSearchQuery('');
  };

  return (
    <Screen
      title="Inicio"
      subtitle="Reservas como jugador"
      back={false}
      onRefresh={() => {
        void myReservationsQuery.refetch();
        void playerVenuesQuery.refetch();
      }}
      refreshing={
        (myReservationsQuery.isFetching && !myReservationsQuery.isLoading) ||
        (playerVenuesQuery.isFetching && !playerVenuesQuery.isLoading)
      }
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
          />
        ) : null}

        {otherReservations.length > 0 ? (
          <>
            <SectionTitle>Mis reservas</SectionTitle>
            {otherReservations.map((reservation) => (
              <ReservationRow
                key={reservation.id}
                reservation={reservation}
                onPress={() => openReservation(reservation.id)}
              />
            ))}
          </>
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

        {playerVenues.map((venue) => (
          <PlayerVenueCard key={venue.id} venue={venue} />
        ))}
      </GapView>
    </Screen>
  );
}
