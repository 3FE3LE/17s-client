'use client';

import { intInRange } from '@17suit/core';
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
import { asDepositPolicy, DEPOSIT_POLICY_OPTIONS, type DepositPolicy } from '@/lib/deposit-policy';
import { useUpdateVenueSettingsMutation, type OwnerVenue } from '@/lib/owner-queries';
import { normalizePhone } from '@/lib/phone';
import { describeError } from '@/lib/seven-rc-errors';

const E164_PATTERN = /^\+[1-9]\d{7,14}$/;
const POLICY_VALUES = DEPOSIT_POLICY_OPTIONS.map((option) => option.value) as [
  DepositPolicy,
  ...DepositPolicy[],
];

function buildSettingsSchema(countryCode: string, hadPhone: boolean) {
  return z
    .object({
      contactPhone: z.string(),
      paymentInstructions: z.string().max(500),
      depositPercent: intInRange(0, 100, 'Usa un número entero entre 0 y 100.'),
      holdMinutes: intInRange(5, 1440, 'Usa entre 5 y 1440 minutos (24 h).'),
      cancellationWindowHours: intInRange(0, 168, 'Usa entre 0 y 168 horas (7 días).'),
      lateCancelDeposit: z.enum(POLICY_VALUES),
      noShowDeposit: z.enum(POLICY_VALUES),
      conditionsText: z.string().max(1000),
      bookingHorizonDays: intInRange(1, 180, 'Usa entre 1 y 180 días.'),
    })
    .superRefine((values, issues) => {
      const phone = normalizePhone(values.contactPhone, countryCode);
      if (phone && !E164_PATTERN.test(phone)) {
        issues.addIssue({
          code: 'custom',
          path: ['contactPhone'],
          message: 'Escribe el número con indicativo, p. ej. +57 300 123 4567.',
        });
      } else if (!phone && hadPhone) {
        issues.addIssue({
          code: 'custom',
          path: ['contactPhone'],
          message: 'Deja un teléfono: los jugadores lo usan para pagar o avisar.',
        });
      }
    });
}
type SettingsValues = z.infer<ReturnType<typeof buildSettingsSchema>>;

function NumberField({
  control,
  name,
  label,
  min,
  max,
  step,
  hint,
}: {
  control: ReturnType<typeof useForm<SettingsValues>>['control'];
  name: 'depositPercent' | 'holdMinutes' | 'cancellationWindowHours' | 'bookingHorizonDays';
  label: string;
  min: number;
  max: number;
  step: number;
  hint: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <HintedInput
          type="number"
          name={name}
          label={label}
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          errorMessage={fieldState.error?.message ?? null}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          hint={hint}
        />
      )}
    />
  );
}

