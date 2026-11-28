'use client';

import { applyServerFieldErrors } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput } from '@17suit/ui';
import { useTranslation } from '@17suit/i18n/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { HintedInput, InlineError, SelectField } from '@/components/seven-rc-ui';
import {
  type ReservationPaymentKind,
  type ReservationPaymentMethod,
  type VenueReservation,
} from '@/lib/owner-queries';
import {
  paymentKindOptions,
  paymentMethodOptions,
  formatAmountInput,
  parseAmount,
} from '@/lib/owner-payment';
import { customerLabel, PAYABLE_STATUSES } from '@/lib/owner-reservation-view';
import { describeError } from '@/lib/seven-rc-errors';
import { formatMoneyMinor, formatSlotWhen } from '@/lib/seven-rc-format';

const KIND_VALUES = ['deposit', 'balance', 'refund'] as const;
const METHOD_VALUES = ['cash', 'transfer', 'card', 'other'] as const;

function buildPaymentSchema(paidMinor: number) {
  return z
    .object({
      kind: z.enum(KIND_VALUES),
      method: z.enum(METHOD_VALUES),
      amount: z.string(),
      note: z.string().max(300),
    })
    .superRefine((values, issues) => {
      const amount = parseAmount(values.amount);
      if (!amount || amount <= 0) {
        issues.addIssue({
          code: 'custom',
          path: ['amount'],
          message: 'amountInvalid',
        });
      } else if (values.kind === 'refund' && amount > paidMinor) {
        issues.addIssue({
          code: 'custom',
          path: ['amount'],
          message: 'refundTooHigh',
        });
      }
    });
}
type PaymentValues = z.infer<ReturnType<typeof buildPaymentSchema>>;

/** Server DTO property to form field, only for fields with an inline error. */
const SERVER_FIELD_MAP = { amountMinor: 'amount' } as const;

export function PaymentForm({
  reservation,
  timeZone,
  isPending,
  onCancel,
  onSubmit,
}: {
  reservation: VenueReservation;
  timeZone: string;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (input: {
    kind: ReservationPaymentKind;
    method: ReservationPaymentMethod;
    amountMinor: number;
    note?: string;
  }) => Promise<void>;
}) {
  const { t, i18n } = useTranslation('owner');
  const locale = i18n.language;
  const depositDue = Math.max(0, reservation.depositMinor - reservation.paidMinor);
  const balanceDue = Math.max(0, reservation.priceMinor - reservation.paidMinor);
  const payable = PAYABLE_STATUSES.has(reservation.status);
  const kindOptions = paymentKindOptions(t).filter((option) =>
    option.value === 'refund' ? reservation.paidMinor > 0 : payable,
  );
  const dueByKind: Record<ReservationPaymentKind, number> = {
    deposit: depositDue,
    balance: balanceDue,
    refund: reservation.paidMinor,
  };
  const defaultKind: ReservationPaymentKind = !payable
    ? 'refund'
    : depositDue > 0
      ? 'deposit'
      : 'balance';
  const defaultAmount = dueByKind[defaultKind];
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError: setFieldError,
  } = useForm<PaymentValues>({
    resolver: zodResolver(buildPaymentSchema(reservation.paidMinor)),
    defaultValues: {
      kind: defaultKind,
      method: 'transfer',
      amount: defaultAmount > 0 ? formatAmountInput(defaultAmount) : '',
      note: '',
    },
  });
  const kind = watch('kind');
  const preview = parseAmount(watch('amount'));

  const submit = handleSubmit(async (values) => {
    setError(null);
    const note = values.note.trim();
    try {
      await onSubmit({
        kind: values.kind,
        method: values.method,
        amountMinor: parseAmount(values.amount) ?? 0,
        ...(note ? { note } : {}),
      });
    } catch (caught) {
      if (!applyServerFieldErrors(caught, setFieldError, SERVER_FIELD_MAP)) {
        setError(describeError(caught, t('payment.error')));
      }
    }
  });

  return (
    <form onSubmit={(event) => void submit(event)} className="grid gap-md" noValidate>
      <div className="grid gap-xs">
        <h2 id="pago-title" className="m-0 font-arvo text-lg leading-[1.3]">
          {t('payment.title')}
        </h2>
        <p className="m-0 text-md leading-[1.5] text-text first-letter:uppercase">
          {customerLabel(reservation, t)} · {reservation.pitch.name} ·{' '}
          {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone, locale)}
        </p>
        <p className="m-0 text-sm leading-[18px] text-muted">
          {reservation.priceMinor > 0
            ? t('payment.price', {
                amount: formatMoneyMinor(reservation.priceMinor, reservation.currency, locale),
              })
            : t('payment.priceUndefined')}
          {reservation.depositMinor > 0
            ? ` · ${t('payment.deposit', {
                amount: formatMoneyMinor(reservation.depositMinor, reservation.currency, locale),
              })}`
            : ''}
          {` · ${t('payment.paid', {
            amount: formatMoneyMinor(reservation.paidMinor, reservation.currency, locale),
          })}`}
        </p>
      </div>
      <div className="grid gap-sm sm:grid-cols-2">
        <Controller
          control={control}
          name="kind"
          render={({ field }) => (
            <SelectField
              label={t('payment.kind')}
              name="kind"
              value={field.value}
              onChangeValue={(value) => {
                const next = value as ReservationPaymentKind;
                field.onChange(next);
                setValue('amount', dueByKind[next] > 0 ? formatAmountInput(dueByKind[next]) : '');
              }}
              options={kindOptions}
            />
          )}
        />
        <Controller
          control={control}
          name="method"
          render={({ field }) => (
            <SelectField
              label={t('payment.method')}
              name="method"
              value={field.value}
              onChangeValue={(value) => field.onChange(value)}
              options={paymentMethodOptions(t)}
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="amount"
        render={({ field, fieldState }) => (
          <div className="grid gap-xs">
            <HintedInput
              name="amount"
              label={t('payment.amount', { currency: reservation.currency })}
              inputMode="decimal"
              autoComplete="off"
              required
              error={Boolean(fieldState.error)}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={
                preview
                  ? `${t('payment.willRecord', {
                      amount: formatMoneyMinor(preview, reservation.currency, locale),
                    })}${
                      kind === 'deposit' && reservation.status === 'pending_confirmation'
                        ? ` ${t('payment.confirmsOnDeposit')}`
                        : ''
                    }`
                  : t('payment.amountHint')
              }
            />
            <InlineError
              message={
                fieldState.error?.message
                  ? fieldState.error.message.includes(':')
                    ? t(fieldState.error.message)
                    : t(`payment.errors.${fieldState.error.message}`)
                  : null
              }
            />
          </div>
        )}
      />
      <Controller
        control={control}
        name="note"
        render={({ field }) => (
          <AppInput
            name="note"
            label={t('payment.note')}
            placeholder={t('payment.notePlaceholder')}
            maxLength={300}
            autoComplete="off"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      <InlineError message={error} />
      <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
        <AppButton variant="neutral" fullWidth={false} disabled={isPending} onPress={onCancel}>
          {t('payment.back')}
        </AppButton>
        <AppButton type="submit" fullWidth={false} disabled={isPending}>
          {isPending ? t('payment.saving') : t('payment.title')}
        </AppButton>
      </div>
    </form>
  );
}
