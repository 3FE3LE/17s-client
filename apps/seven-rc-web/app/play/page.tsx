'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppFrame, AppInput } from '@17suit/ui';
import { getRoleHomePath } from '@/lib/role';
import {
  useCancelReservationMutation,
  useCreateReservationMutation,
  useMyReservationsQuery,
  usePlayerVenuePitchesQuery,
  usePlayerVenuesQuery,
} from '@/lib/player-queries';

function toIsoFromDateTime(date: string, time: string): string | null {
  if (!date || !time) return null;
  const value = new Date(`${date}T${time}:00`);
  if (Number.isNaN(value.getTime())) return null;
  return value.toISOString();
}

function addMinutes(iso: string, minutes: number): string | null {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return null;
  const next = new Date(value.getTime() + minutes * 60_000);
  return next.toISOString();
}

function statusLabel(status: string): string {
  return status.replaceAll('_', ' ');
}

export default function PlayPage() {
  const router = useRouter();
  const { role, isLoading } = useCurrentUserRoleQuery();
  const [query, setQuery] = useState('');
  const venuesQuery = usePlayerVenuesQuery(query.trim() || undefined);
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const pitchesQuery = usePlayerVenuePitchesQuery(selectedVenueId || null);
  const [selectedPitchId, setSelectedPitchId] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [slotCount, setSlotCount] = useState('1');
  const [invitedCount, setInvitedCount] = useState('0');
  const [notes, setNotes] = useState('');
  const myReservationsQuery = useMyReservationsQuery();
  const createReservationMutation = useCreateReservationMutation();
  const cancelReservationMutation = useCancelReservationMutation();
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!role) {
      router.replace('/onboarding/role');
      return;
    }

    if (role !== 'PLAYER') {
      router.replace(getRoleHomePath(role));
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    if (!selectedVenueId && venuesQuery.data && venuesQuery.data.length > 0) {
      setSelectedVenueId(venuesQuery.data[0]?.id ?? '');
    }
  }, [selectedVenueId, venuesQuery.data]);

  useEffect(() => {
    if (!selectedPitchId && pitchesQuery.data && pitchesQuery.data.length > 0) {
      setSelectedPitchId(pitchesQuery.data[0]?.id ?? '');
    }
  }, [pitchesQuery.data, selectedPitchId]);

  if (isLoading || role !== 'PLAYER') {
    return (
      <AppFrame appName="Player Dashboard" subtitle="Verificando tu rol...">
        <p>Un momento...</p>
      </AppFrame>
    );
  }

  const selectedPitch = (pitchesQuery.data ?? []).find((pitch) => pitch.id === selectedPitchId);
  const slotDuration = selectedPitch?.slotDurationMinutes ?? 60;

  async function onCreateReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!selectedPitchId) {
      setErrorMessage('Selecciona una cancha para reservar.');
      return;
    }

    const startAt = toIsoFromDateTime(reservationDate, reservationTime);
    if (!startAt) {
      setErrorMessage('Selecciona fecha y hora validas.');
      return;
    }

    const slots = Math.max(1, Number(slotCount) || 1);
    const endAt = addMinutes(startAt, slotDuration * slots);
    if (!endAt) {
      setErrorMessage('No se pudo calcular la hora de fin.');
      return;
    }

    try {
      await createReservationMutation.mutateAsync({
        pitchId: selectedPitchId,
        startAt,
        endAt,
        ...(Number(invitedCount) > 0 ? { invitedCount: Number(invitedCount) } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      setNotes('');
      void myReservationsQuery.refetch();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo crear la reserva.');
    }
  }

  async function onCancelReservation(reservationId: string) {
    setErrorMessage(null);
    setCancelReservationId(reservationId);
    try {
      await cancelReservationMutation.mutateAsync(reservationId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo cancelar la reserva.');
    } finally {
      setCancelReservationId(null);
    }
  }

  const estimatedEndAt = useMemo(() => {
    const start = toIsoFromDateTime(reservationDate, reservationTime);
    if (!start) return null;
    const slots = Math.max(1, Number(slotCount) || 1);
    return addMinutes(start, slotDuration * slots);
  }, [reservationDate, reservationTime, slotCount, slotDuration]);

  return (
    <AppFrame appName="Player Dashboard" subtitle="Busca complejos y gestiona tus reservas.">
      <div style={{ display: 'grid', gap: 16 }}>
        {errorMessage ? (
          <div style={{ border: '1px solid #f8333c', padding: 12, borderRadius: 8 }}>
            {errorMessage}
          </div>
        ) : null}

        <section style={{ display: 'grid', gap: 8 }}>
          <h3 style={{ margin: 0 }}>Buscar complejos</h3>
          <AppInput
            value={query}
            onChangeText={setQuery}
            placeholder="Nombre o direccion del complejo"
          />
          <AppButton variant="neutral" onPress={() => venuesQuery.refetch()}>
            Refrescar busqueda
          </AppButton>
          <select
            value={selectedVenueId}
            onChange={(event) => setSelectedVenueId(event.target.value)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #394448' }}
          >
            <option value="">Selecciona un complejo</option>
            {(venuesQuery.data ?? []).map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </section>

        <section style={{ display: 'grid', gap: 8 }}>
          <h3 style={{ margin: 0 }}>Crear reserva</h3>
          <form onSubmit={onCreateReservation} style={{ display: 'grid', gap: 8 }}>
            <select
              value={selectedPitchId}
              onChange={(event) => setSelectedPitchId(event.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #394448' }}
            >
              <option value="">Selecciona una cancha</option>
              {(pitchesQuery.data ?? []).map((pitch) => (
                <option key={pitch.id} value={pitch.id}>
                  {pitch.name} ({pitch.slotDurationMinutes} min)
                </option>
              ))}
            </select>
            <AppInput
              type="date"
              value={reservationDate}
              onChangeText={setReservationDate}
              required
            />
            <AppInput
              type="time"
              value={reservationTime}
              onChangeText={setReservationTime}
              required
            />
            <AppInput
              type="number"
              value={slotCount}
              onChangeText={setSlotCount}
              placeholder="Cantidad de turnos"
              required
            />
            <AppInput
              type="number"
              value={invitedCount}
              onChangeText={setInvitedCount}
              placeholder="Invitados extra (opcional)"
            />
            <AppInput value={notes} onChangeText={setNotes} placeholder="Notas (opcional)" />
            {estimatedEndAt ? (
              <p style={{ margin: 0 }}>Fin estimado: {new Date(estimatedEndAt).toLocaleString()}</p>
            ) : null}
            <AppButton disabled={createReservationMutation.isPending || !selectedPitchId}>
              {createReservationMutation.isPending ? 'Reservando...' : 'Confirmar reserva'}
            </AppButton>
          </form>
        </section>

        <section style={{ display: 'grid', gap: 8 }}>
          <h3 style={{ margin: 0 }}>Mis reservas</h3>
          <AppButton variant="neutral" onPress={() => myReservationsQuery.refetch()}>
            Refrescar reservas
          </AppButton>
          {(myReservationsQuery.data ?? []).length === 0 ? (
            <p style={{ margin: 0 }}>Aun no tienes reservas.</p>
          ) : null}
          {(myReservationsQuery.data ?? []).map((reservation) => {
            const canCancel =
              reservation.status === 'pending_confirmation' || reservation.status === 'confirmed';

            return (
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
                <strong>
                  {reservation.venue?.name ?? 'Complejo'} - {reservation.pitch?.name ?? 'Cancha'}
                </strong>
                <span>{new Date(reservation.startAt).toLocaleString()}</span>
                <span>Estado: {statusLabel(reservation.status)}</span>
                {canCancel ? (
                  <AppButton
                    variant="destructive"
                    disabled={cancelReservationId === reservation.id}
                    onPress={() => {
                      void onCancelReservation(reservation.id);
                    }}
                  >
                    {cancelReservationId === reservation.id ? 'Cancelando...' : 'Cancelar'}
                  </AppButton>
                ) : null}
              </div>
            );
          })}
        </section>
      </div>
    </AppFrame>
  );
}
