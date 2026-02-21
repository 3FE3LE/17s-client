import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, YStack } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { AuthTabScreen } from '../components/auth-tab-screen';
import { useOwnerVenuesQuery } from '../lib/owner-queries';

function RoleModeBanner({ role }: { role: 'OWNER' | 'PLAYER' }) {
  const isOwner = role === 'OWNER';
  const label = isOwner ? 'Modo OWNER activo' : 'Modo PLAYER activo';
  const detail = isOwner
    ? 'Vista orientada a gestion de complejos y canchas.'
    : 'Vista orientada a exploracion y reservas.';

  return (
    <YStack style={{ gap: 8 }}>
      <AppButton variant={isOwner ? 'success' : 'info'} disabled>
        {label}
      </AppButton>
      <AppButton variant="neutral" disabled>
        {detail}
      </AppButton>
    </YStack>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { role, isLoading, error, refetch } = useCurrentUserRoleQuery();
  const venuesQuery = useOwnerVenuesQuery();

  if (isLoading) {
    return (
      <AuthTabScreen appName="Seven Reservations Club" subtitle="Loading your home...">
        <></>
      </AuthTabScreen>
    );
  }

  if (role === 'OWNER') {
    const venues = venuesQuery.data ?? [];
    const isLoadingVenues = venuesQuery.isLoading || venuesQuery.isFetching;
    const hasVenues = venues.length > 0;

    return (
      <AuthTabScreen appName="Inicio" subtitle="Panel inicial para duenos de complejo" role={role}>
        <YStack style={{ gap: 12 }}>
          <RoleModeBanner role="OWNER" />

          <AppButton onPress={() => router.push('/complexes/new')}>Crear complejo</AppButton>

          {isLoadingVenues ? (
            <AppButton variant="neutral" disabled>
              Cargando complejos...
            </AppButton>
          ) : null}

          {!isLoadingVenues && !hasVenues ? (
            <AppButton variant="neutral" disabled>
              Aun no tienes complejos. Crea el primero para habilitar canchas.
            </AppButton>
          ) : null}

          {!isLoadingVenues && hasVenues
            ? venues.map((venue) => (
                <AppButton
                  key={venue.id}
                  variant="neutral"
                  onPress={() => router.push(`/complexes/${venue.id}`)}
                >
                  {`${venue.name} · ${venue._count?.pitches ?? 0} canchas`}
                </AppButton>
              ))
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
        </YStack>
      </AuthTabScreen>
    );
  }

  if (error) {
    return (
      <AuthTabScreen appName="Inicio" subtitle="No se pudo cargar tu rol, intenta nuevamente.">
        <YStack style={{ gap: 12 }}>
          <AppButton
            onPress={() => {
              void refetch();
            }}
          >
            Reintentar
          </AppButton>
        </YStack>
      </AuthTabScreen>
    );
  }

  return (
    <AuthTabScreen appName="Inicio" subtitle="Panel inicial para jugadores" role={role}>
      <YStack style={{ gap: 12 }}>
        <RoleModeBanner role="PLAYER" />
        <AppButton onPress={() => Alert.alert('Player', 'Buscar complejo (pendiente)')}>
          Buscar complejo
        </AppButton>
        <AppButton onPress={() => Alert.alert('Player', 'Reservar (pendiente)')}>
          Reservar
        </AppButton>
      </YStack>
    </AuthTabScreen>
  );
}
