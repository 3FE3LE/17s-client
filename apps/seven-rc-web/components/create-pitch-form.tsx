'use client';

import { applyServerFieldErrors, intInRange } from '@17suit/core';
import { AppButton, AppInput } from '@17suit/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { InlineError, InlineStatus, SelectField } from '@/components/seven-rc-ui';
import { useCreateVenuePitchMutation } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { sportOptions } from '@/lib/seven-rc-format';
import { useTranslation } from '@17suit/i18n/react';

const createPitchSchema = z.object({
  name: z.string().trim().min(2, 'createPitch.errors.name').max(120),
  sportType: z.string().min(1),
  capacity: intInRange(1, 100, 'createPitch.errors.capacity'),
  duration: intInRange(30, 240, 'common.durationRange'),
});
type CreatePitchValues = z.infer<typeof createPitchSchema>;

/** Server DTO property to form field, only for fields with an inline error. */
const SERVER_FIELD_MAP = {
  name: 'name',
  capacity: 'capacity',
  slotDurationMinutes: 'duration',
} as const;

export function CreatePitchForm({ venueId, venueName }: { venueId: string; venueName: string }) {
  const { t } = useTranslation('venue');
  const createPitchMutation = useCreateVenuePitchMutation(venueId);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState,
    setError: setFieldError,
  } = useForm<CreatePitchValues>({
    resolver: zodResolver(createPitchSchema),
    defaultValues: { name: '', sportType: 'futbol-5', capacity: '10', duration: '60' },
  });

  const isSaving = formState.isSubmitting || createPitchMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setNotice(null);
    try {
      const created = await createPitchMutation.mutateAsync({
        name: values.name,
        sportType: values.sportType,
        capacity: Number(values.capacity),
        slotDurationMinutes: Number(values.duration),
      });
      reset({ ...getValues(), name: '' });
      setNotice(t('createPitch.created', { name: created.name }));
    } catch (caught) {
      if (!applyServerFieldErrors(caught, setFieldError, SERVER_FIELD_MAP)) {
        setError(describeError(caught, t('createPitch.failed')));
      }
    }
  });

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      noValidate
      aria-labelledby="crear-cancha-title"
      className="grid gap-sm"
    >
      <h3 id="crear-cancha-title" className="m-0 font-arvo text-md text-text">
        {t('createPitch.title', { venue: venueName })}
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="grid content-start gap-xs">
              <AppInput
                name="pitchName"
                label={t('createPitch.name.label')}
                placeholder={t('createPitch.name.placeholder')}
                autoComplete="off"
                maxLength={120}
                error={fieldState.invalid}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <InlineError
                message={
                  fieldState.error?.message
                    ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                    : null
                }
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="sportType"
          render={({ field }) => (
            <SelectField
              label={t('createPitch.sport')}
              name="sportType"
              value={field.value}
              onChangeValue={field.onChange}
              options={sportOptions(t)}
            />
          )}
        />
        <Controller
          control={control}
          name="capacity"
          render={({ field, fieldState }) => (
            <div className="grid content-start gap-xs">
              <AppInput
                type="number"
                name="capacity"
                label={t('createPitch.capacity')}
                inputMode="numeric"
                min={1}
                max={100}
                step={1}
                error={fieldState.invalid}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <InlineError
                message={
                  fieldState.error?.message
                    ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                    : null
                }
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="duration"
          render={({ field, fieldState }) => (
            <div className="grid content-start gap-xs">
              <AppInput
                type="number"
                name="slotDurationMinutes"
                label={t('createPitch.duration')}
                inputMode="numeric"
                min={30}
                max={240}
                step={15}
                error={fieldState.invalid}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <InlineError
                message={
                  fieldState.error?.message
                    ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                    : null
                }
              />
            </div>
          )}
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={isSaving}>
          {isSaving ? t('common.saving') : t('createPitch.add')}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}
