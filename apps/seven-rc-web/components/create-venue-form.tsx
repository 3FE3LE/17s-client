'use client';

import { coAddressDraftSchema, coAddressFromDraft, EMPTY_CO_ADDRESS_DRAFT } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput } from '@17suit/ui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { addressErrorKeys, CoAddressFields } from '@/components/co-address-fields';
import { InlineError, InlineStatus, SelectField } from '@/components/seven-rc-ui';
import { useCreateVenueMutation } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { DEFAULT_TIMEZONE, VENUE_TIMEZONE_OPTIONS } from '@/lib/seven-rc-format';

export const VENUE_NAME_INPUT_ID = 'nuevo-complejo-nombre';

const createVenueSchema = z.object({
  name: z.string().trim().min(3, 'El nombre del complejo necesita al menos 3 caracteres.').max(120),
  timezone: z.string().min(1),
  address: coAddressDraftSchema,
});
type CreateVenueValues = z.infer<typeof createVenueSchema>;

const EMPTY: CreateVenueValues = {
  name: '',
  timezone: DEFAULT_TIMEZONE,
  address: { ...EMPTY_CO_ADDRESS_DRAFT },
};

export function CreateVenueForm({ onCreated }: { onCreated: (venueId: string) => void }) {
  const createVenueMutation = useCreateVenueMutation();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm<CreateVenueValues>({
    resolver: zodResolver(createVenueSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setError(null);
      setNotice(null);
      const addressParts = coAddressFromDraft(values.address);
      try {
        const created = await createVenueMutation.mutateAsync({
          name: values.name,
          ...(addressParts ? { addressParts } : {}),
          timezone: values.timezone,
        });
        reset({ ...EMPTY, timezone: values.timezone, address: { ...EMPTY_CO_ADDRESS_DRAFT } });
        setNotice(`Creaste “${created.name}”. Ahora agrega sus canchas.`);
        onCreated(created.id);
      } catch (caught) {
        setError(describeError(caught, 'No se pudo crear el complejo.'));
      }
    },
    () => {
      setNotice(null);
      setError('Revisa los campos marcados.');
    },
  );
  const saving = createVenueMutation.isPending || formState.isSubmitting;

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="crear-complejo-title"
      className="grid gap-sm"
      noValidate
    >
      <h3 id="crear-complejo-title" className="m-0 font-arvo text-md text-text">
        Nuevo complejo
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="grid content-start gap-xs">
              <AppInput
                id={VENUE_NAME_INPUT_ID}
                name="name"
                label="Nombre del complejo"
                autoComplete="organization"
                required
                maxLength={120}
                error={Boolean(fieldState.error)}
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
          name="timezone"
          render={({ field }) => (
            <SelectField
              label="Zona horaria del complejo"
              name="timezone"
              value={field.value}
              onChangeValue={field.onChange}
              options={VENUE_TIMEZONE_OPTIONS}
              hint="Los horarios de las canchas se muestran en esta hora."
            />
          )}
        />
      </div>
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
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={saving}>
          {saving ? 'Creando…' : 'Crear complejo'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}
