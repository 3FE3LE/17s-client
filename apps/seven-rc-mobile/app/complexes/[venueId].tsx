import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, YStack } from '@17suit/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthTabScreen } from '../../components/auth-tab-screen';
import { useOwnerVenuePitchesQuery, useOwnerVenuesQuery } from '../../lib/owner-queries';

export default function VenueDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const { role } = useCurrentUserRoleQuery();
  const venuesQuery = useOwnerVenuesQuery();
  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);

  const venue = (venuesQuery.data ?? []).find((item) => item.id === venueId);

  if (role !== 'OWNER') {
    return (
      <AuthTabScreen appName="Complejo" subtitle="Solo disponible para cuentas OWNER." role={role}>
        <YStack style={{ gap: 12 }}>
          <AppButton onPress={() => router.replace('/home')}>Volver al inicio</AppButton>
        </YStack>
      </AuthTabScreen>
    );
  }

  return (
    <AuthTabScreen
      appName={venue?.name ?? 'Complejo'}
      subtitle="Listado de canchas del complejo seleccionado."
      role={role}
    >
      <YStack style={{ gap: 12 }}>
        <AppButton onPress={() => router.push(`/complexes/${venueId}/courts/new`)}>
          Crear cancha
        </AppButton>

        {pitchesQuery.isLoading || pitchesQuery.isFetching ? (
          <AppButton variant="neutral" disabled>
            Cargando canchas...
          </AppButton>
        ) : null}

        {!pitchesQuery.isLoading &&
        !pitchesQuery.isFetching &&
        (pitchesQuery.data ?? []).length === 0 ? (
          <AppButton variant="neutral" disabled>
            Este complejo aun no tiene canchas.
          </AppButton>
        ) : null}

        {(pitchesQuery.data ?? []).map((pitch) => (
          <AppButton key={pitch.id} variant="neutral" disabled>
            {`${pitch.name} · ${pitch.sportType} · ${pitch.capacity} jugadores`}
          </AppButton>
        ))}

        {pitchesQuery.error ? (
          <AppButton
            variant="warning"
            onPress={() => {
              void pitchesQuery.refetch();
            }}
          >
            Reintentar carga de canchas
          </AppButton>
        ) : null}

        <AppButton variant="neutral" onPress={() => router.replace('/home')}>
          Volver al listado de complejos
        </AppButton>
      </YStack>
    </AuthTabScreen>
  );
}
