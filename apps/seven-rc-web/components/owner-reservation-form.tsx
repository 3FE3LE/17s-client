'use client';

import { applyServerFieldErrors } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@17suit/i18n/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { AppButton, AppInput, cx } from '@17suit/ui';
import {
  HintedInput,
  InlineError,
  InlineStatus,
  SectionHeader,
  SelectField,
} from '@/components/seven-rc-ui';
import {
  useCreateOwnerReservationMutation,
  useCreateRecurringReservationMutation,
  useRecordReservationPaymentMutation,
  type OwnerVenue,
  type PitchWithPricing,
} from '@/lib/owner-queries';
import { paymentMethodOptions, formatAmountInput, parseAmount } from '@/lib/owner-payment';
import { normalizePhone, E164_PATTERN } from '@/lib/phone';
import { usePitchAvailabilityQuery } from '@/lib/player-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { formatMoneyMinor, formatSlotWhen, formatTime, sportLabel } from '@/lib/seven-rc-format';
import type { ReservationPaymentMethod } from '@/lib/owner-queries';

const RECURRING_DEFAULT_WEEKS = 8;
const RECURRING_MAX_WEEKS = 52;
/** Server DTO property to form field, only for fields with an inline error. */
const CREATE_FIELD_MAP = {
  customerName: 'customerName',
  customerPhone: 'customerPhone',
} as const;
const SERIES_FIELD_MAP = { ...CREATE_FIELD_MAP, occurrences: 'weeks' } as const;
const SKIP_REASONS = new Set(['BLOCKED', 'RESERVED', 'UNAVAILABLE']);
interface ReservationSchemaContext {
  countryCode: string;
  hasSlot: boolean;
  slotPriceMinor: number;
}

/** Rules that depend on the chosen turn (price, availability) come in through `ctx`. */
function buildReservationSchema(ctx: ReservationSchemaContext) {
  return z
    .object({
      customerName: z.string().trim().min(2, 'nameRequired').max(120),
      customerPhone: z.string(),
      notes: z.string().max(500),
      deposit: z.string(),
      method: z.string(),
      repeat: z.boolean(),
      weeks: z.string(),
      slot: z.string(),
    })
    .superRefine((values, issues) => {
      const phone = values.customerPhone.trim();
      if (phone) {
        const normalized = normalizePhone(phone, ctx.countryCode);
        if (!normalized || !E164_PATTERN.test(normalized)) {
          issues.addIssue({
            code: 'custom',
            path: ['customerPhone'],
            message: 'phoneInvalid',
          });
        }
      }
      if (!ctx.hasSlot) {
        issues.addIssue({
          code: 'custom',
          path: ['slot'],
          message: 'slotRequired',
        });
      }
      if (values.repeat) {
        const weekCount = Number(values.weeks);
        if (!Number.isInteger(weekCount) || weekCount < 2 || weekCount > RECURRING_MAX_WEEKS) {
          issues.addIssue({
            code: 'custom',
            path: ['weeks'],
            message: 'weeksRange',
          });
        }
      } else if (values.deposit.trim()) {
        const amount = parseAmount(values.deposit);
        if (!amount || amount <= 0) {
          issues.addIssue({
            code: 'custom',
            path: ['deposit'],
            message: 'depositInvalid',
          });
        } else if (ctx.slotPriceMinor > 0 && amount > ctx.slotPriceMinor) {
          issues.addIssue({
            code: 'custom',
            path: ['deposit'],
            message: 'depositTooHigh',
          });
        }
      }
    });
}
type ReservationValues = z.infer<ReturnType<typeof buildReservationSchema>>;

const HEADING_ID = 'nueva-reserva-title';
const SLOT_UNAVAILABLE_STATUSES = new Set(['RESERVED', 'BLOCKED', 'PAST']);

export interface OwnerReservationSectionProps {
  venue: OwnerVenue;
  pitches: PitchWithPricing[];
  timeZone: string;
  /** Venue-local `YYYY-MM-DD` of today. */
  todayKey: string;
}

/**
 * Walk-in / phone booking from the agenda (origin `owner`). The slot comes from the
 * pitch availability, so occupied and blocked turns are visible and not selectable; a
 * race with another booking still surfaces as the server's 409 without creating data.
 * An optional deposit is recorded right after the reservation exists.
 */
