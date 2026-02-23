import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, GapView } from '@17suit/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { AuthTabScreen } from '../../../components/auth-tab-screen';
import {
  useOwnerVenuePitchesQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
} from '../../../lib/owner-queries';
import { useMemo } from 'react';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function VenueDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const { user } = useUser();
  const { role } = useCurrentUserRoleQuery({ userId: user?.id, enabled: Boolean(user?.id) });
  const venuesQuery = useOwnerVenuesQuery();
  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
  const today = useMemo(() => formatDate(new Date()), []);
  const reservationsQuery = useOwnerVenueReservationsQuery(venueId, today, today);

  const venue = (venuesQuery.data ?? []).find((item) => item.id === venueId);

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
      subtitle="Listado de canchas del complejo seleccionado."
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
          <GapView key={pitch.id} gap="sm">
            <AppButton variant="neutral" disabled>
              {`${pitch.name} · ${pitch.sportType} · ${pitch.capacity} jugadores`}
            </AppButton>
            <AppButton
              variant="info"
              onPress={() => router.push(`/complexes/${venueId}/courts/${pitch.id}/slots`)}
            >
              Configurar horarios
            </AppButton>
          </GapView>
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

        <GapView gap="sm">
          <AppButton variant="neutral" disabled>
            Reservas de hoy
          </AppButton>
          {reservationsQuery.isLoading ? (
            <AppButton variant="neutral" disabled>
              Cargando reservas...
            </AppButton>
          ) : null}
          {!reservationsQuery.isLoading && (reservationsQuery.data ?? []).length === 0 ? (
            <AppButton variant="neutral" disabled>
              Sin reservas para hoy.
            </AppButton>
          ) : null}
          {(reservationsQuery.data ?? []).map((reservation) => (
            <AppButton key={reservation.id} variant="neutral" disabled>
              {`${reservation.pitch?.name ?? 'Cancha'} · ${formatTime(reservation.startAt)} - ${formatTime(
                reservation.endAt,
              )} · ${reservation.status}`}
            </AppButton>
          ))}
          {reservationsQuery.error ? (
            <AppButton
              variant="warning"
              onPress={() => {
                void reservationsQuery.refetch();
              }}
            >
              Reintentar carga de reservas
            </AppButton>
          ) : null}
        </GapView>

        <AppButton variant="neutral" onPress={() => router.replace('/home')}>
          Volver al listado de complejos
        </AppButton>
      </GapView>
    </AuthTabScreen>
  );
}
