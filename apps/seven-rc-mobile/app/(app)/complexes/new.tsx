import { EMPTY_CO_ADDRESS_DRAFT, coAddressDraftSchema, coAddressFromDraft } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppInput, AppSelect, AppSkeleton, GapView } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Controller, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { addressErrorKeys, CoAddressFields } from '../../../components/co-address-fields';
import { Screen } from '../../../components/screen';
import { FormError } from '../../../components/form-field';
import { humanizeError } from '../../../lib/error-messages';
import { feedback } from '../../../lib/feedback';
import { IANA_TIMEZONES } from '../../../lib/iana-timezones';
import { timeZoneCity } from '../../../lib/timezone-label';
import { useCreateVenueMutation } from '../../../lib/owner-queries';

const createComplexSchema = z.object({
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  timezone: z.string().trim().max(80, 'Máximo 80 caracteres.').optional().or(z.literal('')),
  address: coAddressDraftSchema,
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
  const { user } = useUser();
  const { role, isLoading } = useCurrentUserRoleQuery({
    userId: user?.id,
    enabled: Boolean(user?.id),
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
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
      timezone: detectedTimezone,
      address: { ...EMPTY_CO_ADDRESS_DRAFT },
    },
  });

  if (isLoading || !user) {
    return (
      <Screen title="Nuevo complejo">
        <AppSkeleton height={180} rounded="lg" />
      </Screen>
    );
  }

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
    setSubmitError(null);
    try {
      const addressParts = coAddressFromDraft(values.address);
      const timezone = toOptionalValue(values.timezone);

      const created = await createVenueMutation.mutateAsync({
        name: values.name.trim(),
        ...(addressParts ? { addressParts } : {}),
        ...(timezone ? { timezone } : {}),
      });
      feedback.success('Complejo creado', 'Ya puedes agregar canchas.');
      router.replace(`/complexes/${created.id}`);
    } catch (error) {
      setSubmitError(humanizeError(error, 'save'));
    }
  });

  return (
    <Screen
      title="Nuevo complejo"
      subtitle="Crea el complejo; después agregas sus canchas y horarios."
      footer={
        <>
          <FormError message={submitError} />
          <AppButton
            onPress={onSubmit}
            disabled={!formState.isValid || formState.isSubmitting}
            busy={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Creando…' : 'Guardar complejo'}
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
                label="Nombre del complejo"
                placeholder="Ej. Club La Cancha"
                error={fieldState.invalid}
              />
              <FormError message={fieldState.error?.message ?? null} />
            </>
          )}
        />
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <CoAddressFields
              value={field.value}
              onChange={field.onChange}
              errors={addressErrorKeys(formState.errors.address)}
            />
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
              <FormError message={fieldState.error?.message ?? null} />
            </>
          )}
        />
      </GapView>
    </Screen>
  );
}
