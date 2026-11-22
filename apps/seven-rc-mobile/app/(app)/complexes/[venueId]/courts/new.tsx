import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppInput, AppSelect, AppSkeleton, GapView } from '@17suit/ui-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Screen } from '../../../../../components/screen';
import { FormError } from '../../../../../components/form-field';
import { humanizeError } from '../../../../../lib/error-messages';
import { feedback } from '../../../../../lib/feedback';
import { findSport, SPORTS } from '../../../../../lib/sports';
import { useCreateVenuePitchMutation } from '../../../../../lib/owner-queries';

const createCourtSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  sportType: z.string().trim().min(2, 'El deporte es obligatorio.'),
  capacity: z
    .string()
    .trim()
    .refine((value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= 1 && parsed <= 100;
    }, 'Capacidad inválida. Debe ser un número entero entre 1 y 100.'),
  slotDurationMinutes: z
    .string()
    .trim()
    .refine((value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= 30;
    }, 'Duración inválida. Debe ser de al menos 30 minutos.'),
});

type CreateCourtFormValues = z.infer<typeof createCourtSchema>;

const sportOptions = SPORTS.map(({ value, label }) => ({ value, label }));

/** The usual sizes, plus whatever each sport defaults to (Fútbol 7 needs 14). */
const capacityOptions = Array.from(
  new Set([2, 4, 6, 8, 10, 12, ...SPORTS.map((sport) => sport.defaultCapacity)]),
)
  .sort((a, b) => a - b)
  .map((count) => ({ value: String(count), label: `${count} jugadores` }));

const durationOptions = [
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '60 minutos' },
  { value: '75', label: '75 minutos' },
  { value: '90', label: '90 minutos' },
  { value: '120', label: '120 minutos' },
] as const;

export default function CreateCourtScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { role, isLoading } = useCurrentUserRoleQuery({
    userId: user?.id,
    enabled: Boolean(user?.id),
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const createPitchMutation = useCreateVenuePitchMutation(venueId ?? '');
  const initialSport = findSport('padel');
  const { control, handleSubmit, formState, setValue } = useForm<CreateCourtFormValues>({
    resolver: zodResolver(createCourtSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      sportType: 'padel',
      capacity: String(initialSport?.defaultCapacity ?? 4),
      slotDurationMinutes: String(initialSport?.defaultDurationMinutes ?? 90),
    },
  });

  if (isLoading || !user) {
    return (
      <Screen title="Nueva cancha">
        <AppSkeleton height={220} rounded="lg" />
      </Screen>
    );
  }

  if (role !== 'OWNER' || !venueId) {
    return (
      <Screen
        title="Nueva cancha"
        subtitle="No encontramos el complejo o tu cuenta no puede administrarlo."
      >
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>Volver al inicio</AppButton>
        </GapView>
      </Screen>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const created = await createPitchMutation.mutateAsync({
        name: values.name.trim(),
        sportType: values.sportType.trim(),
        capacity: Number(values.capacity),
        slotDurationMinutes: Number(values.slotDurationMinutes),
      });
      feedback.success('Cancha creada', 'La cancha ya aparece en el complejo.');
      router.replace(`/complexes/${venueId}/courts/${created.id}/slots`);
    } catch (error) {
      setSubmitError(humanizeError(error, 'save'));
    }
  });

  return (
    <Screen
      title="Nueva cancha"
      subtitle="Agrega una cancha a este complejo."
      footer={
        <>
          <FormError message={submitError} />
          <AppButton
            onPress={onSubmit}
            disabled={!formState.isValid || formState.isSubmitting}
            busy={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Creando…' : 'Guardar cancha'}
          </AppButton>
          <AppButton
            variant="neutral"
            onPress={() => router.back()}
            disabled={formState.isSubmitting}
          >
            Cancelar
          </AppButton>
        </>
      }
    >
      <GapView gap="md">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                label="Nombre de la cancha"
                placeholder="Ej. Cancha 1"
                error={fieldState.invalid}
              />
              <FormError message={fieldState.error?.message ?? null} />
            </>
          )}
        />
        <Controller
          control={control}
          name="sportType"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={(value) => {
                  field.onChange(value);
                  const sport = findSport(value);
                  if (!sport) return;
                  setValue('capacity', String(sport.defaultCapacity), { shouldValidate: true });
                  setValue('slotDurationMinutes', String(sport.defaultDurationMinutes), {
                    shouldValidate: true,
                  });
                }}
                options={sportOptions}
                label="Deporte"
                placeholder="Seleccionar deporte"
                error={fieldState.invalid}
              />
              <FormError message={fieldState.error?.message ?? null} />
            </>
          )}
        />
        <Controller
          control={control}
          name="capacity"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={field.onChange}
                options={capacityOptions}
                label="Capacidad"
                placeholder="Seleccionar capacidad"
                error={fieldState.invalid}
              />
              <FormError message={fieldState.error?.message ?? null} />
            </>
          )}
        />
        <Controller
          control={control}
          name="slotDurationMinutes"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={field.onChange}
                options={durationOptions as unknown as { value: string; label: string }[]}
                label="Duración por turno"
                placeholder="Seleccionar duración"
                error={fieldState.invalid}
              />
              <FormError message={fieldState.error?.message ?? null} />
            </>
          )}
        />
      </GapView>
    </Screen>
  );
}