export function VenueSettingsForm({ venue }: { venue: OwnerVenue }) {
  const mutation = useUpdateVenueSettingsMutation(venue.id);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, setValue, watch, formState } = useForm<SettingsValues>({
    resolver: zodResolver(buildSettingsSchema(venue.countryCode, Boolean(venue.contactPhone))),
    defaultValues: {
      contactPhone: venue.contactPhone ?? '',
      paymentInstructions: venue.paymentInstructions ?? '',
      depositPercent: String(venue.depositPercent),
      holdMinutes: String(venue.holdMinutes),
      cancellationWindowHours: String(venue.cancellationWindowHours),
      lateCancelDeposit: venue.lateCancelDeposit,
      noShowDeposit: venue.noShowDeposit,
      conditionsText: venue.conditionsText ?? '',
      bookingHorizonDays: String(venue.bookingHorizonDays),
    },
  });
  const depositValue = Number(watch('depositPercent').trim() || Number.NaN);

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError(null);
      setNotice(null);
      const phone = normalizePhone(values.contactPhone, venue.countryCode);
      try {
        const saved = await mutation.mutateAsync({
          ...(phone ? { contactPhone: phone } : {}),
          paymentInstructions: values.paymentInstructions.trim(),
          depositPercent: Number(values.depositPercent),
          holdMinutes: Number(values.holdMinutes),
          cancellationWindowHours: Number(values.cancellationWindowHours),
          lateCancelDeposit: values.lateCancelDeposit,
          noShowDeposit: values.noShowDeposit,
          conditionsText: values.conditionsText.trim(),
          bookingHorizonDays: Number(values.bookingHorizonDays),
        });
        if (phone) setValue('contactPhone', phone);
        const keeping = saved.reservationsKeepingPolicy ?? 0;
        setNotice(
          keeping > 0
            ? `Guardaste los ajustes. Las próximas reservas usan las reglas nuevas; ${keeping} ${
                keeping === 1 ? 'reserva activa conserva' : 'reservas activas conservan'
              } las condiciones con que se hicieron.`
            : 'Guardaste los ajustes. Las próximas reservas ya usan estas reglas.',
        );
      } catch (caught) {
        setFormError(describeError(caught, 'No se pudieron guardar los ajustes.'));
      }
    },
    () => {
      setNotice(null);
      setFormError('Revisa los campos marcados.');
    },
  );

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="ajustes-title"
      noValidate
      className="grid gap-md"
    >
      <div className="grid gap-xs">
        <h3 id="ajustes-title" className="m-0 font-arvo text-md text-text">
          Ajustes del complejo
        </h3>
        <p className="m-0 max-w-[var(--container-measure)] text-sm leading-[18px] text-muted">
          Reglas que ven los jugadores al reservar en {venue.name}.
        </p>
      </div>
      <div className="grid gap-md md:grid-cols-2">
        <Controller
          control={control}
          name="contactPhone"
          render={({ field, fieldState }) => (
            <HintedInput
              type="tel"
              name="contactPhone"
              label="Teléfono o WhatsApp de contacto"
              autoComplete="tel"
              inputMode="tel"
              spellCheck={false}
              placeholder="+57 300 123 4567"
              errorMessage={fieldState.error?.message ?? null}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint="Aparece en las reservas pendientes para que el jugador pague o avise."
            />
          )}
        />
        <Controller
          control={control}
          name="paymentInstructions"
          render={({ field }) => (
            <TextAreaField
              label="Instrucciones de pago"
              name="paymentInstructions"
              value={field.value}
              onChangeValue={field.onChange}
              maxLength={500}
              placeholder="Ej.: Llave Bre-B @micancha · Nequi 300 123 4567"
              hint="El jugador las ve mientras su reserva espera el anticipo."
            />
          )}
        />
        <NumberField
          control={control}
          name="depositPercent"
          label="Anticipo (% del precio)"
          min={0}
          max={100}
          step={1}
          hint={
            depositValue === 0
              ? 'Con 0 %, cada reserva se confirma al instante, sin pasar por ti.'
              : 'La reserva queda pendiente hasta que registres el anticipo o la confirmes.'
          }
        />
        <NumberField
          control={control}
          name="holdMinutes"
          label="Minutos para pagar el anticipo"
          min={5}
          max={1440}
          step={5}
          hint="El turno queda apartado este tiempo. Si vence sin anticipo, el horario se libera."
        />
        <NumberField
          control={control}
          name="cancellationWindowHours"
          label="Cancelación en línea (horas antes)"
          min={0}
          max={168}
          step={1}
          hint="Hasta cuántas horas antes del turno el jugador puede cancelar sin escribirte."
        />
        <Controller
          control={control}
          name="lateCancelDeposit"
          render={({ field }) => (
            <SelectField
              label="Cancelación tardía: anticipo"
              name="lateCancelDeposit"
              value={field.value}
              onChangeValue={(value) => field.onChange(asDepositPolicy(value))}
              options={DEPOSIT_POLICY_OPTIONS}
              hint="Lo que el jugador lee antes de reservar. La plataforma no mueve dinero: tú lo resuelves."
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
              onChangeValue={(value) => field.onChange(asDepositPolicy(value))}
              options={DEPOSIT_POLICY_OPTIONS}
              hint="Aplica cuando el jugador no llega y no cancela."
            />
          )}
        />
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
              placeholder="Ej.: Llegar 10 min antes. Si llueve, se reprograma sin costo."
              hint="Texto libre que el jugador ve antes de confirmar."
            />
          )}
        />
        <NumberField
          control={control}
          name="bookingHorizonDays"
          label="Reservas con anticipación (días)"
          min={1}
          max={180}
          step={1}
          hint="Hasta cuántos días adelante pueden reservar los jugadores."
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={mutation.isPending || formState.isSubmitting}>
          {mutation.isPending || formState.isSubmitting ? 'Guardando…' : 'Guardar ajustes'}
        </AppButton>
      </div>
      <InlineError message={formError} />
      <InlineStatus message={notice} />
    </form>
  );
}
