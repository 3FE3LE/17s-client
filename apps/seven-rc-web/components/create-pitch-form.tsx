'use client';

import { intInRange } from '@17suit/core';
import { AppButton, AppInput } from '@17suit/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { InlineError, InlineStatus, SelectField } from '@/components/seven-rc-ui';
import { useCreateVenuePitchMutation } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { SPORT_OPTIONS } from '@/lib/seven-rc-format';

const createPitchSchema = z.object({
  name: z.string().trim().min(2, 'El nombre de la cancha necesita al menos 2 caracteres.').max(120),
  sportType: z.string().min(1),
  capacity: intInRange(1, 100, 'La capacidad debe estar entre 1 y 100 jugadores.'),
  duration: intInRange(30, 240, 'La duración del turno debe estar entre 30 y 240 minutos.'),
});
type CreatePitchValues = z.infer<typeof createPitchSchema>;

export function CreatePitchForm({ venueId, venueName }: { venueId: string; venueName: string }) {
  const createPitchMutation = useCreateVenuePitchMutation(venueId);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, reset, getValues, formState } = useForm<CreatePitchValues>({
    resolver: zodResolver(createPitchSchema),
    defaultValues: { name: '', sportType: 'futbol-5', capacity: '10', duration: '60' },
  });

  const isSaving = formState.isSubmitting || createPitchMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setNotice(null);
    try {
      const created = await createPitchMutation.mutateAsync({
        name: values.name,
        sportType: values.sportType,
        capacity: Number(values.capacity),
        slotDurationMinutes: Number(values.duration),
      });
      reset({ ...getValues(), name: '' });
      setNotice(`Agregaste “${created.name}”. Define su precio y sus horarios arriba.`);
    } catch (caught) {
      setError(describeError(caught, 'No se pudo crear la cancha.'));
    }
  });

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      noValidate
      aria-labelledby="crear-cancha-title"
      className="grid gap-sm"
    >
      <h3 id="crear-cancha-title" className="m-0 font-arvo text-md text-text">
        Nueva cancha en {venueName}
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="grid content-start gap-xs">
              <AppInput
                name="pitchName"
                label="Nombre de la cancha"
                placeholder="Ej.: Cancha 1"
                autoComplete="off"
                maxLength={120}
                error={fieldState.invalid}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <InlineError message={fieldState.error?.message ?? null} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="sportType"
          render={({ field }) => (
            <SelectField
              label="Deporte"
              name="sportType"
              value={field.value}
              onChangeValue={field.onChange}
              options={SPORT_OPTIONS}
            />
          )}
        />
        <Controller
          control={control}
          name="capacity"
          render={({ field, fieldState }) => (
            <div className="grid content-start gap-xs">
              <AppInput
                type="number"
                name="capacity"
                label="Capacidad (jugadores)"
                inputMode="numeric"
                min={1}
                max={100}
                step={1}
                error={fieldState.invalid}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <InlineError message={fieldState.error?.message ?? null} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="duration"
          render={({ field, fieldState }) => (
            <div className="grid content-start gap-xs">
              <AppInput
                type="number"
                name="slotDurationMinutes"
                label="Duración del turno (minutos)"
                inputMode="numeric"
                min={30}
                max={240}
                step={15}
                error={fieldState.invalid}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <InlineError message={fieldState.error?.message ?? null} />
            </div>
          )}
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={isSaving}>
          {isSaving ? 'Guardando…' : 'Agregar cancha'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}
