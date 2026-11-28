'use client';

import { applyServerFieldErrors, intInRange } from '@17suit/core';
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
import { asDepositPolicy, DEPOSIT_POLICY_VALUES, type DepositPolicy } from '@/lib/deposit-policy';
import { useUpdateVenueSettingsMutation, type OwnerVenue } from '@/lib/owner-queries';
import { normalizePhone } from '@/lib/phone';
import { describeError } from '@/lib/seven-rc-errors';
import { useTranslation } from '@17suit/i18n/react';

/** Server DTO property to form field, only for fields with an inline error. */
const SERVER_FIELD_MAP = {
  contactPhone: 'contactPhone',
  depositPercent: 'depositPercent',
  depositFromMinutes: 'depositFromMinutes',
  holdMinutes: 'holdMinutes',
  cancellationWindowHours: 'cancellationWindowHours',
  bookingHorizonDays: 'bookingHorizonDays',
} as const;

const E164_PATTERN = /^\+[1-9]\d{7,14}$/;
const POLICY_VALUES = DEPOSIT_POLICY_VALUES as unknown as [DepositPolicy, ...DepositPolicy[]];

const POLICY_LABEL_KEY: Record<DepositPolicy, string> = {
  refund: 'depositPolicy.refund',
  retain: 'depositPolicy.retain',
  owner_decides: 'depositPolicy.ownerDecides',
};

