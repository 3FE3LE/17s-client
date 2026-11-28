'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useTransition, type FormEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from '@17suit/i18n/react';
import { AppButton } from '@17suit/ui';
import { reserveAction, type BookingFormState } from '@/app/c/[slug]/actions';
import { policySummaryLines, type PolicySummaryInput } from '@/lib/deposit-policy';
import { HintedInput, InlineError, TextAreaField } from '@/components/seven-rc-ui';

export interface GuestBookingFormProps {
  slug: string;
  date: string;
  pitchId: string;
  startAt: string;
  /** Already formatted in the venue zone, e.g. "sábado 22 de noviembre · 7:00 p. m. – 8:00 p. m.". */
  when: string;
  pitchName: string;
  priceLabel: string;
  /** Zero when the venue confirms bookings without an advance. */
  depositPercent: number;
  depositLabel: string;
  holdMinutes: number;
  /** Venue conditions version the visitor saw; the server rejects the booking if it moved. */
  policyVersion: number;
  /** Conditions of this pitch, shown before the player confirms. */
  policy: PolicySummaryInput;
}

// Cheap checks before the round trip. The server action still owns phone normalization by country.
const guestBookingSchema = z.object({
  customerName: z.string().trim().min(2, 'nameRequired').max(80),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,20}$/, 'phoneInvalid'),
  notes: z.string().max(300),
});
type GuestBookingValues = z.infer<typeof guestBookingSchema>;

const INITIAL: BookingFormState = { fieldErrors: {}, formError: null };

type PlayT = ReturnType<typeof useTranslation<'play'>>['t'];

function holdText(minutes: number, t: PlayT): string {
  if (minutes < 60) return t('guestForm.minutes', { minutes });
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const base = t('guestForm.hours', { count: hours });
  return rest === 0 ? base : t('guestForm.hoursAndMinutes', { base, rest });
}

/** Schema errors are stable codes; anything else (server text) passes through. */
function fieldMessage(code: string | undefined, t: PlayT): string | null {
  if (code === 'nameRequired') return t('guestForm.nameRequired');
  if (code === 'phoneInvalid') return t('guestForm.phoneInvalid');
  return code ?? null;
}

export function GuestBookingForm(props: GuestBookingFormProps) {
  const { t } = useTranslation('play');
  const [state, formAction, isPending] = useActionState(
    reserveAction.bind(null, props.slug),
    INITIAL,
  );
  const needsDeposit = props.depositPercent > 0;
  const [isSending, startTransition] = useTransition();
  const { control, handleSubmit } = useForm<GuestBookingValues>({
    resolver: zodResolver(guestBookingSchema),
    defaultValues: { customerName: '', customerPhone: '', notes: '' },
  });
  const submit = handleSubmit((_values, event) => {
    const form = event?.target as EventTarget | undefined;
    if (!(form instanceof HTMLFormElement)) return;
    const data = new FormData(form);
    startTransition(() => formAction(data));
  });
  const pending = isPending || isSending;

  return (
    <form
      onSubmit={(event: FormEvent<HTMLFormElement>) => void submit(event)}
      noValidate
      aria-labelledby="reservar-titulo"
      className="grid gap-md rounded-[var(--radius-lg)] border border-border-strong p-md"
    >
      <h2 id="reservar-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
        {t('guestForm.title')}
      </h2>
      <input type="hidden" name="pitchId" value={props.pitchId} />
      <input type="hidden" name="startAt" value={props.startAt} />
      <input type="hidden" name="fecha" value={props.date} />
      <input type="hidden" name="policyVersion" value={props.policyVersion} />

      <dl className="m-0 grid gap-xs text-md text-text">
        <div className="grid gap-[2px]">
          <dt className="text-sm leading-[18px] text-muted">{t('guestForm.pitchAndTime')}</dt>
          <dd className="m-0">
            {props.pitchName} · {props.when}
          </dd>
        </div>
        <div className="grid gap-[2px]">
          <dt className="text-sm leading-[18px] text-muted">{t('guestForm.total')}</dt>
          <dd className="m-0">{props.priceLabel}</dd>
        </div>
        <div className="grid gap-[2px]">
          <dt className="text-sm leading-[18px] text-muted">{t('guestForm.deposit')}</dt>
          <dd className="m-0">
            {needsDeposit
              ? t('guestForm.depositValue', {
                  amount: props.depositLabel,
                  percent: props.depositPercent,
                })
              : t('guestForm.noDeposit')}
          </dd>
        </div>
      </dl>
      <p className="m-0 text-sm leading-[18px] text-muted">
        {needsDeposit
          ? t('guestForm.holdNote', { hold: holdText(props.holdMinutes, t) })
          : t('guestForm.instant')}
      </p>

      <section
        aria-labelledby="condiciones-titulo"
        className="grid gap-xs rounded-[var(--radius-md)] border border-border-default p-sm"
      >
        <h3 id="condiciones-titulo" className="m-0 text-sm font-bold leading-[18px] text-text">
          {t('guestForm.conditionsTitle')}
        </h3>
        <ul className="m-0 grid list-disc gap-[2px] pl-md text-sm leading-[18px] text-muted">
          {policySummaryLines(props.policy, t).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {props.policy.conditionsText?.trim() ? (
          <p className="m-0 whitespace-pre-line text-sm leading-[18px] text-text">
            {props.policy.conditionsText.trim()}
          </p>
        ) : null}
        <p className="m-0 text-sm leading-[18px] text-muted">{t('guestForm.accept')}</p>
      </section>

      <div className="grid gap-md md:grid-cols-2">
        <Controller
          control={control}
          name="customerName"
          render={({ field, fieldState }) => (
            <HintedInput
              type="text"
              name="customerName"
              label={t('guestForm.name')}
              autoComplete="name"
              maxLength={80}
              errorMessage={
                fieldMessage(fieldState.error?.message, t) ?? state.fieldErrors.name ?? null
              }
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={t('guestForm.nameHint')}
            />
          )}
        />
        <Controller
          control={control}
          name="customerPhone"
          render={({ field, fieldState }) => (
            <HintedInput
              type="tel"
              name="customerPhone"
              label={t('guestForm.phone')}
              autoComplete="tel"
              inputMode="tel"
              spellCheck={false}
              placeholder="+57 300 123 4567"
              errorMessage={
                fieldMessage(fieldState.error?.message, t) ?? state.fieldErrors.phone ?? null
              }
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint={t('guestForm.phoneHint')}
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <TextAreaField
            label={t('guestForm.note')}
            name="notes"
            maxLength={300}
            value={field.value}
            onChangeValue={field.onChange}
          />
        )}
      />

      <InlineError message={state.formError} />
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={pending}>
          {pending ? t('guestForm.submitting') : t('guestForm.submit')}
        </AppButton>
      </div>
    </form>
  );
}
