import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { useAppToast, GapView, useAppTheme } from '@17suit/ui';
import { AppButton, AppInput, AppSelect } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Controller, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { z } from 'zod';
import { Screen } from '../../../components/screen';
import { humanizeError } from '../../../lib/error-messages';
import { IANA_TIMEZONES } from '../../../lib/iana-timezones';
import { timeZoneCity } from '../../../lib/timezone-label';
import { useCreateVenueMutation } from '../../../lib/owner-queries';
import { Text } from 'react-native';

const createComplexSchema = z.object({
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  location: z.string().trim().max(255, 'Máximo 255 caracteres.').optional().or(z.literal('')),
  timezone: z.string().trim().max(80, 'Máximo 80 caracteres.').optional().or(z.literal('')),
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
      label: `${timeZoneCity(value)} · ${value}`,
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
      <Screen
        title="Nuevo complejo"
        subtitle="Solo las cuentas que administran complejos pueden crear uno."
      >
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>Volver al inicio</AppButton>
        </GapView>
      </Screen>
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
      toast.error('No se pudo crear el complejo', humanizeError(error, 'save'));
    }
  });

  return (
    <Screen
      title="Nuevo complejo"
      subtitle="Crea el complejo; después agregas sus canchas y horarios."
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
                label="Nombre del complejo"
                placeholder="Ej. Club La Cancha"
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
                label="Dirección (opcional)"
                placeholder="Calle, número y ciudad"
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
                label="Zona horaria"
                placeholder="Seleccionar zona horaria"
                searchable
                searchPlaceholder="Buscar ciudad o zona"
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
          {formState.isSubmitting ? 'Creando…' : 'Guardar complejo'}
        </AppButton>
        <AppButton variant="neutral" onPress={() => router.back()}>
          Cancelar
        </AppButton>
      </GapView>
    </Screen>
  );
}
