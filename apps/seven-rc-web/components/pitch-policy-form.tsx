'use client';

import { applyServerFieldErrors, optionalIntInRange } from '@17suit/core';
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
import {
  useConfigurePitchPolicyMutation,
  type OwnerVenue,
  type PitchWithPricing,
} from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { useTranslation } from '@17suit/i18n/react';

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

/** Server DTO property to form field, only for fields with an inline error. */
const SERVER_FIELD_MAP = {
  depositPercent: 'depositPercent',
  holdMinutes: 'holdMinutes',
  cancellationWindowHours: 'cancellationWindowHours',
  paymentInstructions: 'paymentInstructions',
} as const;

const POLICY_LABEL_KEY: Record<DepositPolicy, string> = {
  refund: 'depositPolicy.refund',
  retain: 'depositPolicy.retain',
  owner_decides: 'depositPolicy.ownerDecides',
};

const FIELDS = [
  {
    key: 'depositPercent',
    name: 'depositPercent',
    labelKey: 'policyFields.depositPercent',
    min: 0,
    max: 100,
    error: 'policyErrors.depositPercent',
  },
  {
    key: 'holdMinutes',
    name: 'holdMinutes',
    labelKey: 'policyFields.holdMinutes',
    min: 5,
    max: 1440,
    error: 'policyErrors.holdMinutes',
  },
  {
    key: 'cancellationWindowHours',
    name: 'cancellationWindowHours',
    labelKey: 'policyFields.cancellationWindowHours',
    min: 0,
    max: 168,
    error: 'policyErrors.cancellationWindowHours',
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
  const { t } = useTranslation('venue');
  const policyOptions = DEPOSIT_POLICY_VALUES.map((value) => ({
    value,
    label: t(POLICY_LABEL_KEY[value]),
  }));
  const mutation = useConfigurePitchPolicyMutation(pitch.id, venueId);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, setError } = useForm<PitchPolicyValues>({
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
        setNotice(t('pitchPolicy.saved', { pitch: pitch.name }));
      } catch (caught) {
        if (!applyServerFieldErrors(caught, setError, SERVER_FIELD_MAP)) {
          setFormError(describeError(caught, t('pitchPolicy.saveFailed')));
        }
      }
    },
    () => {
      setNotice(null);
      setFormError(t('common.checkFields'));
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
        {t('pitchPolicy.title')}
      </h3>
      <p className="m-0 text-sm leading-[18px] text-muted">{t('pitchPolicy.intro')}</p>
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
                label={t(field.labelKey)}
                inputMode="numeric"
                autoComplete="off"
                placeholder={inherited[field.key]}
                errorMessage={
                  fieldState.error?.message
                    ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                    : null
                }
                value={input.value}
                onChangeText={(value) => {
                  input.onChange(value);
                  setNotice(null);
                }}
                onBlur={input.onBlur}
                hint={
                  input.value.trim() === ''
                    ? t('pitchPolicy.inheritedHint', { value: inherited[field.key] })
                    : t('pitchPolicy.ownHint')
                }
              />
            )}
          />
        ))}
      </div>
      <Controller
        control={control}
        name="paymentInstructions"
        render={({ field, fieldState }) => (
          <HintedInput
            type="text"
            name="paymentInstructions"
            label={t('policyFields.paymentInstructions')}
            autoComplete="off"
            placeholder={venue.paymentInstructions ?? ''}
            errorMessage={
              fieldState.error?.message
                ? t(fieldState.error.message, { defaultValue: fieldState.error.message })
                : null
            }
            value={field.value}
            onChangeText={(value) => {
              field.onChange(value);
              setNotice(null);
            }}
            onBlur={field.onBlur}
            hint={
              field.value.trim() === ''
                ? t('pitchPolicy.inheritedHintPlural')
                : t('pitchPolicy.ownHintPlural')
            }
          />
        )}
      />
      <div className="grid gap-sm md:grid-cols-2">
        <Controller
          control={control}
          name="lateCancelDeposit"
          render={({ field }) => (
            <SelectField
              label={t('policyFields.lateCancelDeposit')}
              name="lateCancelDeposit"
              value={field.value}
              onChangeValue={(value) => field.onChange(value === '' ? '' : asDepositPolicy(value))}
              options={[
                {
                  value: '',
                  label: t('pitchPolicy.sameAsVenue', {
                    policy: t(POLICY_LABEL_KEY[venue.lateCancelDeposit]),
                  }),
                },
                ...policyOptions,
              ]}
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
              onChangeValue={(value) => field.onChange(value === '' ? '' : asDepositPolicy(value))}
              options={[
                {
                  value: '',
                  label: t('pitchPolicy.sameAsVenue', {
                    policy: t(POLICY_LABEL_KEY[venue.noShowDeposit]),
                  }),
                },
                ...policyOptions,
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
            label={t('policyFields.conditionsText')}
            name="conditionsText"
            value={field.value}
            onChangeValue={field.onChange}
            maxLength={1000}
            placeholder={venue.conditionsText ?? ''}
            hint={
              field.value.trim() === ''
                ? t('pitchPolicy.inheritedHintPlural')
                : t('pitchPolicy.ownHintPlural')
            }
          />
        )}
      />
      <div>
        <AppButton type="submit" fullWidth={false} disabled={mutation.isPending}>
          {mutation.isPending ? t('common.saving') : t('pitchPolicy.save')}
        </AppButton>
      </div>
      {formError ? <InlineError message={formError} /> : null}
      <InlineStatus message={notice} />
    </form>
  );
}
