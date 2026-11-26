'use client';

import { useState, type FormEvent } from 'react';
import { AppButton, AppInput } from '@17suit/ui';
import { InlineError, InlineStatus, SelectField } from '@/components/seven-rc-ui';
import { useCreateVenuePitchMutation } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { SPORT_OPTIONS } from '@/lib/seven-rc-format';

export function CreatePitchForm({ venueId, venueName }: { venueId: string; venueName: string }) {
  const createPitchMutation = useCreateVenuePitchMutation(venueId);
  const [name, setName] = useState('');
  const [sportType, setSportType] = useState('futbol-5');
  const [capacity, setCapacity] = useState('10');
  const [duration, setDuration] = useState('60');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const parsedCapacity = Number(capacity);
    const parsedDuration = Number(duration);
    if (name.trim().length < 2) {
      setError('El nombre de la cancha necesita al menos 2 caracteres.');
      return;
    }
    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 1 || parsedCapacity > 100) {
      setError('La capacidad debe estar entre 1 y 100 jugadores.');
      return;
    }
    if (!Number.isInteger(parsedDuration) || parsedDuration < 30 || parsedDuration > 240) {
      setError('La duración del turno debe estar entre 30 y 240 minutos.');
      return;
    }
    try {
      const created = await createPitchMutation.mutateAsync({
        name: name.trim(),
        sportType,
        capacity: parsedCapacity,
        slotDurationMinutes: parsedDuration,
      });
      setName('');
      setNotice(`Agregaste “${created.name}”. Define su precio y sus horarios arriba.`);
    } catch (caught) {
      setError(describeError(caught, 'No se pudo crear la cancha.'));
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="crear-cancha-title"
      className="grid gap-sm"
    >
      <h3 id="crear-cancha-title" className="m-0 font-arvo text-md text-text">
        Nueva cancha en {venueName}
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <AppInput
          name="pitchName"
          label="Nombre de la cancha"
          placeholder="Ej.: Cancha 1"
          autoComplete="off"
          required
          minLength={2}
          maxLength={120}
          value={name}
          onChangeText={setName}
        />
        <SelectField
          label="Deporte"
          name="sportType"
          value={sportType}
          onChangeValue={setSportType}
          options={SPORT_OPTIONS}
        />
        <AppInput
          type="number"
          name="capacity"
          label="Capacidad (jugadores)"
          inputMode="numeric"
          min={1}
          max={100}
          step={1}
          required
          value={capacity}
          onChangeText={setCapacity}
        />
        <AppInput
          type="number"
          name="slotDurationMinutes"
          label="Duración del turno (minutos)"
          inputMode="numeric"
          min={30}
          max={240}
          step={15}
          required
          value={duration}
          onChangeText={setDuration}
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={createPitchMutation.isPending}>
          {createPitchMutation.isPending ? 'Guardando…' : 'Agregar cancha'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}
