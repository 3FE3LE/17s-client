'use client';

import { applyServerFieldErrors } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '@17suit/ui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { HintedInput, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import { useConfigurePitchPricingMutation, type PitchWithPricing } from '@/lib/owner-queries';
import { formatAmountInput, parseAmount } from '@/lib/owner-payment';
import { describeError } from '@/lib/seven-rc-errors';
import { formatDuration, formatMoneyMinor } from '@/lib/seven-rc-format';
import { useTranslation } from '@17suit/i18n/react';

// An empty price is valid (it clears the base price); anything typed must parse.
const priceSchema = z.object({
  amount: z
    .string()
    .refine((value) => value.trim() === '' || parseAmount(value) !== null, 'price.errors.amount'),
});
type PriceValues = z.infer<typeof priceSchema>;

/** Server DTO property to form field. Price rules are not edited here. */
const SERVER_FIELD_MAP = { basePriceMinor: 'amount' } as const;

export function PitchPriceForm({
  venueId,
  currency,
  pitch,
}: {
  venueId: string;
  currency: string;
  pitch: PitchWithPricing;
}) {
  const { t, i18n } = useTranslation('venue');
  const locale = i18n.language;
  const mutation = useConfigurePitchPricingMutation(pitch.id, venueId);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState,
    setError: setFieldError,
  } = useForm<PriceValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      amount: pitch.basePriceMinor > 0 ? formatAmountInput(pitch.basePriceMinor) : '',
    },
  });
  const preview = parseAmount(watch('amount'));
  const ruleCount = pitch.priceRules.length;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setNotice(null);
    const basePriceMinor = values.amount.trim() ? (parseAmount(values.amount) ?? 0) : 0;
    try {
      // The endpoint replaces base price and rules together; carry the rules over.
      await mutation.mutateAsync({
        basePriceMinor,
        rules: pitch.priceRules.map((rule) => ({
          daysOfWeek: rule.daysOfWeek,
          startTime: rule.startTime,
          endTime: rule.endTime,
          priceMinor: rule.priceMinor,
        })),
      });
      setNotice(
        basePriceMinor > 0
          ? t('price.saved', {
              pitch: pitch.name,
              price: formatMoneyMinor(basePriceMinor, currency, locale),
            })
          : ruleCount > 0
            ? t('price.savedNoBase', { pitch: pitch.name })
            : t('price.savedNoPrice', { pitch: pitch.name }),
      );
    } catch (caught) {
      if (!applyServerFieldErrors(caught, setFieldError, SERVER_FIELD_MAP)) {
        setError(describeError(caught, t('price.saveFailed')));
      }
    }
  });
  const saving = mutation.isPending || formState.isSubmitting;

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="precio-title"
      className="grid gap-sm"
      noValidate
    >
      <h3 id="precio-title" className="m-0 font-arvo text-md text-text">
        {t('price.title')}
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <Controller
          control={control}
          name="amount"
          render={({ field, fieldState }) => (
            <HintedInput
              name="basePrice"
              label={t('price.label', {
                duration: formatDuration(pitch.slotDurationMinutes),
                currency,
              })}
              inputMode="decimal"
              autoComplete="off"
              placeholder={t('price.placeholder')}
              errorMessage={
                fieldState.error?.message
                  ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                  : null
              }
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={
                preview
                  ? t('price.hintPreview', { price: formatMoneyMinor(preview, currency, locale) })
                  : t('price.hintEmpty')
              }
            />
          )}
        />
      </div>
      {ruleCount > 0 ? (
        <p className="m-0 text-sm leading-[18px] text-muted">
          {t('price.rules', { count: ruleCount })}
        </p>
      ) : null}
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={saving}>
          {saving ? t('common.saving') : t('price.save')}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}
