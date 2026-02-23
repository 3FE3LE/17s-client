import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, GapView } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { AuthTabScreen } from '../../components/auth-tab-screen';
import { useOwnerVenuesQuery } from '../../lib/owner-queries';
import { VenueCard } from '../../components/venue-card';
import { useMyReservationsQuery, usePlayerVenuesQuery } from '../../lib/player-queries';
import { PlayerVenueCard } from '../../components/player-venue-card';

function RoleModeBanner({ role }: { role: 'OWNER' | 'PLAYER' }) {
  const isOwner = role === 'OWNER';
  const label = isOwner ? 'Modo OWNER activo' : 'Modo PLAYER activo';
  const detail = isOwner
    ? 'Vista orientada a gestion de complejos y canchas.'
    : 'Vista orientada a exploracion y reservas.';

  return (
    <GapView gap="sm">
      <AppButton variant={isOwner ? 'success' : 'info'} disabled>
        {label}
      </AppButton>
      <AppButton variant="neutral" disabled>
        {detail}
      </AppButton>
    </GapView>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { role, isLoading, error, refetch } = useCurrentUserRoleQuery({
    userId: user?.id,
    enabled: Boolean(user?.id),
  });
  const venuesQuery = useOwnerVenuesQuery();
  const myReservationsQuery = useMyReservationsQuery();
  const playerVenuesQuery = usePlayerVenuesQuery();

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    if (!isLoading && !error && !role) {
      console.log('[nav] home -> /role');
      router.replace('/role');
    }
  }, [error, isLoading, isSignedIn, role, router]);

  if (isLoading) {
    return (
      <AuthTabScreen
        appName="Seven Reservations Club"
        subtitle="Loading your home..."
        swipeRoutes={{ left: '/profile' }}
      >
        <></>
      </AuthTabScreen>
    );
  }

  if (role === 'OWNER') {
    const venues = venuesQuery.data ?? [];
    const isLoadingVenues = venuesQuery.isLoading;
    const isRefreshingVenues = venuesQuery.isFetching && !venuesQuery.isLoading;
    const hasVenues = venues.length > 0;

    return (
      <AuthTabScreen
        appName="Inicio"
        subtitle="Panel inicial para duenos de complejo"
        role={role}
        swipeRoutes={{ left: '/profile' }}
        onRefresh={() => venuesQuery.refetch()}
        refreshing={venuesQuery.isFetching}
      >
        <GapView gap="md">
          <RoleModeBanner role="OWNER" />

          <AppButton onPress={() => router.push('/complexes/new')}>Crear complejo</AppButton>

          {isLoadingVenues ? (
            <AppButton variant="neutral" disabled>
              Cargando complejos...
            </AppButton>
          ) : null}
          {isRefreshingVenues ? (
            <AppButton variant="neutral" disabled>
              Actualizando complejos...
            </AppButton>
          ) : null}

          {!isLoadingVenues && !hasVenues ? (
            <AppButton variant="neutral" disabled>
              Aun no tienes complejos. Crea el primero para habilitar canchas.
            </AppButton>
          ) : null}

          {!isLoadingVenues && hasVenues
            ? venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
            : null}

          {!isLoadingVenues && venuesQuery.error ? (
            <AppButton
              variant="warning"
              onPress={() => {
                void venuesQuery.refetch();
              }}
            >
              Reintentar carga de complejos
            </AppButton>
          ) : null}
        </GapView>
      </AuthTabScreen>
    );
  }

  if (error) {
    return (
      <AuthTabScreen
        appName="Inicio"
        subtitle="No se pudo cargar tu rol, intenta nuevamente."
        swipeRoutes={{ left: '/profile' }}
      >
        <GapView gap="md">
          <AppButton
            onPress={() => {
              void refetch();
            }}
          >
            Reintentar
          </AppButton>
        </GapView>
      </AuthTabScreen>
    );
  }

  const playerVenues = playerVenuesQuery.data ?? [];

  return (
    <AuthTabScreen
      appName="Inicio"
      subtitle="Panel inicial para jugadores"
      role={role}
      swipeRoutes={{ left: '/profile' }}
      onRefresh={() => {
        void myReservationsQuery.refetch();
        void playerVenuesQuery.refetch();
      }}
      refreshing={myReservationsQuery.isFetching || playerVenuesQuery.isFetching}
    >
      <GapView gap="md">
        <RoleModeBanner role="PLAYER" />

        <AppButton variant="neutral" disabled>
          Complejos disponibles
        </AppButton>
        {playerVenuesQuery.isLoading ? (
          <AppButton variant="neutral" disabled>
            Cargando complejos...
          </AppButton>
        ) : null}
        {!playerVenuesQuery.isLoading && playerVenues.length === 0 ? (
          <AppButton variant="neutral" disabled>
            No hay complejos disponibles todavia.
          </AppButton>
        ) : null}
        {!playerVenuesQuery.isLoading && playerVenuesQuery.error ? (
          <AppButton variant="warning" disabled>
            {`Error al cargar complejos: ${
              playerVenuesQuery.error instanceof Error
                ? playerVenuesQuery.error.message
                : 'Desconocido'
            }`}
          </AppButton>
        ) : null}
        {!playerVenuesQuery.isLoading && playerVenues.length > 0
          ? playerVenues.map((venue) => <PlayerVenueCard key={venue.id} venue={venue} />)
          : null}
        {playerVenuesQuery.error ? (
          <AppButton
            variant="warning"
            onPress={() => {
              void playerVenuesQuery.refetch();
            }}
          >
            Reintentar carga de complejos
          </AppButton>
        ) : null}

        <AppButton variant="neutral" disabled>
          Mis reservas
        </AppButton>
        {myReservationsQuery.isLoading ? (
          <AppButton variant="neutral" disabled>
            Cargando reservas...
          </AppButton>
        ) : null}
        {!myReservationsQuery.isLoading && (myReservationsQuery.data ?? []).length === 0 ? (
          <AppButton variant="neutral" disabled>
            No tienes reservas aun.
          </AppButton>
        ) : null}
        {(myReservationsQuery.data ?? []).map((reservation) => (
          <AppButton key={reservation.id} variant="neutral" disabled>
            {`${reservation.venue?.name ?? 'Complejo'} · ${reservation.pitch?.name ?? 'Cancha'} · ${reservation.status}`}
          </AppButton>
        ))}
        {myReservationsQuery.error ? (
          <AppButton
            variant="warning"
            onPress={() => {
              void myReservationsQuery.refetch();
            }}
          >
            Reintentar carga de reservas
          </AppButton>
        ) : null}
      </GapView>
    </AuthTabScreen>
  );
}
