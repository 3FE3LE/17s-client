'use client';

import { AppButton } from '@17suit/ui';
import { useState, type FormEvent } from 'react';
import { HintedInput, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import {
  useConfigurePitchPolicyMutation,
  type OwnerVenue,
  type PitchWithPricing,
} from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';

/** Empty means "inherit the venue"; anything else must be an integer in range. */
export function parseOptionalInt(
  value: string,
  min: number,
  max: number,
): number | null | 'invalid' {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (!/^\d+$/.test(trimmed)) return 'invalid';
  const parsed = Number(trimmed);
  return parsed >= min && parsed <= max ? parsed : 'invalid';
}

const FIELDS = [
  {
    key: 'depositPercent',
    name: 'depositPercent',
    label: 'Anticipo (% del precio)',
    min: 0,
    max: 100,
    error: 'Usa un número entero entre 0 y 100.',
  },
  {
    key: 'holdMinutes',
    name: 'holdMinutes',
    label: 'Minutos para pagar el anticipo',
    min: 5,
    max: 1440,
    error: 'Usa entre 5 y 1440 minutos (24 h).',
  },
  {
    key: 'cancellationWindowHours',
    name: 'cancellationWindowHours',
    label: 'Cancelación en línea (horas antes)',
    min: 0,
    max: 168,
    error: 'Usa entre 0 y 168 horas (7 días).',
  },
] as const;

type NumericKey = (typeof FIELDS)[number]['key'];

/** Booking conditions for one pitch. Blank fields inherit the venue's value. */
export function PitchPolicyForm({
  venueId,
  venue,
  pitch,
}: {
  venueId: string;
  venue: Pick<
    OwnerVenue,
    'depositPercent' | 'holdMinutes' | 'cancellationWindowHours' | 'paymentInstructions'
  >;
  pitch: PitchWithPricing;
}) {
  const mutation = useConfigurePitchPolicyMutation(pitch.id, venueId);
  const [values, setValues] = useState<Record<NumericKey, string>>({
    depositPercent: pitch.depositPercent === null ? '' : String(pitch.depositPercent),
    holdMinutes: pitch.holdMinutes === null ? '' : String(pitch.holdMinutes),
    cancellationWindowHours:
      pitch.cancellationWindowHours === null ? '' : String(pitch.cancellationWindowHours),
  });
  const [instructions, setInstructions] = useState(pitch.paymentInstructions ?? '');
  const [errors, setErrors] = useState<Partial<Record<NumericKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);
    const next: Partial<Record<NumericKey, string>> = {};
    const parsed = {} as Record<NumericKey, number | null>;
    for (const field of FIELDS) {
      const result = parseOptionalInt(values[field.key], field.min, field.max);
      if (result === 'invalid') next[field.key] = field.error;
      else parsed[field.key] = result;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setFormError('Revisa los campos marcados.');
      return;
    }
    try {
      await mutation.mutateAsync({
        ...parsed,
        paymentInstructions: instructions.trim() === '' ? null : instructions.trim(),
      });
      setNotice(
        `Guardaste las condiciones de ${pitch.name}. Los campos vacíos usan las del complejo.`,
      );
    } catch (caught) {
      setFormError(describeError(caught, 'No se pudieron guardar las condiciones.'));
    }
  }

  const inherited: Record<NumericKey, string> = {
    depositPercent: String(venue.depositPercent),
    holdMinutes: String(venue.holdMinutes),
    cancellationWindowHours: String(venue.cancellationWindowHours),
  };

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="condiciones-cancha-title"
      className="grid gap-sm"
      noValidate
    >
      <h3 id="condiciones-cancha-title" className="m-0 font-arvo text-md text-text">
        Condiciones de reserva de esta cancha
      </h3>
      <p className="m-0 text-sm leading-[18px] text-muted">
        Deja un campo vacío para usar el valor del complejo. Las reservas ya hechas conservan sus
        condiciones.
      </p>
      <div className="grid gap-sm md:grid-cols-3">
        {FIELDS.map((field) => (
          <HintedInput
            key={field.key}
            type="text"
            name={field.name}
            label={field.label}
            inputMode="numeric"
            autoComplete="off"
            placeholder={inherited[field.key]}
            errorMessage={errors[field.key] ?? null}
            value={values[field.key]}
            onChangeText={(value) => {
              setValues((current) => ({ ...current, [field.key]: value }));
              setNotice(null);
            }}
            hint={
              values[field.key].trim() === ''
                ? `Usa el del complejo: ${inherited[field.key]}.`
                : 'Valor propio de esta cancha.'
            }
          />
        ))}
      </div>
      <HintedInput
        type="text"
        name="paymentInstructions"
        label="Instrucciones de pago"
        autoComplete="off"
        placeholder={venue.paymentInstructions ?? ''}
        value={instructions}
        onChangeText={(value) => {
          setInstructions(value);
          setNotice(null);
        }}
        hint={instructions.trim() === '' ? 'Usa las del complejo.' : 'Propias de esta cancha.'}
      />
      <div>
        <AppButton type="submit" fullWidth={false} disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar condiciones'}
        </AppButton>
      </div>
      {formError ? <InlineError message={formError} /> : null}
      <InlineStatus message={notice} />
    </form>
  );
}
