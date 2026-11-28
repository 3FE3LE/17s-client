'use client';

import {
  applyServerFieldErrors,
  coAddressDraftSchema,
  coAddressFromDraft,
  draftFromCoAddress,
  parseCoAddress,
} from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { AppButton } from '@17suit/ui';
import { runAction } from '@17suit/ui/feedback';
import { addressErrorKeys, CoAddressFields } from '@/components/co-address-fields';
import { HintedInput, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import { useUpdateVenueSettingsMutation, type OwnerVenue } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { useTranslation } from '@17suit/i18n/react';

const venueIdentitySchema = z.object({
  name: z.string().trim().min(3, 'common.venueNameMin').max(120),
  address: coAddressDraftSchema,
});
type VenueIdentityValues = z.infer<typeof venueIdentitySchema>;

/** Server DTO property to form field. Address parts have no single inline field. */
const SERVER_FIELD_MAP = { name: 'name' } as const;

/**
 * Name and address of a saved venue. The address is edited as three
 * pre-filled components; a venue created before structured addresses shows its
 * old text above an empty form until the owner saves the new one.
 */
export function VenueIdentityForm({ venue }: { venue: OwnerVenue }) {
  const { t } = useTranslation('venue');
  const mutation = useUpdateVenueSettingsMutation(venue.id);
  const saved = parseCoAddress(venue.addressParts);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, formState, setError } = useForm<VenueIdentityValues>({
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
        { toastError: false, success: t('identity.saved') },
      );
      if (result.ok) {
        setNotice(t('identity.saved'));
      } else if (!applyServerFieldErrors(result.error, setError, SERVER_FIELD_MAP)) {
        setFormError(describeError(result.error, t('identity.saveFailed')));
      }
    },
    () => {
      setNotice(null);
      setFormError(t('common.checkFields'));
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
        {t('identity.title')}
      </h3>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <HintedInput
            name="name"
            label={t('common.venueName')}
            autoComplete="organization"
            maxLength={120}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            hint={t('identity.nameHint')}
            errorMessage={
              fieldState.error?.message
                ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                : null
            }
          />
        )}
      />
      {!saved && venue.address ? (
        <p className="m-0 text-sm leading-[18px] text-text-muted">
          {t('identity.previousAddress')} <strong>{venue.address}</strong>
          {t('identity.replaceHint')}
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
          {formState.isSubmitting || mutation.isPending ? t('common.saving') : t('identity.save')}
        </AppButton>
      </div>
      <InlineError message={formError} />
      <InlineStatus message={notice} />
    </form>
  );
}