export function OwnerReservationSection({
  venue,
  pitches,
  timeZone,
  todayKey,
}: OwnerReservationSectionProps) {
  const { t } = useTranslation('owner');
  const [explicitPitchId, setExplicitPitchId] = useState<string | null>(null);
  const pitch = pitches.find((item) => item.id === explicitPitchId) ?? pitches[0] ?? null;

  return (
    <section aria-labelledby={HEADING_ID} className="mt-lg grid gap-md">
      <SectionHeader
        id={HEADING_ID}
        title={t('reservationForm.title')}
        description={t('reservationForm.description')}
      />
      {!pitch ? (
        <p className="m-0 text-md leading-[1.5] text-muted">{t('reservationForm.noPitch')}</p>
      ) : (
        <>
          {pitches.length > 1 ? (
            <div className="max-w-[var(--container-form)]">
              <SelectField
                label={t('reservationForm.pitch')}
                name="reservationPitch"
                value={pitch.id}
                onChangeValue={setExplicitPitchId}
                options={pitches.map((item) => ({
                  value: item.id,
                  label: `${item.name} · ${sportLabel(item.sportType, t)}`,
                }))}
              />
            </div>
          ) : (
            <p className="m-0 text-md font-bold leading-[1.5] text-text">
              {pitch.name} · {sportLabel(pitch.sportType, t)}
            </p>
          )}
          <OwnerReservationForm
            key={pitch.id}
            venue={venue}
            pitch={pitch}
            timeZone={timeZone}
            todayKey={todayKey}
          />
        </>
      )}
    </section>
  );
}

