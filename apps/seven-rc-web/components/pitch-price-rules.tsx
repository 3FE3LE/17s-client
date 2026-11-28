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
  validateRuleCode,
  type PriceRuleInput,
} from '@/lib/pricing-rules';
import { describeError } from '@/lib/seven-rc-errors';
import { formatMoneyMinor, weekdayOptions } from '@/lib/seven-rc-format';
import { useTranslation } from '@17suit/i18n/react';

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

const WEEKDAY_KEY: Record<number, string> = {
  0: 'weekdays.sunday',
  1: 'weekdays.monday',
  2: 'weekdays.tuesday',
  3: 'weekdays.wednesday',
  4: 'weekdays.thursday',
  5: 'weekdays.friday',
  6: 'weekdays.saturday',
};

/** A rule problem as a stable key plus params; the form resolves it with `t`. */
interface RuleProblem {
  key: string;
  params: Record<string, number | string>;
}

/**
 * Per-rule rules live in `validateRule` and `findOverlaps` (shared with the server mirror).
 * Each problem list (JSON of {@link RuleProblem}) is attached to `rules[i].root` so
 * react-hook-form keeps one entry per rule.
 */
const priceRulesSchema = z
  .object({ rules: z.array(ruleDraftSchema).max(MAX_PRICE_RULES) })
  .superRefine(({ rules: drafts }, issues) => {
    const rules = drafts.map(toRule);
    const problems = new Map<number, RuleProblem[]>();
    const add = (index: number, problem: RuleProblem) =>
      problems.set(index, [...(problems.get(index) ?? []), problem]);
    rules.forEach((rule, index) => {
      const code = validateRuleCode(rule);
      if (code) add(index, { key: `priceRules.errors.${code}`, params: { n: index + 1 } });
    });
    if (problems.size === 0) {
      for (const [a, b] of findOverlaps(rules)) {
        add(b, { key: 'priceRules.errors.overlap', params: { a: a + 1, b: b + 1 } });
      }
    }
    for (const [index, list] of problems) {
      issues.addIssue({
        code: 'custom',
        path: ['rules', index, 'root'],
        message: JSON.stringify(list),
      });
    }
  });
type PriceRulesValues = z.infer<typeof priceRulesSchema>;

function ruleMessages(
  errors: FieldErrors<PriceRulesValues>,
  t: (key: string, params: Record<string, number | string>) => string,
): string[] {
  const list = errors.rules;
  if (!Array.isArray(list)) return [];
  return list.flatMap((entry: unknown) => {
    const message = (entry as { root?: { message?: string } } | undefined)?.root?.message;
    if (!message) return [];
    let problems: RuleProblem[];
    try {
      problems = JSON.parse(message) as RuleProblem[];
    } catch {
      return [message];
    }
    // Overlap problems already name both rules; the rest are prefixed with their own rule number.
    return [
      problems
        .map((problem) =>
          problem.key === 'priceRules.errors.overlap'
            ? t(problem.key, problem.params)
            : t('priceRules.errors.ruleN', {
                n: problem.params.n ?? 0,
                message: t(problem.key, problem.params),
              }),
        )
        .join(' '),
    ];
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
  const { t, i18n } = useTranslation('venue');
  const locale = i18n.language;
  const dayLabel = (value: number) => t(WEEKDAY_KEY[value] ?? 'weekdays.monday');
  const mutation = useConfigurePitchPricingMutation(pitch.id, venueId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, watch, formState } = useForm<PriceRulesValues>({
    resolver: zodResolver(priceRulesSchema),
    defaultValues: { rules: pitch.priceRules.map(fromRule) },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'rules' });

  const drafts = watch('rules');
  const validRules = drafts.map(toRule).filter((rule) => validateRuleCode(rule) === null);

  const onSubmit = handleSubmit(async (values) => {
    setNotice(null);
    setServerError(null);
    const rules = values.rules.map(toRule);
    try {
      // The endpoint replaces base price and rules together; keep the stored base price.
      await mutation.mutateAsync({ basePriceMinor: pitch.basePriceMinor, rules });
      setNotice(
        rules.length === 0
          ? t('priceRules.savedNone', { pitch: pitch.name })
          : t('priceRules.saved', { count: rules.length, pitch: pitch.name }),
      );
    } catch (caught) {
      setServerError(describeError(caught, t('priceRules.saveFailed')));
    }
  });
  const errors = [
    ...ruleMessages(formState.errors, (key, params) => t(key, params)),
    ...(serverError ? [serverError] : []),
  ];

  const openDays = weekdayOptions(t).filter((day) => {
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
        {t('priceRules.title')}
      </h3>
      <p className="m-0 text-sm leading-[18px] text-muted">{t('priceRules.intro')}</p>

      {fields.length === 0 ? (
        <p className="m-0 text-md leading-[1.5] text-muted">{t('priceRules.none')}</p>
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
                      {t('priceRules.days', { n: index + 1 })}
                    </legend>
                    {weekdayOptions(t).map((day) => (
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
                        {dayLabel(day.value)}
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
                      label={t('priceRules.from')}
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
                      label={t('priceRules.to')}
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
                      label={t('priceRules.priceLabel', { currency })}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder={t('priceRules.pricePlaceholder')}
                      value={field.value}
                      onChangeText={(value) => {
                        field.onChange(value);
                        setNotice(null);
                      }}
                      hint={
                        parseAmount(field.value) === null
                          ? t('priceRules.priceExample')
                          : formatMoneyMinor(parseAmount(field.value) ?? 0, currency, locale)
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
                  {t('priceRules.remove', { n: index + 1 })}
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
          {t('priceRules.add')}
        </AppButton>
        <AppButton
          type="submit"
          fullWidth={false}
          disabled={mutation.isPending || formState.isSubmitting}
        >
          {mutation.isPending || formState.isSubmitting ? t('common.saving') : t('priceRules.save')}
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
          {t('priceRules.effectiveTitle')}
        </h4>
        {pitch.basePriceMinor === 0 && validRules.length === 0 ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            {t('priceRules.effectiveNoPrice')}
          </p>
        ) : openDays.length === 0 ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            {t('priceRules.effectiveNoHours')}
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
                  <span className="font-bold">{dayLabel(day.value)}:</span>{' '}
                  {bands.length === 0
                    ? t('priceRules.noSlots')
                    : bands
                        .map(
                          (band) =>
                            `${band.from}–${band.to} ${formatMoneyMinor(band.priceMinor, currency, locale)}`,
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
