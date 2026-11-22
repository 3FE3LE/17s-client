import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppInput, AppSelect, useAppToast, GapView, useAppTheme } from '@17suit/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Screen } from '../../../../../components/screen';
import { humanizeError } from '../../../../../lib/error-messages';
import { useCreateVenuePitchMutation } from '../../../../../lib/owner-queries';
import { Text } from 'react-native';

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

const sportOptions = [
  { value: 'padel', label: 'Pádel' },
  { value: 'futbol-5', label: 'Fútbol 5' },
  { value: 'futbol-7', label: 'Fútbol 7' },
  { value: 'tenis', label: 'Tenis' },
  { value: 'basquet', label: 'Básquet' },
] as const;

const capacityOptions = [
  { value: '2', label: '2 jugadores' },
  { value: '4', label: '4 jugadores' },
  { value: '6', label: '6 jugadores' },
  { value: '8', label: '8 jugadores' },
  { value: '10', label: '10 jugadores' },
  { value: '12', label: '12 jugadores' },
] as const;

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
  const toast = useAppToast();
  const { theme } = useAppTheme();
  const { user } = useUser();
  const { role } = useCurrentUserRoleQuery({ userId: user?.id, enabled: Boolean(user?.id) });
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const createPitchMutation = useCreateVenuePitchMutation(venueId ?? '');
  const { control, handleSubmit, formState } = useForm<CreateCourtFormValues>({
    resolver: zodResolver(createCourtSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      sportType: 'padel',
      capacity: '4',
      slotDurationMinutes: '60',
    },
  });

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
    try {
      const created = await createPitchMutation.mutateAsync({
        name: values.name.trim(),
        sportType: values.sportType.trim(),
        capacity: Number(values.capacity),
        slotDurationMinutes: Number(values.slotDurationMinutes),
      });
      toast.success('Cancha creada', 'La cancha ya aparece en el complejo.');
      router.replace(`/complexes/${venueId}/courts/${created.id}/slots`);
    } catch (error) {
      toast.error('No se pudo crear la cancha', humanizeError(error, 'save'));
    }
  });

  return (
    <Screen title="Nueva cancha" subtitle="Agrega una cancha a este complejo.">
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
              {fieldState.error ? (
                <Text style={{ color: theme.colors.error, fontSize: 12 }}>
                  {fieldState.error.message}
                </Text>
              ) : null}
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
                onChangeValue={field.onChange}
                options={sportOptions as unknown as { value: string; label: string }[]}
                label="Deporte"
                placeholder="Seleccionar deporte"
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
        <Controller
          control={control}
          name="capacity"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={field.onChange}
                options={capacityOptions as unknown as { value: string; label: string }[]}
                label="Capacidad"
                placeholder="Seleccionar capacidad"
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
              {fieldState.error ? (
                <Text style={{ color: theme.colors.error, fontSize: 12 }}>
                  {fieldState.error.message}
                </Text>
              ) : null}
            </>
          )}
        />
        <AppButton onPress={onSubmit} disabled={!formState.isValid || formState.isSubmitting}>
          {formState.isSubmitting ? 'Creando…' : 'Guardar cancha'}
        </AppButton>
        <AppButton variant="neutral" onPress={() => router.back()}>
          Cancelar
        </AppButton>
      </GapView>
    </Screen>
  );
}
