'use client';

import { AppButton, AppInput } from '@17suit/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useFieldArray, useForm, type FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { HintedInput, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import { useConfigurePitchPricingMutation, type PitchWithPricing } from '@/lib/owner-queries';
import { formatAmountInput, parseAmount } from '@/lib/owner-payment';
import {
  effectiveBands,
  findOverlaps,
  MAX_PRICE_RULES,
  validateRule,
  type PriceRuleInput,
} from '@/lib/pricing-rules';
import { describeError } from '@/lib/seven-rc-errors';
import { formatMoneyMinor, WEEKDAYS } from '@/lib/seven-rc-format';

const ruleDraftSchema = z.object({
  days: z.array(z.number()),
  startTime: z.string(),
  endTime: z.string(),
  amount: z.string(),
});
type RuleDraft = z.infer<typeof ruleDraftSchema>;

function fromRule(rule: PitchWithPricing['priceRules'][number]): RuleDraft {
  return {
    days: [...rule.daysOfWeek],
    startTime: rule.startTime,
    endTime: rule.endTime,
    amount: formatAmountInput(rule.priceMinor),
  };
}

function toRule(draft: RuleDraft): PriceRuleInput {
  return {
    daysOfWeek: draft.days,
    startTime: draft.startTime,
    endTime: draft.endTime,
    // NaN fails validateRule's integer check, so an unparsable amount is reported.
    priceMinor: parseAmount(draft.amount) ?? Number.NaN,
  };
}

/**
 * Per-rule rules live in `validateRule` and `findOverlaps` (shared with the server mirror).
 * Each message is attached to `rules[i].root` so react-hook-form keeps one entry per rule.
 */
const priceRulesSchema = z
  .object({ rules: z.array(ruleDraftSchema).max(MAX_PRICE_RULES) })
  .superRefine(({ rules: drafts }, issues) => {
    const rules = drafts.map(toRule);
    const messages = new Map<number, string[]>();
    const add = (index: number, message: string) =>
      messages.set(index, [...(messages.get(index) ?? []), message]);
    rules.forEach((rule, index) => {
      const message = validateRule(rule);
      if (message) add(index, `Regla ${index + 1}: ${message}`);
    });
    if (messages.size === 0) {
      for (const [a, b] of findOverlaps(rules)) {
        add(b, `Las reglas ${a + 1} y ${b + 1} se solapan: comparten día y horario.`);
      }
    }
    for (const [index, list] of messages) {
      issues.addIssue({ code: 'custom', path: ['rules', index, 'root'], message: list.join(' ') });
    }
  });
type PriceRulesValues = z.infer<typeof priceRulesSchema>;

function ruleMessages(errors: FieldErrors<PriceRulesValues>): string[] {
  const list = errors.rules;
  if (!Array.isArray(list)) return [];
  return list.flatMap((entry: unknown) => {
    const message = (entry as { root?: { message?: string } } | undefined)?.root?.message;
    return message ? [message] : [];
  });
}

