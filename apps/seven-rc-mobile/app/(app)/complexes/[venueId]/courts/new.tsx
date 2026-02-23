import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppInput, AppSelect, useAppToast, GapView, useAppTheme } from '@17suit/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthTabScreen } from '../../../../../components/auth-tab-screen';
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
    }, 'Capacidad invalida. Debe ser un entero entre 1 y 100.'),
  slotDurationMinutes: z
    .string()
    .trim()
    .refine((value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= 30;
    }, 'Duracion invalida. Debe ser un entero mayor o igual a 30.'),
});

type CreateCourtFormValues = z.infer<typeof createCourtSchema>;

const sportOptions = [
  { value: 'padel', label: 'Padel' },
  { value: 'futbol-5', label: 'Futbol 5' },
  { value: 'futbol-7', label: 'Futbol 7' },
  { value: 'tenis', label: 'Tenis' },
  { value: 'basquet', label: 'Basquet' },
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
      <AuthTabScreen
        appName="Nueva cancha"
        subtitle="Ruta invalida o permisos insuficientes."
        role={role}
      >
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>Volver al inicio</AppButton>
        </GapView>
      </AuthTabScreen>
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
      const message = error instanceof Error ? error.message : 'No se pudo crear la cancha.';
      toast.error('Error al crear cancha', message);
    }
  });

  return (
    <AuthTabScreen
      appName="Nueva cancha"
      subtitle="Agrega una cancha dentro del complejo seleccionado."
      role={role}
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
                placeholder="Nombre de la cancha"
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
                label="Duracion por turno"
                placeholder="Seleccionar duracion"
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
          {formState.isSubmitting ? 'Creando...' : 'Guardar cancha'}
        </AppButton>
        <AppButton variant="neutral" onPress={() => router.replace(`/complexes/${venueId}`)}>
          Cancelar
        </AppButton>
      </GapView>
    </AuthTabScreen>
  );
}
