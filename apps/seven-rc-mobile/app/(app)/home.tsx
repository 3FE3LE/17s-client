import {
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppBadge,
  AppButton,
  AppCard,
  AppEmpty,
  AppSeparator,
  AppSkeleton,
  AppSpinner,
  AppTypography,
  GapView,
} from '@17suit/ui';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { AuthTabScreen } from '../../components/auth-tab-screen';
import { useOwnerVenuesQuery } from '../../lib/owner-queries';
import { VenueCard } from '../../components/venue-card';
import { useMyReservationsQuery, usePlayerVenuesQuery } from '../../lib/player-queries';
import { PlayerVenueCard } from '../../components/player-venue-card';

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

function reservationDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function RoleModeBanner({ role }: { role: 'OWNER' | 'PLAYER' }) {
  const isOwner = role === 'OWNER';
  const label = isOwner ? 'Modo OWNER activo' : 'Modo PLAYER activo';
  const detail = isOwner
    ? 'Vista orientada a gestion de complejos y canchas.'
    : 'Vista orientada a exploracion y reservas.';

  return (
    <AppCard tone="accent">
      <GapView gap="sm">
        <AppBadge variant={isOwner ? 'success' : 'info'}>{label}</AppBadge>
        <AppTypography variant="body" color="#cfcfcf">
          {detail}
        </AppTypography>
      </GapView>
    </AppCard>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { role, isLoading, error, refetch } = useCurrentUserRoleQuery({
    userId: user?.id ?? null,
    enabled: Boolean(user?.id),
  });
  const venuesQuery = useOwnerVenuesQuery();
  const myReservationsQuery = useMyReservationsQuery();
  const playerVenuesQuery = usePlayerVenuesQuery();

  // If role is missing once data has loaded, send the user to onboarding.
  useRoleGate({ required: '*', router, onboardingPath: '/role' });

  if (isLoading) {
    return (
      <AuthTabScreen
        appName="Seven Reservations Club"
        subtitle="Loading your home..."
        swipeRoutes={{ left: '/profile' }}
      >
        <GapView gap="md">
          <AppSpinner size={28} />
          <AppTypography variant="body" align="center" color="#cfcfcf">
            Cargando panel...
          </AppTypography>
        </GapView>
      </AuthTabScreen>
    );
  }

  if (role === 'OWNER') {
    const venues = venuesQuery.data ?? [];
    const isLoadingVenues = venuesQuery.isLoading;
    const isRefreshingVenues = venuesQuery.isFetching && !venuesQuery.isLoading;

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

          <AppSeparator />
          <AppTypography variant="subtitle2">Mis complejos</AppTypography>

          {isLoadingVenues || isRefreshingVenues ? (
            <GapView gap="sm">
              <AppSkeleton height={84} rounded="lg" />
              <AppSkeleton height={84} rounded="lg" />
            </GapView>
          ) : null}

          {!isLoadingVenues && venues.length === 0 ? (
            <AppEmpty
              title="Aun no tienes complejos"
              description="Crea el primer complejo para habilitar canchas y reservas."
              icon="+"
              actionLabel="Crear complejo"
              onAction={() => router.push('/complexes/new')}
            />
          ) : null}

          {!isLoadingVenues && venues.length > 0
            ? venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
            : null}

          {!isLoadingVenues && venuesQuery.error ? (
            <AppAlert
              variant="warning"
              title="No se pudo cargar complejos"
              description={
                venuesQuery.error instanceof Error
                  ? venuesQuery.error.message
                  : 'Error desconocido.'
              }
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
        </GapView>
      </AuthTabScreen>
    );
  }

  if (error) {
    const roleErrorMessage =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
        ? ((error as { message: string }).message ?? 'Error desconocido.')
        : 'Error desconocido.';

    return (
      <AuthTabScreen
        appName="Inicio"
        subtitle="No se pudo cargar tu rol, intenta nuevamente."
        swipeRoutes={{ left: '/profile' }}
      >
        <GapView gap="md">
          <AppAlert
            variant="destructive"
            title="Error de rol"
            description={roleErrorMessage}
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
        </GapView>
      </AuthTabScreen>
    );
  }

  const playerVenues = playerVenuesQuery.data ?? [];
  const reservations = myReservationsQuery.data ?? [];

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

        <AppSeparator />
        <AppTypography variant="subtitle2">Complejos disponibles</AppTypography>

        {playerVenuesQuery.isLoading ? (
          <GapView gap="sm">
            <AppSkeleton height={150} rounded="lg" />
            <AppSkeleton height={150} rounded="lg" />
          </GapView>
        ) : null}

        {!playerVenuesQuery.isLoading && playerVenues.length === 0 ? (
          <AppEmpty
            title="No hay complejos disponibles"
            description="Cuando un owner publique su complejo aparecera aqui."
            icon="..."
          />
        ) : null}

        {!playerVenuesQuery.isLoading && playerVenues.length > 0
          ? playerVenues.map((venue) => <PlayerVenueCard key={venue.id} venue={venue} />)
          : null}

        {playerVenuesQuery.error ? (
          <AppAlert
            variant="warning"
            title="Error al cargar complejos"
            description={
              playerVenuesQuery.error instanceof Error
                ? playerVenuesQuery.error.message
                : 'Error desconocido.'
            }
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

        <AppSeparator />
        <AppTypography variant="subtitle2">Mis reservas</AppTypography>

        {myReservationsQuery.isLoading ? (
          <GapView gap="sm">
            <AppSkeleton height={88} rounded="lg" />
            <AppSkeleton height={88} rounded="lg" />
          </GapView>
        ) : null}

        {!myReservationsQuery.isLoading && reservations.length === 0 ? (
          <AppEmpty
            title="No tienes reservas aun"
            description="Explora complejos y crea tu primera reserva."
            icon="..."
          />
        ) : null}

        {reservations.map((reservation) => (
          <AppCard
            key={reservation.id}
            title={`${reservation.venue?.name ?? 'Complejo'} · ${reservation.pitch?.name ?? 'Cancha'}`}
            subtitle={reservationDateLabel(reservation.startAt)}
            footer={
              <AppBadge variant={reservationBadgeVariant(reservation.status)}>
                {formatReservationStatus(reservation.status)}
              </AppBadge>
            }
          />
        ))}

        {myReservationsQuery.error ? (
          <AppAlert
            variant="warning"
            title="Error al cargar reservas"
            description={
              myReservationsQuery.error instanceof Error
                ? myReservationsQuery.error.message
                : 'Error desconocido.'
            }
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
      </GapView>
    </AuthTabScreen>
  );
}
