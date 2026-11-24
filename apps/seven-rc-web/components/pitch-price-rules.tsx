'use client';

import { AppButton, AppInput } from '@17suit/ui';
import { useState, type FormEvent } from 'react';
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

interface Draft {
  key: number;
  days: number[];
  startTime: string;
  endTime: string;
  amount: string;
}

let nextKey = 0;

function fromRule(rule: PitchWithPricing['priceRules'][number]): Draft {
  return {
    key: nextKey++,
    days: [...rule.daysOfWeek],
    startTime: rule.startTime,
    endTime: rule.endTime,
    amount: formatAmountInput(rule.priceMinor),
  };
}

function toRule(draft: Draft): PriceRuleInput {
  return {
    daysOfWeek: draft.days,
    startTime: draft.startTime,
    endTime: draft.endTime,
    // NaN fails validateRule's integer check, so an unparsable amount is reported.
    priceMinor: parseAmount(draft.amount) ?? Number.NaN,
  };
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
  const [drafts, setDrafts] = useState<Draft[]>(() => pitch.priceRules.map(fromRule));
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const rules = drafts.map(toRule);
  const validRules = rules.filter((rule) => validateRule(rule) === null);

  function update(key: number, patch: Partial<Draft>) {
    setDrafts((current) => current.map((d) => (d.key === key ? { ...d, ...patch } : d)));
    setNotice(null);
  }

  function toggleDay(draft: Draft, day: number, checked: boolean) {
    update(draft.key, {
      days: checked ? [...new Set([...draft.days, day])] : draft.days.filter((d) => d !== day),
    });
  }

  function validateAll(): string[] {
    const found: string[] = [];
    rules.forEach((rule, index) => {
      const message = validateRule(rule);
      if (message) found.push(`Regla ${index + 1}: ${message}`);
    });
    if (found.length === 0) {
      for (const [a, b] of findOverlaps(rules)) {
        found.push(`Las reglas ${a + 1} y ${b + 1} se solapan: comparten día y horario.`);
      }
    }
    return found;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    const found = validateAll();
    setErrors(found);
    if (found.length > 0) return;
    try {
      // The endpoint replaces base price and rules together; keep the stored base price.
      await mutation.mutateAsync({ basePriceMinor: pitch.basePriceMinor, rules });
      setNotice(
        rules.length === 0
          ? `${pitch.name} ya no tiene tarifas por horario.`
          : `Guardaste ${rules.length === 1 ? '1 tarifa' : `${rules.length} tarifas`} para ${pitch.name}.`,
      );
    } catch (caught) {
      setErrors([describeError(caught, 'No se pudieron guardar las tarifas.')]);
    }
  }

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

      {drafts.length === 0 ? (
        <p className="m-0 text-md leading-[1.5] text-muted">
          Sin tarifas: todos los turnos cuestan el precio base.
        </p>
      ) : (
        <ol className="m-0 grid list-none gap-sm p-0">
          {drafts.map((draft, index) => (
            <li
              key={draft.key}
              className="grid gap-sm rounded-[var(--radius-lg)] border border-border-strong bg-background p-md"
            >
              <fieldset className="m-0 flex flex-wrap gap-sm border-0 p-0">
                <legend className="mb-xs p-0 text-sm font-bold text-text">
                  Tarifa {index + 1} · días
                </legend>
                {WEEKDAYS.map((day) => (
                  <label key={day.value} className="inline-flex items-center gap-xs text-md">
                    <input
                      type="checkbox"
                      name={`tarifa-${index + 1}-dias`}
                      checked={draft.days.includes(day.value)}
                      onChange={(event) => toggleDay(draft, day.value, event.target.checked)}
                    />
                    {day.label}
                  </label>
                ))}
              </fieldset>
              <div className="grid gap-sm sm:grid-cols-3">
                <AppInput
                  type="time"
                  name={`tarifa-${index + 1}-desde`}
                  label="Desde"
                  value={draft.startTime}
                  onChangeText={(value) => update(draft.key, { startTime: value })}
                />
                <AppInput
                  type="time"
                  name={`tarifa-${index + 1}-hasta`}
                  label="Hasta (00:00 = medianoche)"
                  value={draft.endTime}
                  onChangeText={(value) => update(draft.key, { endTime: value })}
                />
                <HintedInput
                  name={`tarifa-${index + 1}-precio`}
                  label={`Precio por turno (${currency})`}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="150.000"
                  value={draft.amount}
                  onChangeText={(value) => update(draft.key, { amount: value })}
                  hint={
                    parseAmount(draft.amount) === null
                      ? 'Ej. 150.000'
                      : formatMoneyMinor(parseAmount(draft.amount) ?? 0, currency)
                  }
                />
              </div>
              <div>
                <AppButton
                  variant="neutral"
                  compact
                  fullWidth={false}
                  onPress={() => {
                    setDrafts((current) => current.filter((d) => d.key !== draft.key));
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
          disabled={drafts.length >= MAX_PRICE_RULES}
          onPress={() => {
            setDrafts((current) => [
              ...current,
              { key: nextKey++, days: [], startTime: '19:00', endTime: '22:00', amount: '' },
            ]);
            setNotice(null);
          }}
        >
          Agregar tarifa
        </AppButton>
        <AppButton type="submit" fullWidth={false} disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar tarifas'}
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
