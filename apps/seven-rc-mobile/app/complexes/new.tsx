import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppInput, AppSelect, YStack, useAppToast } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { z } from 'zod';
import { AuthTabScreen } from '../../components/auth-tab-screen';
import { useCreateVenueMutation } from '../../lib/owner-queries';

const createComplexSchema = z.object({
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  location: z.string().trim().max(255, 'Maximo 255 caracteres.').optional().or(z.literal('')),
  timezone: z.string().trim().max(80, 'Maximo 80 caracteres.').optional().or(z.literal('')),
});

type CreateComplexFormValues = z.infer<typeof createComplexSchema>;

function toOptionalValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function detectLocalTimezone(): string {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected && detected.trim().length > 0) {
      return detected;
    }
  } catch {
    // fallback handled below
  }
  return 'UTC';
}

const timezonePresets = [
  'UTC',
  'America/Argentina/Buenos_Aires',
  'America/New_York',
  'America/Mexico_City',
  'Europe/Madrid',
] as const;

export default function CreateComplexScreen() {
  const router = useRouter();
  const toast = useAppToast();
  const { role } = useCurrentUserRoleQuery();
  const detectedTimezone = useMemo(() => detectLocalTimezone(), []);
  const timezoneOptions = useMemo(() => {
    const unique = new Set<string>([detectedTimezone, ...timezonePresets]);
    return Array.from(unique).map((value) => ({
      value,
      label: value,
    }));
  }, [detectedTimezone]);
  const createVenueMutation = useCreateVenueMutation();
  const { control, handleSubmit, formState } = useForm<CreateComplexFormValues>({
    resolver: zodResolver(createComplexSchema),
    defaultValues: {
      name: '',
      location: '',
      timezone: detectedTimezone,
    },
  });

  if (role !== 'OWNER') {
    return (
      <AuthTabScreen
        appName="Nuevo complejo"
        subtitle="Solo disponible para cuentas OWNER."
        role={role}
      >
        <YStack style={{ gap: 12 }}>
          <AppButton onPress={() => router.replace('/home')}>Volver al inicio</AppButton>
        </YStack>
      </AuthTabScreen>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const location = toOptionalValue(values.location);
      const timezone = toOptionalValue(values.timezone);

      await createVenueMutation.mutateAsync({
        name: values.name.trim(),
        ...(location ? { location } : {}),
        ...(timezone ? { timezone } : {}),
      });
      toast.success('Complejo creado', 'Ya puedes agregar canchas.');
      router.replace('/home');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el complejo.';
      toast.error('Error al crear complejo', message);
    }
  });

  return (
    <AuthTabScreen
      appName="Nuevo complejo"
      subtitle="Crea un complejo para luego cargar canchas y gestionar reservas."
      role={role}
    >
      <YStack style={{ gap: 12 }}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <AppInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Nombre del complejo"
              error={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={control}
          name="location"
          render={({ field, fieldState }) => (
            <AppInput
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="Direccion (opcional)"
              error={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={control}
          name="timezone"
          render={({ field, fieldState }) => (
            <AppSelect
              value={field.value ?? ''}
              onChangeValue={field.onChange}
              options={timezoneOptions}
              label="Timezone"
              placeholder="Seleccionar timezone"
              error={fieldState.invalid}
            />
          )}
        />
        <AppButton onPress={onSubmit}>
          {formState.isSubmitting ? 'Creando...' : 'Guardar complejo'}
        </AppButton>
        <AppButton variant="neutral" onPress={() => router.replace('/home')}>
          Cancelar
        </AppButton>
      </YStack>
    </AuthTabScreen>
  );
}
