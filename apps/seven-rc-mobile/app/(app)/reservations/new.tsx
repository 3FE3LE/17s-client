/* eslint-disable no-restricted-syntax -- TODO(useEffect): migrate to RSC / event handlers / derived state per audit policy. */
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  AppButton,
  AppFrame,
  AppInput,
  AppSelect,
  GapView,
  useAppToast,
  useAppTheme,
} from '@17suit/ui';
import {
  usePlayerVenuePitchesQuery,
  useCreateReservationMutation,
} from '../../../lib/player-queries';
import { Text } from 'react-native';

const reservationSchema = z.object({
  pitchId: z.string().trim().min(1, 'Selecciona una cancha.'),
  startAt: z.string().trim().min(1, 'Ingresa la hora de inicio.'),
  slotCount: z.string().trim().min(1, 'Selecciona la cantidad de turnos.'),
  invitedCount: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

function toOptionalNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.max(0, Math.floor(parsed));
}

function formatDate(value: Date) {
  return value.toLocaleDateString();
}

function formatTime(value: Date) {
  return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildUtcDate(date: Date, time: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    0,
    0,
  );
}

function buildUtcIso(date: Date, time: Date) {
  return buildUtcDate(date, time).toISOString();
}

function addMinutes(value: Date, minutes: number) {
  const next = new Date(value.getTime());
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

export default function NewReservationScreen() {
  const router = useRouter();
  const toast = useAppToast();
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<{
    venueId?: string | string[];
    pitchId?: string | string[];
  }>();
  const venueId = Array.isArray(params.venueId) ? params.venueId[0] : params.venueId;
  const pitchIdParam = Array.isArray(params.pitchId) ? params.pitchId[0] : params.pitchId;

  const pitchesQuery = usePlayerVenuePitchesQuery(venueId ?? null);
  const createReservation = useCreateReservationMutation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [pickerMode, setPickerMode] = useState<'date' | 'start' | null>(null);

  const pitchOptions = useMemo(
    () =>
      (pitchesQuery.data ?? []).map((pitch) => ({
        value: pitch.id,
        label: pitch.name,
      })),
    [pitchesQuery.data],
  );

  const { control, handleSubmit, formState, setValue, watch } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    mode: 'onChange',
    defaultValues: {
      pitchId: pitchIdParam ?? '',
      startAt: '',
      slotCount: '1',
      invitedCount: '0',
      notes: '',
    },
  });

  const selectedPitchId = watch('pitchId');
  const selectedSlotCount = watch('slotCount');
  const selectedPitch = useMemo(
    () => (pitchesQuery.data ?? []).find((pitch) => pitch.id === selectedPitchId),
    [pitchesQuery.data, selectedPitchId],
  );
  const slotDuration = selectedPitch?.slotDurationMinutes ?? 60;
  const slotCountValue = Number(selectedSlotCount || '1');

  const onSubmit = handleSubmit(async (values) => {
    if (!venueId) {
      toast.error('Error', 'Complejo invalido.');
      return;
    }

    const startAtDate = buildUtcDate(selectedDate, startTime);
    const endAtDate = addMinutes(startAtDate, Math.max(1, slotCountValue) * slotDuration);

    const startAtIso = startAtDate.toISOString();
    const endAtIso = endAtDate.toISOString();

    if (endAtDate <= startAtDate) {
      toast.error('Horario invalido', 'La hora fin debe ser posterior a la hora de inicio.');
      return;
    }

    try {
      await createReservation.mutateAsync({
        pitchId: values.pitchId,
        startAt: startAtIso,
        endAt: endAtIso,
        invitedCount: toOptionalNumber(values.invitedCount),
        notes: values.notes?.trim() || undefined,
      });
      toast.success('Reserva creada', 'Revisa tus reservas en el home.');
      router.replace('/home');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear la reserva.';
      toast.error('Error', message);
    }
  });

  useEffect(() => {
    setValue('startAt', buildUtcIso(selectedDate, startTime));
  }, [selectedDate, setValue, startTime]);

  return (
    <AppFrame appName="Nueva reserva" subtitle="Completa los datos para reservar la cancha.">
      <GapView gap="md">
        <Controller
          control={control}
          name="pitchId"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={field.onChange}
                options={pitchOptions}
                label="Cancha"
                placeholder={pitchesQuery.isLoading ? 'Cargando canchas...' : 'Seleccionar cancha'}
                error={fieldState.invalid}
              />
              {fieldState.error ? (
                <Text style={{ color: theme.colors.error, fontSize: 12 }}>
                  {fieldState.error.message}
                </Text>
              ) : null}
            </>
          )}
        />
        <AppButton
          variant="neutral"
          onPress={() => {
            setPickerMode('date');
          }}
        >
          {`Fecha: ${formatDate(selectedDate)}`}
        </AppButton>
        {formState.errors.startAt ? (
          <Text style={{ color: theme.colors.error, fontSize: 12 }}>
            {formState.errors.startAt.message}
          </Text>
        ) : null}
        <AppButton
          variant="neutral"
          onPress={() => {
            setPickerMode('start');
          }}
        >
          {`Inicio: ${formatTime(startTime)}`}
        </AppButton>
        <Controller
          control={control}
          name="slotCount"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={field.onChange}
                options={[
                  { value: '1', label: '1 turno' },
                  { value: '2', label: '2 turnos' },
                  { value: '3', label: '3 turnos' },
                  { value: '4', label: '4 turnos' },
                ]}
                label="Cantidad de turnos"
                placeholder="Seleccionar turnos"
                error={fieldState.invalid}
              />
              {fieldState.error ? (
                <Text style={{ color: theme.colors.error, fontSize: 12 }}>
                  {fieldState.error.message}
                </Text>
              ) : null}
            </>
          )}
        />
        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
          {`Fin estimado: ${formatTime(
            addMinutes(
              buildUtcDate(selectedDate, startTime),
              Math.max(1, slotCountValue) * slotDuration,
            ),
          )} · ${slotDuration} min por turno`}
        </Text>
        <Controller
          control={control}
          name="invitedCount"
          render={({ field }) => (
            <AppInput
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="Invitados extra (opcional)"
              keyboardType="numeric"
            />
          )}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <AppInput
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="Notas (opcional)"
            />
          )}
        />
        <AppButton onPress={onSubmit} disabled={!formState.isValid || formState.isSubmitting}>
          {formState.isSubmitting ? 'Reservando...' : 'Confirmar reserva'}
        </AppButton>
        <AppButton variant="neutral" onPress={() => router.back()}>
          Cancelar
        </AppButton>
      </GapView>

      {pickerMode ? (
        <DateTimePicker
          value={pickerMode === 'date' ? selectedDate : startTime}
          mode={pickerMode === 'date' ? 'date' : 'time'}
          onChange={(event, value) => {
            if (!value) {
              setPickerMode(null);
              return;
            }
            if (pickerMode === 'date') {
              setSelectedDate(value);
            } else if (pickerMode === 'start') {
              setStartTime(value);
              setValue('startAt', buildUtcIso(selectedDate, value));
            }
            setPickerMode(null);
          }}
        />
      ) : null}
    </AppFrame>
  );
}
