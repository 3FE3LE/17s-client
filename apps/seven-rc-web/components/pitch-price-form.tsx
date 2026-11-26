'use client';

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

// An empty price is valid (it clears the base price); anything typed must parse.
const priceSchema = z.object({
  amount: z
    .string()
    .refine(
      (value) => value.trim() === '' || parseAmount(value) !== null,
      'Escribe un precio válido, p. ej. 120.000 (máximo 21.474.836).',
    ),
});
type PriceValues = z.infer<typeof priceSchema>;

export function PitchPriceForm({
  venueId,
  currency,
  pitch,
}: {
  venueId: string;
  currency: string;
  pitch: PitchWithPricing;
}) {
  const mutation = useConfigurePitchPricingMutation(pitch.id, venueId);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, watch, formState } = useForm<PriceValues>({
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
          ? `${pitch.name} cuesta ${formatMoneyMinor(basePriceMinor, currency)} por turno.`
          : ruleCount > 0
            ? `${pitch.name} quedó sin precio base: fuera de las tarifas por horario, los jugadores verán “Precio a confirmar con el complejo”.`
            : `${pitch.name} quedó sin precio: los jugadores verán “Precio a confirmar con el complejo”.`,
      );
    } catch (caught) {
      setError(describeError(caught, 'No se pudo guardar el precio.'));
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
        Precio por turno
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <Controller
          control={control}
          name="amount"
          render={({ field, fieldState }) => (
            <HintedInput
              name="basePrice"
              label={`Precio de un turno de ${formatDuration(pitch.slotDurationMinutes)} (${currency})`}
              inputMode="decimal"
              autoComplete="off"
              placeholder="120.000"
              errorMessage={fieldState.error?.message ?? null}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={
                preview
                  ? `Los jugadores verán ${formatMoneyMinor(preview, currency)}. El anticipo se calcula sobre este valor.`
                  : 'Sin precio, los jugadores ven “Precio a confirmar con el complejo” y la reserva se confirma sin anticipo.'
              }
            />
          )}
        />
      </div>
      {ruleCount > 0 ? (
        <p className="m-0 text-sm leading-[18px] text-muted">
          Esta cancha tiene {ruleCount === 1 ? '1 tarifa' : `${ruleCount} tarifas`} por horario
          (hora pico). Se conservan al guardar.
        </p>
      ) : null}
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar precio'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}
