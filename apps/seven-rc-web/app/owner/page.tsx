'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';
import {
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppFrame, AppInput } from '@17suit/ui';
import {
  useConfirmVenueReservationMutation,
  useConfigurePitchSlotsMutation,
  useCreateVenueMutation,
  useCreateVenuePitchMutation,
  useOwnerVenuePitchesQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
  useRejectVenueReservationMutation,
  type VenueReservation,
} from '@/lib/owner-queries';

function formatDate(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function reservationStatusLabel(status: string): string {
  return status.replaceAll('_', ' ');
}

export default function OwnerPage() {
  const router = useRouter();
  const { role, isLoading } = useCurrentUserRoleQuery();
  const venuesQuery = useOwnerVenuesQuery();

  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueLocation, setNewVenueLocation] = useState('');
  const [newVenueTimezone, setNewVenueTimezone] = useState('');

  const venues = venuesQuery.data ?? [];
  const [explicitVenueId, setExplicitVenueId] = useState<string | null>(null);
  const selectedVenueId = explicitVenueId ?? venues[0]?.id ?? '';

  const [newPitchName, setNewPitchName] = useState('');
  const [newPitchSportType, setNewPitchSportType] = useState('padel');
  const [newPitchCapacity, setNewPitchCapacity] = useState('4');
  const [newPitchDuration, setNewPitchDuration] = useState('60');

  const pitchesQuery = useOwnerVenuePitchesQuery(selectedVenueId || null);
  const pitches = pitchesQuery.data ?? [];
  const [explicitPitchId, setExplicitPitchId] = useState<string | null>(null);
  const selectedPitchId = explicitPitchId ?? pitches[0]?.id ?? '';

  const [slotDayOfWeek, setSlotDayOfWeek] = useState('1');
  const [slotOpenTime, setSlotOpenTime] = useState('10:00');
  const [slotCloseTime, setSlotCloseTime] = useState('22:00');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState('60');

  const dateRangeDefault = useMemo(
    () => ({
      from: formatDate(addDays(new Date(), -30)),
      to: formatDate(addDays(new Date(), 60)),
    }),
    [],
  );
  const [dateFrom, setDateFrom] = useState(dateRangeDefault.from);
  const [dateTo, setDateTo] = useState(dateRangeDefault.to);
  const reservationsQuery = useOwnerVenueReservationsQuery(
    selectedVenueId || null,
    dateFrom,
    dateTo,
  );

  const createVenueMutation = useCreateVenueMutation();
  const createPitchMutation = useCreateVenuePitchMutation(selectedVenueId || 'missing');
  const configureSlotsMutation = useConfigurePitchSlotsMutation(
    selectedPitchId || 'missing',
    selectedVenueId || null,
  );
  const confirmReservationMutation = useConfirmVenueReservationMutation(selectedVenueId || null);
  const rejectReservationMutation = useRejectVenueReservationMutation(selectedVenueId || null);
  const [reservationActionId, setReservationActionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useRoleGate({ required: 'OWNER', router });

  const isRoleAllowed = !isLoading && role === 'OWNER';

  if (!isRoleAllowed) {
    return (
      <AppFrame appName="Owner Dashboard" subtitle="Verificando tu rol...">
        <p>Un momento...</p>
      </AppFrame>
    );
  }

  async function onCreateVenue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await createVenueMutation.mutateAsync({
        name: newVenueName.trim(),
        ...(newVenueLocation.trim() ? { location: newVenueLocation.trim() } : {}),
        ...(newVenueTimezone.trim() ? { timezone: newVenueTimezone.trim() } : {}),
      });
      setNewVenueName('');
      setNewVenueLocation('');
      setNewVenueTimezone('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo crear el complejo.');
    }
  }

  async function onCreatePitch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedVenueId) {
      setErrorMessage('Selecciona un complejo antes de crear una cancha.');
      return;
    }

    setErrorMessage(null);

    try {
      const created = await createPitchMutation.mutateAsync({
        name: newPitchName.trim(),
        sportType: newPitchSportType.trim(),
        capacity: Number(newPitchCapacity) || 4,
        slotDurationMinutes: Number(newPitchDuration) || 60,
      });
      setExplicitPitchId(created.id);
      setNewPitchName('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo crear la cancha.');
    }
  }

  async function onConfigureSlots(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPitchId) {
      setErrorMessage('Selecciona una cancha para configurar horarios.');
      return;
    }

    setErrorMessage(null);
    try {
      const payload: {
        openingHours: Array<{ dayOfWeek: number; openTime: string; closeTime: string }>;
        slotDurationMinutes?: number;
      } = {
        openingHours: [
          {
            dayOfWeek: Number(slotDayOfWeek),
            openTime: slotOpenTime,
            closeTime: slotCloseTime,
          },
        ],
      };

      const parsedDuration = Number(slotDurationMinutes);
      if (Number.isFinite(parsedDuration) && parsedDuration > 0) {
        payload.slotDurationMinutes = parsedDuration;
      }

      await configureSlotsMutation.mutateAsync(payload);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'No se pudieron configurar los horarios.',
      );
    }
  }

  async function onConfirmReservation(reservationId: string) {
    setErrorMessage(null);
    setReservationActionId(reservationId);
    try {
      await confirmReservationMutation.mutateAsync(reservationId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo confirmar la reserva.');
    } finally {
      setReservationActionId(null);
    }
  }

  async function onRejectReservation(reservationId: string) {
    setErrorMessage(null);
    setReservationActionId(reservationId);
    try {
      await rejectReservationMutation.mutateAsync(reservationId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo rechazar la reserva.');
    } finally {
      setReservationActionId(null);
    }
  }

  const reservations = reservationsQuery.data ?? [];
  const pendingReservations = reservations.filter(
    (reservation: VenueReservation) => reservation.status === 'pending_confirmation',
  );

  return (
    <AppFrame
      appName="Owner Dashboard"
      subtitle="Gestiona complejos, canchas, horarios y reservas pendientes."
    >
      <div style={{ display: 'grid', gap: 16 }}>
        {errorMessage ? (
          <div style={{ border: '1px solid #f8333c', padding: 12, borderRadius: 8 }}>
            {errorMessage}
          </div>
        ) : null}

        <section style={{ display: 'grid', gap: 10 }}>
          <h3 style={{ margin: 0 }}>Crear complejo</h3>
          <form onSubmit={onCreateVenue} style={{ display: 'grid', gap: 8 }}>
            <AppInput
              value={newVenueName}
              onChangeText={setNewVenueName}
              placeholder="Nombre del complejo"
              required
            />
            <AppInput
              value={newVenueLocation}
              onChangeText={setNewVenueLocation}
              placeholder="Direccion (opcional)"
            />
            <AppInput
              value={newVenueTimezone}
              onChangeText={setNewVenueTimezone}
              placeholder="Timezone (opcional, ej: America/Bogota)"
            />
            <AppButton disabled={createVenueMutation.isPending || newVenueName.trim().length < 3}>
              {createVenueMutation.isPending ? 'Guardando...' : 'Guardar complejo'}
            </AppButton>
          </form>
        </section>

        <section style={{ display: 'grid', gap: 10 }}>
          <h3 style={{ margin: 0 }}>Complejo activo</h3>
          <select
            value={selectedVenueId}
            onChange={(event) => setExplicitVenueId(event.target.value || null)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #394448' }}
          >
            <option value="">Selecciona un complejo</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
          <AppButton variant="neutral" onPress={() => venuesQuery.refetch()}>
            Refrescar complejos
          </AppButton>
        </section>

        <section style={{ display: 'grid', gap: 10 }}>
          <h3 style={{ margin: 0 }}>Crear cancha</h3>
          <form onSubmit={onCreatePitch} style={{ display: 'grid', gap: 8 }}>
            <AppInput
              value={newPitchName}
              onChangeText={setNewPitchName}
              placeholder="Nombre de la cancha"
              required
            />
            <AppInput
              value={newPitchSportType}
              onChangeText={setNewPitchSportType}
              placeholder="Deporte (padel, tenis, futbol-5...)"
              required
            />
            <AppInput
              type="number"
              value={newPitchCapacity}
              onChangeText={setNewPitchCapacity}
              placeholder="Capacidad"
              required
            />
            <AppInput
              type="number"
              value={newPitchDuration}
              onChangeText={setNewPitchDuration}
              placeholder="Duracion por turno (min)"
              required
            />
            <AppButton
              disabled={
                createPitchMutation.isPending || !selectedVenueId || newPitchName.trim().length < 2
              }
            >
              {createPitchMutation.isPending ? 'Creando...' : 'Guardar cancha'}
            </AppButton>
          </form>
        </section>

        <section style={{ display: 'grid', gap: 10 }}>
          <h3 style={{ margin: 0 }}>Configurar horarios</h3>
          <select
            value={selectedPitchId}
            onChange={(event) => setExplicitPitchId(event.target.value || null)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #394448' }}
          >
            <option value="">Selecciona una cancha</option>
            {pitches.map((pitch) => (
              <option key={pitch.id} value={pitch.id}>
                {pitch.name}
              </option>
            ))}
          </select>

          <form onSubmit={onConfigureSlots} style={{ display: 'grid', gap: 8 }}>
            <label>
              Dia de semana
              <select
                value={slotDayOfWeek}
                onChange={(event) => setSlotDayOfWeek(event.target.value)}
                style={{ marginLeft: 8, padding: 6 }}
              >
                <option value="0">Domingo</option>
                <option value="1">Lunes</option>
                <option value="2">Martes</option>
                <option value="3">Miercoles</option>
                <option value="4">Jueves</option>
                <option value="5">Viernes</option>
                <option value="6">Sabado</option>
              </select>
            </label>
            <AppInput type="time" value={slotOpenTime} onChangeText={setSlotOpenTime} required />
            <AppInput type="time" value={slotCloseTime} onChangeText={setSlotCloseTime} required />
            <AppInput
              type="number"
              value={slotDurationMinutes}
              onChangeText={setSlotDurationMinutes}
              placeholder="Duracion por turno (min)"
            />
            <AppButton disabled={configureSlotsMutation.isPending || !selectedPitchId}>
              {configureSlotsMutation.isPending ? 'Guardando...' : 'Guardar horarios'}
            </AppButton>
          </form>
        </section>

        <section style={{ display: 'grid', gap: 10 }}>
          <h3 style={{ margin: 0 }}>Reservas del complejo</h3>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <AppInput type="date" value={dateFrom} onChangeText={setDateFrom} />
            <AppInput type="date" value={dateTo} onChangeText={setDateTo} />
          </div>
          <AppButton variant="neutral" onPress={() => reservationsQuery.refetch()}>
            Refrescar reservas
          </AppButton>

          <h4 style={{ margin: 0 }}>Pendientes ({pendingReservations.length})</h4>
          {pendingReservations.length === 0 ? (
            <p style={{ margin: 0 }}>No hay pendientes.</p>
          ) : null}
          {pendingReservations.map((reservation) => (
            <div
              key={reservation.id}
              style={{
                display: 'grid',
                gap: 6,
                border: '1px solid #394448',
                borderRadius: 8,
                padding: 10,
              }}
            >
              <strong>{reservation.pitch?.name ?? 'Cancha'}</strong>
              <span>{new Date(reservation.startAt).toLocaleString()}</span>
              <span>Estado: {reservationStatusLabel(reservation.status)}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <AppButton
                  variant="success"
                  disabled={reservationActionId === reservation.id}
                  onPress={() => {
                    void onConfirmReservation(reservation.id);
                  }}
                >
                  Confirmar
                </AppButton>
                <AppButton
                  variant="destructive"
                  disabled={reservationActionId === reservation.id}
                  onPress={() => {
                    void onRejectReservation(reservation.id);
                  }}
                >
                  Rechazar
                </AppButton>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppFrame>
  );
}