/** Price rules by weekday and time window, with the resulting price per slot. */
export function PitchPriceRules({
  venueId,
  currency,
  pitch,
}: {
  venueId: string;
  currency: string;
  pitch: PitchWithPricing;
}) {
  const mutation = useConfigurePitchPricingMutation(pitch.id, venueId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, watch, formState } = useForm<PriceRulesValues>({
    resolver: zodResolver(priceRulesSchema),
    defaultValues: { rules: pitch.priceRules.map(fromRule) },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'rules' });

  const drafts = watch('rules');
  const validRules = drafts.map(toRule).filter((rule) => validateRule(rule) === null);

  const onSubmit = handleSubmit(async (values) => {
    setNotice(null);
    setServerError(null);
    const rules = values.rules.map(toRule);
    try {
      // The endpoint replaces base price and rules together; keep the stored base price.
      await mutation.mutateAsync({ basePriceMinor: pitch.basePriceMinor, rules });
      setNotice(
        rules.length === 0
          ? `${pitch.name} ya no tiene tarifas por horario.`
          : `Guardaste ${rules.length === 1 ? '1 tarifa' : `${rules.length} tarifas`} para ${pitch.name}.`,
      );
    } catch (caught) {
      setServerError(describeError(caught, 'No se pudieron guardar las tarifas.'));
    }
  });
  const errors = [...ruleMessages(formState.errors), ...(serverError ? [serverError] : [])];

  const openDays = WEEKDAYS.filter((day) => {
    const hours = pitch.openingHours?.[String(day.value)];
    return Boolean(hours?.openTime && hours.closeTime);
  });

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="tarifas-title"
      className="grid gap-sm"
      noValidate
    >
      <h3 id="tarifas-title" className="m-0 font-arvo text-md text-text">
        Tarifas por día y horario
      </h3>
      <p className="m-0 text-sm leading-[18px] text-muted">
        Una tarifa reemplaza el precio base en los turnos que empiezan dentro de su horario. Las
        tarifas no pueden solaparse.
      </p>

      {fields.length === 0 ? (
        <p className="m-0 text-md leading-[1.5] text-muted">
          Sin tarifas: todos los turnos cuestan el precio base.
        </p>
      ) : (
        <ol className="m-0 grid list-none gap-sm p-0">
          {fields.map((item, index) => (
            <li
              key={item.id}
              className="grid gap-sm rounded-[var(--radius-lg)] border border-border-strong bg-background p-md"
            >
              <Controller
                control={control}
                name={`rules.${index}.days`}
                render={({ field }) => (
                  <fieldset className="m-0 flex flex-wrap gap-sm border-0 p-0">
                    <legend className="mb-xs p-0 text-sm font-bold text-text">
                      Tarifa {index + 1} · días
                    </legend>
                    {WEEKDAYS.map((day) => (
                      <label key={day.value} className="inline-flex items-center gap-xs text-md">
                        <input
                          type="checkbox"
                          name={`tarifa-${index + 1}-dias`}
                          checked={field.value.includes(day.value)}
                          onChange={(event) => {
                            field.onChange(
                              event.target.checked
                                ? [...new Set([...field.value, day.value])]
                                : field.value.filter((d) => d !== day.value),
                            );
                            setNotice(null);
                          }}
                        />
                        {day.label}
                      </label>
                    ))}
                  </fieldset>
                )}
              />
              <div className="grid gap-sm sm:grid-cols-3">
                <Controller
                  control={control}
                  name={`rules.${index}.startTime`}
                  render={({ field }) => (
                    <AppInput
                      type="time"
                      name={`tarifa-${index + 1}-desde`}
                      label="Desde"
                      value={field.value}
                      onChangeText={(value) => {
                        field.onChange(value);
                        setNotice(null);
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`rules.${index}.endTime`}
                  render={({ field }) => (
                    <AppInput
                      type="time"
                      name={`tarifa-${index + 1}-hasta`}
                      label="Hasta (00:00 = medianoche)"
                      value={field.value}
                      onChangeText={(value) => {
                        field.onChange(value);
                        setNotice(null);
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`rules.${index}.amount`}
                  render={({ field }) => (
                    <HintedInput
                      name={`tarifa-${index + 1}-precio`}
                      label={`Precio por turno (${currency})`}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="150.000"
                      value={field.value}
                      onChangeText={(value) => {
                        field.onChange(value);
                        setNotice(null);
                      }}
                      hint={
                        parseAmount(field.value) === null
                          ? 'Ej. 150.000'
                          : formatMoneyMinor(parseAmount(field.value) ?? 0, currency)
                      }
                    />
                  )}
                />
              </div>
              <div>
                <AppButton
                  variant="neutral"
                  compact
                  fullWidth={false}
                  onPress={() => {
                    remove(index);
                    setNotice(null);
                  }}
                >
                  Quitar tarifa {index + 1}
                </AppButton>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap gap-sm">
        <AppButton
          variant="neutral"
          fullWidth={false}
          disabled={fields.length >= MAX_PRICE_RULES}
          onPress={() => {
            append({ days: [], startTime: '19:00', endTime: '22:00', amount: '' });
            setNotice(null);
          }}
        >
          Agregar tarifa
        </AppButton>
        <AppButton
          type="submit"
          fullWidth={false}
          disabled={mutation.isPending || formState.isSubmitting}
        >
          {mutation.isPending || formState.isSubmitting ? 'Guardando…' : 'Guardar tarifas'}
        </AppButton>
      </div>
      {errors.length > 0 ? (
        <div role="alert" className="grid gap-xs">
          {errors.map((message) => (
            <InlineError key={message} message={message} />
          ))}
        </div>
      ) : null}
      <InlineStatus message={notice} />

      <section aria-labelledby="precio-efectivo-title" className="grid gap-xs">
        <h4 id="precio-efectivo-title" className="m-0 text-md font-bold text-text">
          Precio efectivo por turno
        </h4>
        {pitch.basePriceMinor === 0 && validRules.length === 0 ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            Sin precio base ni tarifas: los jugadores verán “Precio a confirmar con el complejo”.
          </p>
        ) : openDays.length === 0 ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            Define los horarios de apertura para ver el precio de cada turno.
          </p>
        ) : (
          <ul className="m-0 grid list-none gap-xs p-0 text-sm leading-[18px] text-text">
            {openDays.map((day) => {
              const hours = pitch.openingHours?.[String(day.value)];
              const bands = effectiveBands({
                basePriceMinor: pitch.basePriceMinor,
                rules: validRules,
                dayOfWeek: day.value,
                openTime: hours?.openTime ?? '00:00',
                closeTime: hours?.closeTime ?? '00:00',
                slotMinutes: pitch.slotDurationMinutes,
              });
              return (
                <li key={day.value}>
                  <span className="font-bold">{day.label}:</span>{' '}
                  {bands.length === 0
                    ? 'sin turnos'
                    : bands
                        .map(
                          (band) =>
                            `${band.from}–${band.to} ${formatMoneyMinor(band.priceMinor, currency)}`,
                        )
                        .join(' · ')}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </form>
  );
}