function buildSettingsSchema(countryCode: string, hadPhone: boolean) {
  return z
    .object({
      contactPhone: z.string(),
      paymentInstructions: z.string().max(500),
      depositPercent: intInRange(0, 100, 'policyErrors.depositPercent'),
      depositFromMinutes: intInRange(0, 1440, 'policyErrors.depositFromMinutes'),
      holdMinutes: intInRange(5, 1440, 'policyErrors.holdMinutes'),
      cancellationWindowHours: intInRange(0, 168, 'policyErrors.cancellationWindowHours'),
      lateCancelDeposit: z.enum(POLICY_VALUES),
      noShowDeposit: z.enum(POLICY_VALUES),
      conditionsText: z.string().max(1000),
      bookingHorizonDays: intInRange(1, 180, 'settings.errors.bookingHorizonDays'),
    })
    .superRefine((values, issues) => {
      const phone = normalizePhone(values.contactPhone, countryCode);
      if (phone && !E164_PATTERN.test(phone)) {
        issues.addIssue({
          code: 'custom',
          path: ['contactPhone'],
          message: 'settings.errors.phoneFormat',
        });
      } else if (!phone && hadPhone) {
        issues.addIssue({
          code: 'custom',
          path: ['contactPhone'],
          message: 'settings.errors.phoneRequired',
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
  name:
    | 'depositPercent'
    | 'depositFromMinutes'
    | 'holdMinutes'
    | 'cancellationWindowHours'
    | 'bookingHorizonDays';
  label: string;
  min: number;
  max: number;
  step: number;
  hint: string;
}) {
  const { t } = useTranslation('venue');
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
          errorMessage={
            fieldState.error?.message
              ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
              : null
          }
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
  const { t } = useTranslation('venue');
  const policyOptions = DEPOSIT_POLICY_VALUES.map((value) => ({
    value,
    label: t(POLICY_LABEL_KEY[value]),
  }));
  const mutation = useUpdateVenueSettingsMutation(venue.id);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, setValue, watch, formState, setError } = useForm<SettingsValues>({
    resolver: zodResolver(buildSettingsSchema(venue.countryCode, Boolean(venue.contactPhone))),
    defaultValues: {
      contactPhone: venue.contactPhone ?? '',
      paymentInstructions: venue.paymentInstructions ?? '',
      depositPercent: String(venue.depositPercent),
      depositFromMinutes: String(venue.depositFromMinutes),
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
          depositFromMinutes: Number(values.depositFromMinutes),
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
          keeping > 0 ? t('settings.savedKeeping', { count: keeping }) : t('settings.saved'),
        );
      } catch (caught) {
        if (!applyServerFieldErrors(caught, setError, SERVER_FIELD_MAP)) {
          setFormError(describeError(caught, t('settings.saveFailed')));
        }
      }
    },
    () => {
      setNotice(null);
      setFormError(t('common.checkFields'));
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
          {t('settings.title')}
        </h3>
        <p className="m-0 max-w-[var(--container-measure)] text-sm leading-[18px] text-muted">
          {t('settings.subtitle', { name: venue.name })}
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
              label={t('settings.contactPhone.label')}
              autoComplete="tel"
              inputMode="tel"
              spellCheck={false}
              placeholder={t('settings.contactPhone.placeholder')}
              errorMessage={
                fieldState.error?.message
                  ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                  : null
              }
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={t('settings.contactPhone.hint')}
            />
          )}
        />
        <Controller
          control={control}
          name="paymentInstructions"
          render={({ field }) => (
            <TextAreaField
              label={t('policyFields.paymentInstructions')}
              name="paymentInstructions"
              value={field.value}
              onChangeValue={field.onChange}
              maxLength={500}
              placeholder={t('settings.paymentInstructions.placeholder')}
              hint={t('settings.paymentInstructions.hint')}
            />
          )}
        />
        <NumberField
          control={control}
          name="depositPercent"
          label={t('policyFields.depositPercent')}
          min={0}
          max={100}
          step={1}
          hint={
            depositValue === 0
              ? t('settings.depositPercent.hintZero')
              : t('settings.depositPercent.hintPending')
          }
        />
        <NumberField
          control={control}
          name="depositFromMinutes"
          label={t('policyFields.depositFromMinutes')}
          min={0}
          max={1440}
          step={15}
          hint={t('settings.depositFromMinutes.hint')}
        />
        <NumberField
          control={control}
          name="holdMinutes"
          label={t('policyFields.holdMinutes')}
          min={5}
          max={1440}
          step={5}
          hint={t('settings.holdMinutes.hint')}
        />
        <NumberField
          control={control}
          name="cancellationWindowHours"
          label={t('policyFields.cancellationWindowHours')}
          min={0}
          max={168}
          step={1}
          hint={t('settings.cancellationWindowHours.hint')}
        />
        <Controller
          control={control}
          name="lateCancelDeposit"
          render={({ field }) => (
            <SelectField
              label={t('policyFields.lateCancelDeposit')}
              name="lateCancelDeposit"
              value={field.value}
              onChangeValue={(value) => field.onChange(asDepositPolicy(value))}
              options={policyOptions}
              hint={t('settings.lateCancelDeposit.hint')}
            />
          )}
        />
        <Controller
          control={control}
          name="noShowDeposit"
          render={({ field }) => (
            <SelectField
              label={t('policyFields.noShowDeposit')}
              name="noShowDeposit"
              value={field.value}
              onChangeValue={(value) => field.onChange(asDepositPolicy(value))}
              options={policyOptions}
              hint={t('settings.noShowDeposit.hint')}
            />
          )}
        />
        <Controller
          control={control}
          name="conditionsText"
          render={({ field }) => (
            <TextAreaField
              label={t('policyFields.conditionsText')}
              name="conditionsText"
              value={field.value}
              onChangeValue={field.onChange}
              maxLength={1000}
              placeholder={t('settings.conditionsText.placeholder')}
              hint={t('settings.conditionsText.hint')}
            />
          )}
        />
        <NumberField
          control={control}
          name="bookingHorizonDays"
          label={t('settings.bookingHorizonDays.label')}
          min={1}
          max={180}
          step={1}
          hint={t('settings.bookingHorizonDays.hint')}
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={mutation.isPending || formState.isSubmitting}>
          {mutation.isPending || formState.isSubmitting ? t('common.saving') : t('settings.save')}
        </AppButton>
      </div>
      <InlineError message={formError} />
      <InlineStatus message={notice} />
    </form>
  );
}
