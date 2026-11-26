'use client';

import { optionalIntInRange } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '@17suit/ui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  HintedInput,
  InlineError,
  InlineStatus,
  SelectField,
  TextAreaField,
} from '@/components/seven-rc-ui';
import {
  asDepositPolicy,
  DEPOSIT_POLICY_LABEL,
  DEPOSIT_POLICY_OPTIONS,
} from '@/lib/deposit-policy';
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

const policyOverride = z.union([z.enum(['retain', 'refund', 'owner_decides']), z.literal('')]);

const pitchPolicySchema = z.object({
  depositPercent: optionalIntInRange(0, 100, FIELDS[0].error),
  holdMinutes: optionalIntInRange(5, 1440, FIELDS[1].error),
  cancellationWindowHours: optionalIntInRange(0, 168, FIELDS[2].error),
  paymentInstructions: z.string(),
  lateCancelDeposit: policyOverride,
  noShowDeposit: policyOverride,
  conditionsText: z.string().max(1000),
});
type PitchPolicyValues = z.infer<typeof pitchPolicySchema>;

/** Booking conditions for one pitch. Blank fields inherit the venue's value. */
export function PitchPolicyForm({
  venueId,
  venue,
  pitch,
}: {
  venueId: string;
  venue: Pick<
    OwnerVenue,
    | 'depositPercent'
    | 'holdMinutes'
    | 'cancellationWindowHours'
    | 'paymentInstructions'
    | 'lateCancelDeposit'
    | 'noShowDeposit'
    | 'conditionsText'
  >;
  pitch: PitchWithPricing;
}) {
  const mutation = useConfigurePitchPolicyMutation(pitch.id, venueId);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<PitchPolicyValues>({
    resolver: zodResolver(pitchPolicySchema),
    defaultValues: {
      depositPercent: pitch.depositPercent === null ? '' : String(pitch.depositPercent),
      holdMinutes: pitch.holdMinutes === null ? '' : String(pitch.holdMinutes),
      cancellationWindowHours:
        pitch.cancellationWindowHours === null ? '' : String(pitch.cancellationWindowHours),
      paymentInstructions: pitch.paymentInstructions ?? '',
      // '' = inherit the venue.
      lateCancelDeposit: pitch.lateCancelDeposit ?? '',
      noShowDeposit: pitch.noShowDeposit ?? '',
      conditionsText: pitch.conditionsText ?? '',
    },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError(null);
      setNotice(null);
      try {
        await mutation.mutateAsync({
          depositPercent: parseOptionalInt(values.depositPercent, 0, 100) as number | null,
          holdMinutes: parseOptionalInt(values.holdMinutes, 5, 1440) as number | null,
          cancellationWindowHours: parseOptionalInt(values.cancellationWindowHours, 0, 168) as
            | number
            | null,
          paymentInstructions:
            values.paymentInstructions.trim() === '' ? null : values.paymentInstructions.trim(),
          lateCancelDeposit: values.lateCancelDeposit === '' ? null : values.lateCancelDeposit,
          noShowDeposit: values.noShowDeposit === '' ? null : values.noShowDeposit,
          conditionsText: values.conditionsText.trim() === '' ? null : values.conditionsText.trim(),
        });
        setNotice(
          `Guardaste las condiciones de ${pitch.name}. Los campos vacíos usan las del complejo.`,
        );
      } catch (caught) {
        setFormError(describeError(caught, 'No se pudieron guardar las condiciones.'));
      }
    },
    () => {
      setNotice(null);
      setFormError('Revisa los campos marcados.');
    },
  );

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
          <Controller
            key={field.key}
            control={control}
            name={field.key}
            render={({ field: input, fieldState }) => (
              <HintedInput
                type="text"
                name={field.name}
                label={field.label}
                inputMode="numeric"
                autoComplete="off"
                placeholder={inherited[field.key]}
                errorMessage={fieldState.error?.message ?? null}
                value={input.value}
                onChangeText={(value) => {
                  input.onChange(value);
                  setNotice(null);
                }}
                onBlur={input.onBlur}
                hint={
                  input.value.trim() === ''
                    ? `Usa el del complejo: ${inherited[field.key]}.`
                    : 'Valor propio de esta cancha.'
                }
              />
            )}
          />
        ))}
      </div>
      <Controller
        control={control}
        name="paymentInstructions"
        render={({ field }) => (
          <HintedInput
            type="text"
            name="paymentInstructions"
            label="Instrucciones de pago"
            autoComplete="off"
            placeholder={venue.paymentInstructions ?? ''}
            value={field.value}
            onChangeText={(value) => {
              field.onChange(value);
              setNotice(null);
            }}
            onBlur={field.onBlur}
            hint={field.value.trim() === '' ? 'Usa las del complejo.' : 'Propias de esta cancha.'}
          />
        )}
      />
      <div className="grid gap-sm md:grid-cols-2">
        <Controller
          control={control}
          name="lateCancelDeposit"
          render={({ field }) => (
            <SelectField
              label="Cancelación tardía: anticipo"
              name="lateCancelDeposit"
              value={field.value}
              onChangeValue={(value) => field.onChange(value === '' ? '' : asDepositPolicy(value))}
              options={[
                {
                  value: '',
                  label: `Igual al complejo (${DEPOSIT_POLICY_LABEL[venue.lateCancelDeposit]})`,
                },
                ...DEPOSIT_POLICY_OPTIONS,
              ]}
            />
          )}
        />
        <Controller
          control={control}
          name="noShowDeposit"
          render={({ field }) => (
            <SelectField
              label="No asistencia: anticipo"
              name="noShowDeposit"
              value={field.value}
              onChangeValue={(value) => field.onChange(value === '' ? '' : asDepositPolicy(value))}
              options={[
                {
                  value: '',
                  label: `Igual al complejo (${DEPOSIT_POLICY_LABEL[venue.noShowDeposit]})`,
                },
                ...DEPOSIT_POLICY_OPTIONS,
              ]}
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="conditionsText"
        render={({ field }) => (
          <TextAreaField
            label="Condiciones adicionales"
            name="conditionsText"
            value={field.value}
            onChangeValue={field.onChange}
            maxLength={1000}
            placeholder={venue.conditionsText ?? ''}
            hint={field.value.trim() === '' ? 'Usa las del complejo.' : 'Propias de esta cancha.'}
          />
        )}
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