function OwnerReservationForm({
  venue,
  pitch,
  timeZone,
  todayKey,
}: {
  venue: OwnerVenue;
  pitch: PitchWithPricing;
  timeZone: string;
  todayKey: string;
}) {
  const { t, i18n } = useTranslation('owner');
  const locale = i18n.language;
  const [date, setDate] = useState(todayKey);
  const [explicitSlot, setExplicitSlot] = useState<string | null>(null);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const availabilityQuery = usePitchAvailabilityQuery(pitch.id, date || null);
  const slots = availabilityQuery.data?.slots ?? [];
  const currency = availabilityQuery.data?.currency ?? venue.currency;
  // A slot taken meanwhile stops being selectable: the choice is derived, never stale.
  const selectedSlot =
    slots.find((slot) => slot.startAt === explicitSlot && slot.status === 'AVAILABLE') ?? null;

  const createMutation = useCreateOwnerReservationMutation(venue.id);
  const paymentMutation = useRecordReservationPaymentMutation(venue.id);
  const recurringMutation = useCreateRecurringReservationMutation(venue.id);
  const isPending =
    createMutation.isPending || paymentMutation.isPending || recurringMutation.isPending;

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    watch,
    formState,
    setError: setFieldError,
  } = useForm<ReservationValues>({
    resolver: (values, context, options) =>
      zodResolver(
        buildReservationSchema({
          countryCode: venue.countryCode,
          hasSlot: Boolean(selectedSlot),
          slotPriceMinor: selectedSlot?.priceMinor ?? 0,
        }),
      )(values, context, options),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      notes: '',
      deposit: '',
      method: 'cash',
      repeat: false,
      weeks: String(RECURRING_DEFAULT_WEEKS),
      slot: '',
    },
  });
  const repeat = watch('repeat');
  const deposit = watch('deposit');
  const depositMinor = deposit.trim() ? parseAmount(deposit) : null;
  const errorText = (message: string | undefined) =>
    message
      ? message.includes(':')
        ? t(message)
        : t(`reservationForm.errors.${message}`, { max: RECURRING_MAX_WEEKS })
      : null;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setNotice(null);
    setSkipped([]);
    if (!selectedSlot) return;

    const name = values.customerName;
    const phone = values.customerPhone.trim();
    const normalizedPhone = phone ? normalizePhone(phone, venue.countryCode) : null;
    const notes = values.notes.trim();
    const weekCount = Number(values.weeks);
    const method = values.method as ReservationPaymentMethod;

    if (values.repeat) {
      try {
        const series = await recurringMutation.mutateAsync({
          pitchId: pitch.id,
          startAt: selectedSlot.startAt,
          occurrences: weekCount,
          customerName: name,
          ...(normalizedPhone ? { customerPhone: normalizedPhone } : {}),
          ...(notes ? { notes } : {}),
        });
        setSkipped(
          series.skipped.map(
            (item) =>
              `${formatSlotWhen(item.startAt, item.startAt, timeZone, locale)} (${
                SKIP_REASONS.has(item.reason)
                  ? t(`reservationForm.skipReason.${item.reason}`)
                  : t('reservationForm.unavailable')
              })`,
          ),
        );
        setNotice(
          t('reservationForm.seriesCreated', {
            name,
            pitch: pitch.name,
            created: series.created.length,
            total: weekCount,
          }),
        );
        setExplicitSlot(null);
        reset({ ...getValues(), customerName: '', customerPhone: '', notes: '', repeat: false });
      } catch (caught) {
        void availabilityQuery.refetch();
        if (!applyServerFieldErrors(caught, setFieldError, SERIES_FIELD_MAP)) {
          setError(describeError(caught, t('reservationForm.seriesError')));
        }
      }
      return;
    }

    const depositAmount = values.deposit.trim() ? parseAmount(values.deposit) : null;
    let created;
    try {
      created = await createMutation.mutateAsync({
        pitchId: pitch.id,
        startAt: selectedSlot.startAt,
        customerName: name,
        ...(normalizedPhone ? { customerPhone: normalizedPhone } : {}),
        ...(notes ? { notes } : {}),
      });
    } catch (caught) {
      // Nothing was created. Refresh the slots so a taken turn shows as occupied.
      void availabilityQuery.refetch();
      if (!applyServerFieldErrors(caught, setFieldError, CREATE_FIELD_MAP)) {
        setError(describeError(caught, t('reservationForm.createError')));
      }
      return;
    }

    const when = formatSlotWhen(created.startAt, created.endAt, timeZone, locale);
    let paymentFailed = false;
    if (depositAmount) {
      try {
        await paymentMutation.mutateAsync({
          reservationId: created.id,
          input: { kind: 'deposit', method, amountMinor: depositAmount },
        });
      } catch (caught) {
        paymentFailed = true;
        setError(
          t('reservationForm.depositFailed', {
            error: describeError(caught, t('reservationForm.unknownError')),
          }),
        );
      }
    }

    setNotice(
      `${t('reservationForm.created', { name, pitch: pitch.name, when })}${
        depositAmount && !paymentFailed
          ? ` ${t('reservationForm.depositRecorded', {
              amount: formatMoneyMinor(depositAmount, currency, locale),
            })}`
          : ''
      }`,
    );
    setExplicitSlot(null);
    reset({ ...getValues(), customerName: '', customerPhone: '', notes: '', deposit: '' });
  });

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby={`${HEADING_ID}-form`}
      className="grid gap-sm"
      noValidate
    >
      <h3 id={`${HEADING_ID}-form`} className="m-0 font-arvo text-md text-text">
        {t('reservationForm.details')}
      </h3>
      <div className="max-w-[var(--container-form)]">
        <AppInput
          type="date"
          name="reservationDate"
          label={t('reservationForm.date')}
          required
          min={todayKey}
          max={undefined}
          value={date}
          onChangeText={(value) => {
            setDate(value);
            setExplicitSlot(null);
          }}
        />
      </div>

      <fieldset className="m-0 grid gap-xs border-0 p-0">
        <legend className="mb-xs p-0 text-sm leading-[1.5] text-muted">
          {t('reservationForm.slot')}
        </legend>
        {availabilityQuery.isLoading ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            {t('reservationForm.loadingSlots')}
          </p>
        ) : availabilityQuery.error && !availabilityQuery.data ? (
          <div className="grid gap-sm">
            <InlineError
              message={describeError(availabilityQuery.error, t('reservationForm.slotsLoadError'))}
            />
            <AppButton
              variant="neutral"
              fullWidth={false}
              onPress={() => void availabilityQuery.refetch()}
            >
              {t('reservationForm.retry')}
            </AppButton>
          </div>
        ) : slots.length === 0 ? (
          <p className="m-0 text-md leading-[1.5] text-muted">
            {t('reservationForm.noSlots', { pitch: pitch.name })}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-sm sm:grid-cols-4 lg:grid-cols-6">
            {slots.map((slot) => {
              const available = slot.status === 'AVAILABLE';
              const start = formatTime(slot.startAt, timeZone, locale);
              const unavailable = SLOT_UNAVAILABLE_STATUSES.has(slot.status)
                ? t(`reservationForm.slotStatus.${slot.status}`)
                : t('reservationForm.unavailable');
              return (
                <label
                  key={slot.startAt}
                  className={cx(
                    'grid cursor-pointer content-center justify-items-center gap-0 rounded-[var(--radius-lg)] border px-sm py-sm text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
                    available
                      ? 'border-border-strong bg-surface text-text'
                      : 'cursor-not-allowed border-border-default bg-background text-muted',
                    selectedSlot?.startAt === slot.startAt && 'border-brand bg-brand/10 font-bold',
                  )}
                >
                  <input
                    type="radio"
                    name="reservationSlot"
                    value={slot.startAt}
                    checked={selectedSlot?.startAt === slot.startAt}
                    disabled={!available}
                    onChange={() => setExplicitSlot(slot.startAt)}
                    aria-label={
                      available
                        ? `${start}, ${formatMoneyMinor(slot.priceMinor, currency, locale)}`
                        : `${start}, ${unavailable}`
                    }
                    className="sr-only"
                  />
                  <span className={cx('tabular-nums leading-[1.3]', !available && 'line-through')}>
                    {start}
                  </span>
                  <span className="text-xs leading-[1.3] text-muted">
                    {available
                      ? slot.priceMinor > 0
                        ? formatMoneyMinor(slot.priceMinor, currency, locale)
                        : t('reservationForm.free')
                      : unavailable}
                  </span>
                </label>
              );
            })}
          </div>
        )}
        <InlineError message={errorText(formState.errors.slot?.message)} />
      </fieldset>

      <div className="grid max-w-[var(--container-form)] gap-sm sm:grid-cols-2">
        <Controller
          control={control}
          name="customerName"
          render={({ field, fieldState }) => (
            <div className="grid content-start gap-xs">
              <AppInput
                type="text"
                name="customerName"
                label={t('reservationForm.customerName')}
                maxLength={120}
                autoComplete="off"
                error={Boolean(fieldState.error)}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <InlineError message={errorText(fieldState.error?.message)} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="customerPhone"
          render={({ field, fieldState }) => (
            <HintedInput
              type="tel"
              name="customerPhone"
              label={t('reservationForm.phone')}
              inputMode="tel"
              autoComplete="off"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={t('reservationForm.phoneHint')}
              errorMessage={errorText(fieldState.error?.message)}
            />
          )}
        />
      </div>
      <div className="grid max-w-[var(--container-form)] gap-sm">
        <Controller
          control={control}
          name="repeat"
          render={({ field }) => (
            <label className="flex items-center gap-sm text-md leading-[1.5] text-text">
              <input
                type="checkbox"
                name="repeatWeekly"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
              {t('reservationForm.repeat')}
            </label>
          )}
        />
        {repeat ? (
          <Controller
            control={control}
            name="weeks"
            render={({ field, fieldState }) => (
              <HintedInput
                type="number"
                name="repeatWeeks"
                label={t('reservationForm.weeks')}
                inputMode="numeric"
                min={2}
                max={RECURRING_MAX_WEEKS}
                autoComplete="off"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                hint={t('reservationForm.weeksHint')}
                errorMessage={errorText(fieldState.error?.message)}
              />
            )}
          />
        ) : null}
      </div>
      <div className="grid max-w-[var(--container-form)] gap-sm sm:grid-cols-2">
        <Controller
          control={control}
          name="deposit"
          render={({ field, fieldState }) => (
            <HintedInput
              name="deposit"
              label={t('reservationForm.deposit', { currency })}
              inputMode="decimal"
              autoComplete="off"
              value={field.value}
              disabled={repeat}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errorText(fieldState.error?.message)}
              hint={
                depositMinor
                  ? t('reservationForm.willRecord', {
                      amount: formatMoneyMinor(depositMinor, currency, locale),
                    })
                  : selectedSlot && selectedSlot.priceMinor > 0
                    ? t('reservationForm.slotPriceHint', {
                        amount: formatAmountInput(selectedSlot.priceMinor),
                      })
                    : t('reservationForm.depositHint')
              }
            />
          )}
        />
        <Controller
          control={control}
          name="method"
          render={({ field }) => (
            <SelectField
              label={t('reservationForm.depositMethod')}
              name="depositMethod"
              value={field.value}
              onChangeValue={field.onChange}
              options={paymentMethodOptions(t)}
              disabled={!depositMinor || repeat}
            />
          )}
        />
      </div>
      <div className="max-w-[var(--container-form)]">
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <AppInput
              type="text"
              name="notes"
              label={t('reservationForm.note')}
              maxLength={500}
              autoComplete="off"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={isPending || formState.isSubmitting}>
          {isPending || formState.isSubmitting
            ? t('reservationForm.saving')
            : t('reservationForm.submit')}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
      {skipped.length > 0 ? (
        <div role="status" className="grid gap-xs text-sm leading-[18px] text-muted">
          <p className="m-0 font-bold text-text">
            {t('reservationForm.skippedWeeks', { count: skipped.length })}
          </p>
          <ul className="m-0 grid gap-0 pl-md">
            {skipped.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}
