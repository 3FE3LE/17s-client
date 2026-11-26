'use client';

import {
  coAddressDraftSchema,
  coAddressFromDraft,
  draftFromCoAddress,
  parseCoAddress,
  type CoAddressErrorKey,
  type CoAddressField,
} from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { AppButton } from '@17suit/ui';
import { runAction } from '@17suit/ui/feedback';
import { CoAddressFields } from '@/components/co-address-fields';
import { HintedInput, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import { useUpdateVenueSettingsMutation, type OwnerVenue } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';

const venueIdentitySchema = z.object({
  name: z.string().trim().min(3, 'El nombre del complejo necesita al menos 3 caracteres.').max(120),
  address: coAddressDraftSchema,
});
type VenueIdentityValues = z.infer<typeof venueIdentitySchema>;

/**
 * Name and address of a saved venue. The address is edited as three
 * pre-filled components; a venue created before structured addresses shows its
 * old text above an empty form until the owner saves the new one.
 */
export function VenueIdentityForm({ venue }: { venue: OwnerVenue }) {
  const mutation = useUpdateVenueSettingsMutation(venue.id);
  const saved = parseCoAddress(venue.addressParts);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<VenueIdentityValues>({
    resolver: zodResolver(venueIdentitySchema),
    defaultValues: { name: venue.name, address: draftFromCoAddress(saved) },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError(null);
      setNotice(null);
      const addressParts = coAddressFromDraft(values.address);
      const result = await runAction(
        () =>
          mutation.mutateAsync({
            name: values.name,
            ...(addressParts ? { addressParts } : {}),
          }),
        { toastError: false, success: 'Datos del complejo guardados.' },
      );
      if (result.ok) {
        setNotice('Datos del complejo guardados.');
      } else {
        setFormError(describeError(result.error, 'No se pudieron guardar los datos del complejo.'));
      }
    },
    () => {
      setNotice(null);
      setFormError('Revisa los campos marcados.');
    },
  );

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      noValidate
      aria-labelledby="datos-complejo-title"
      className="grid gap-sm"
    >
      <h3 id="datos-complejo-title" className="m-0 font-arvo text-md text-text">
        Datos del complejo
      </h3>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <HintedInput
            name="name"
            label="Nombre del complejo"
            autoComplete="organization"
            maxLength={120}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            hint="Es el nombre que ven los jugadores."
            errorMessage={fieldState.error?.message ?? null}
          />
        )}
      />
      {!saved && venue.address ? (
        <p className="m-0 text-sm leading-[18px] text-text-muted">
          Dirección anterior: <strong>{venue.address}</strong>. Completa los campos para
          reemplazarla.
        </p>
      ) : null}
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
        <AppButton type="submit" disabled={formState.isSubmitting || mutation.isPending}>
          {formState.isSubmitting || mutation.isPending ? 'Guardando…' : 'Guardar datos'}
        </AppButton>
      </div>
      <InlineError message={formError} />
      <InlineStatus message={notice} />
    </form>
  );
}

function addressErrorKeys(
  errors: Partial<Record<CoAddressField, { message?: string }>> | undefined,
): Partial<Record<CoAddressField, CoAddressErrorKey>> {
  const out: Partial<Record<CoAddressField, CoAddressErrorKey>> = {};
  for (const [field, error] of Object.entries(errors ?? {})) {
    if (error?.message) out[field as CoAddressField] = error.message as CoAddressErrorKey;
  }
  return out;
}
