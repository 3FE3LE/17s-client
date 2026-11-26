'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput } from '@17suit/ui';
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
  PAYMENT_KIND_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
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
          message: 'Escribe un monto mayor que cero, p. ej. 30.000.',
        });
      } else if (values.kind === 'refund' && amount > paidMinor) {
        issues.addIssue({
          code: 'custom',
          path: ['amount'],
          message: 'La devolución supera lo que el jugador ha pagado.',
        });
      }
    });
}
type PaymentValues = z.infer<ReturnType<typeof buildPaymentSchema>>;

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
  const depositDue = Math.max(0, reservation.depositMinor - reservation.paidMinor);
  const balanceDue = Math.max(0, reservation.priceMinor - reservation.paidMinor);
  const payable = PAYABLE_STATUSES.has(reservation.status);
  const kindOptions = PAYMENT_KIND_OPTIONS.filter((option) =>
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
  const { control, handleSubmit, setValue, watch } = useForm<PaymentValues>({
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
      setError(describeError(caught, 'No se pudo registrar el pago.'));
    }
  });

  return (
    <form onSubmit={(event) => void submit(event)} className="grid gap-md" noValidate>
      <div className="grid gap-xs">
        <h2 id="pago-title" className="m-0 font-arvo text-lg leading-[1.3]">
          Registrar pago
        </h2>
        <p className="m-0 text-md leading-[1.5] text-text first-letter:uppercase">
          {customerLabel(reservation)} · {reservation.pitch.name} ·{' '}
          {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)}
        </p>
        <p className="m-0 text-sm leading-[18px] text-muted">
          {reservation.priceMinor > 0
            ? `Precio ${formatMoneyMinor(reservation.priceMinor, reservation.currency)}`
            : 'Precio sin definir'}
          {reservation.depositMinor > 0
            ? ` · anticipo ${formatMoneyMinor(reservation.depositMinor, reservation.currency)}`
            : ''}
          {` · pagado ${formatMoneyMinor(reservation.paidMinor, reservation.currency)}`}
        </p>
      </div>
      <div className="grid gap-sm sm:grid-cols-2">
        <Controller
          control={control}
          name="kind"
          render={({ field }) => (
            <SelectField
              label="Concepto"
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
              label="Medio"
              name="method"
              value={field.value}
              onChangeValue={(value) => field.onChange(value)}
              options={PAYMENT_METHOD_OPTIONS}
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
              label={`Monto (${reservation.currency})`}
              inputMode="decimal"
              autoComplete="off"
              required
              error={Boolean(fieldState.error)}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={
                preview
                  ? `Se anotará ${formatMoneyMinor(preview, reservation.currency)}.${
                      kind === 'deposit' && reservation.status === 'pending_confirmation'
                        ? ' Si cubre el anticipo, la reserva se confirma.'
                        : ''
                    }`
                  : 'Ej.: 30.000. 17Suit no mueve dinero: solo lo anota.'
              }
            />
            <InlineError message={fieldState.error?.message ?? null} />
          </div>
        )}
      />
      <Controller
        control={control}
        name="note"
        render={({ field }) => (
          <AppInput
            name="note"
            label="Nota (opcional)"
            placeholder="Ej.: comprobante Nequi 4821"
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
          Volver
        </AppButton>
        <AppButton type="submit" fullWidth={false} disabled={isPending}>
          {isPending ? 'Guardando…' : 'Registrar pago'}
        </AppButton>
      </div>
    </form>
  );
}
