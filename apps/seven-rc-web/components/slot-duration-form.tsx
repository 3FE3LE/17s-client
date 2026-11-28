'use client';

import { intInRange } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '@17suit/ui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { HintedInput, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import { weekPayload } from '@/lib/opening-hours';
import { useConfigurePitchSlotsMutation, type PitchWithPricing } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { formatDuration } from '@/lib/seven-rc-format';
import { useTranslation } from '@17suit/i18n/react';

const durationSchema = z.object({
  duration: intInRange(30, 240, 'common.durationRange'),
});
type DurationValues = z.infer<typeof durationSchema>;

export function SlotDurationForm({ venueId, pitch }: { venueId: string; pitch: PitchWithPricing }) {
  const { t } = useTranslation('venue');
  const mutation = useConfigurePitchSlotsMutation(pitch.id, venueId);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<DurationValues>({
    resolver: zodResolver(durationSchema),
    defaultValues: { duration: String(pitch.slotDurationMinutes) },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setNotice(null);
    const parsed = Number(values.duration);
    if (parsed === pitch.slotDurationMinutes) {
      setNotice(t('slotDuration.unchanged'));
      return;
    }
    try {
      await mutation.mutateAsync({
        openingHours: weekPayload(pitch.openingHours),
        slotDurationMinutes: parsed,
      });
      setNotice(t('slotDuration.saved', { pitch: pitch.name, duration: formatDuration(parsed) }));
    } catch (caught) {
      setError(describeError(caught, t('slotDuration.failed')));
    }
  });
  const saving = mutation.isPending || formState.isSubmitting;

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="duracion-title"
      className="grid gap-sm"
      noValidate
    >
      <h3 id="duracion-title" className="m-0 font-arvo text-md text-text">
        {t('slotDuration.title')}
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <Controller
          control={control}
          name="duration"
          render={({ field, fieldState }) => (
            <HintedInput
              type="number"
              name="slotDurationMinutes"
              label={t('slotDuration.label')}
              inputMode="numeric"
              min={30}
              max={240}
              step={15}
              required
              errorMessage={
                fieldState.error?.message
                  ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                  : null
              }
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={t('slotDuration.hint')}
            />
          )}
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={saving}>
          {saving ? t('common.saving') : t('slotDuration.save')}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}
