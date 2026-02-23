import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppInput, AppSelect, useAppToast, GapView, useAppTheme } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Controller, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { z } from 'zod';
import { AuthTabScreen } from '../../../components/auth-tab-screen';
import { IANA_TIMEZONES } from '../../../lib/iana-timezones';
import { useCreateVenueMutation } from '../../../lib/owner-queries';
import { Text } from 'react-native';

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

export default function CreateComplexScreen() {
  const router = useRouter();
  const toast = useAppToast();
  const { theme } = useAppTheme();
  const { user } = useUser();
  const { role } = useCurrentUserRoleQuery({ userId: user?.id, enabled: Boolean(user?.id) });
  const detectedTimezone = useMemo(() => detectLocalTimezone(), []);
  const timezoneOptions = useMemo(() => {
    const unique = new Set<string>([detectedTimezone, ...IANA_TIMEZONES]);
    return Array.from(unique).map((value) => ({
      value,
      label: value,
    }));
  }, [detectedTimezone]);
  const createVenueMutation = useCreateVenueMutation();
  const { control, handleSubmit, formState } = useForm<CreateComplexFormValues>({
    resolver: zodResolver(createComplexSchema),
    mode: 'onChange',
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
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>Volver al inicio</AppButton>
        </GapView>
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
      <GapView gap="md">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Nombre del complejo"
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
          name="location"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value ?? ''}
                onChangeText={field.onChange}
                placeholder="Direccion (opcional)"
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
          name="timezone"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value ?? ''}
                onChangeValue={field.onChange}
                options={timezoneOptions}
                label="Timezone"
                placeholder="Seleccionar timezone"
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
          {formState.isSubmitting ? 'Creando...' : 'Guardar complejo'}
        </AppButton>
        <AppButton variant="neutral" onPress={() => router.replace('/home')}>
          Cancelar
        </AppButton>
      </GapView>
    </AuthTabScreen>
  );
}
