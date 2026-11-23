'use client';

import { useState, type FormEvent } from 'react';
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
import { PAYMENT_METHOD_OPTIONS, formatAmountInput, parseAmount } from '@/lib/owner-payment';
import { normalizePhone, E164_PATTERN } from '@/lib/phone';
import { usePitchAvailabilityQuery } from '@/lib/player-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { formatMoneyMinor, formatSlotWhen, formatTime, sportLabel } from '@/lib/seven-rc-format';
import type { ReservationPaymentMethod } from '@/lib/owner-queries';

const RECURRING_DEFAULT_WEEKS = 8;
const RECURRING_MAX_WEEKS = 52;
const SKIP_REASON_LABEL: Record<string, string> = {
  BLOCKED: 'cancha bloqueada',
  RESERVED: 'ya reservado',
  UNAVAILABLE: 'fuera de horario',
};
const HEADING_ID = 'nueva-reserva-title';
const SLOT_UNAVAILABLE_LABEL: Record<string, string> = {
  RESERVED: 'ocupado',
  BLOCKED: 'bloqueado',
  PAST: 'ya pasó',
};

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
  const [explicitPitchId, setExplicitPitchId] = useState<string | null>(null);
  const pitch = pitches.find((item) => item.id === explicitPitchId) ?? pitches[0] ?? null;

  return (
    <section aria-labelledby={HEADING_ID} className="mt-lg grid gap-md">
      <SectionHeader
        id={HEADING_ID}
        title="Nueva reserva"
        description="Anota una reserva que te llegó por WhatsApp, llamada o en persona. El turno queda confirmado y deja de ofrecerse en la página pública."
      />
      {!pitch ? (
        <p className="m-0 text-md leading-[1.5] text-muted">
          Agrega una cancha para poder registrar reservas.
        </p>
      ) : (
        <>
          {pitches.length > 1 ? (
            <div className="max-w-[var(--container-form)]">
              <SelectField
                label="Cancha"
                name="reservationPitch"
                value={pitch.id}
                onChangeValue={setExplicitPitchId}
                options={pitches.map((item) => ({
                  value: item.id,
                  label: `${item.name} · ${sportLabel(item.sportType)}`,
                }))}
              />
            </div>
          ) : (
            <p className="m-0 text-md font-bold leading-[1.5] text-text">
              {pitch.name} · {sportLabel(pitch.sportType)}
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
  const [date, setDate] = useState(todayKey);
  const [explicitSlot, setExplicitSlot] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [deposit, setDeposit] = useState('');
  const [method, setMethod] = useState<ReservationPaymentMethod>('cash');
  const [repeat, setRepeat] = useState(false);
  const [weeks, setWeeks] = useState(String(RECURRING_DEFAULT_WEEKS));
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

  const depositMinor = deposit.trim() ? parseAmount(deposit) : null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSkipped([]);

    const name = customerName.trim();
    if (name.length < 2) {
      setError('Escribe el nombre del cliente (mínimo 2 letras).');
      return;
    }
    const normalizedPhone = phone.trim() ? normalizePhone(phone, venue.countryCode) : null;
    if (normalizedPhone && !E164_PATTERN.test(normalizedPhone)) {
      setError('El teléfono debe incluir el código de país, p. ej. +57 300 123 4567.');
      return;
    }
    if (!selectedSlot) {
      setError('Elige un horario disponible.');
      return;
    }
    const weekCount = Number(weeks);
    if (
      repeat &&
      (!Number.isInteger(weekCount) || weekCount < 2 || weekCount > RECURRING_MAX_WEEKS)
    ) {
      setError(`Usa entre 2 y ${RECURRING_MAX_WEEKS} semanas.`);
      return;
    }
    if (!repeat && deposit.trim() && (!depositMinor || depositMinor <= 0)) {
      setError('Escribe un anticipo mayor que cero, p. ej. 30.000, o déjalo vacío.');
      return;
    }
    if (depositMinor && selectedSlot.priceMinor > 0 && depositMinor > selectedSlot.priceMinor) {
      setError('El anticipo supera el precio del turno.');
      return;
    }

    if (repeat) {
      try {
        const series = await recurringMutation.mutateAsync({
          pitchId: pitch.id,
          startAt: selectedSlot.startAt,
          occurrences: weekCount,
          customerName: name,
          ...(normalizedPhone ? { customerPhone: normalizedPhone } : {}),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        });
        setSkipped(
          series.skipped.map(
            (item) =>
              `${formatSlotWhen(item.startAt, item.startAt, timeZone)} (${SKIP_REASON_LABEL[item.reason] ?? 'no disponible'})`,
          ),
        );
        setNotice(
          `Serie de ${name} creada: ${pitch.name}, ${series.created.length} de ${weekCount} semanas reservadas.`,
        );
        setExplicitSlot(null);
        setCustomerName('');
        setPhone('');
        setNotes('');
        setRepeat(false);
      } catch (caught) {
        void availabilityQuery.refetch();
        setError(describeError(caught, 'No se pudo crear la serie.'));
      }
      return;
    }

    let created;
    try {
      created = await createMutation.mutateAsync({
        pitchId: pitch.id,
        startAt: selectedSlot.startAt,
        customerName: name,
        ...(normalizedPhone ? { customerPhone: normalizedPhone } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
    } catch (caught) {
      // Nothing was created. Refresh the slots so a taken turn shows as occupied.
      void availabilityQuery.refetch();
      setError(describeError(caught, 'No se pudo crear la reserva.'));
      return;
    }

    const when = formatSlotWhen(created.startAt, created.endAt, timeZone);
    let paymentFailed = false;
    if (depositMinor) {
      try {
        await paymentMutation.mutateAsync({
          reservationId: created.id,
          input: { kind: 'deposit', method, amountMinor: depositMinor },
        });
      } catch (caught) {
        paymentFailed = true;
        setError(
          `La reserva quedó creada, pero no se pudo anotar el anticipo: ${describeError(caught, 'error desconocido')} Regístralo desde la agenda con “Registrar pago”.`,
        );
      }
    }

    setNotice(
      `Reserva de ${name} creada: ${pitch.name}, ${when}.${
        depositMinor && !paymentFailed
          ? ` Anticipo de ${formatMoneyMinor(depositMinor, currency)} anotado.`
          : ''
      }`,
    );
    setExplicitSlot(null);
    setCustomerName('');
    setPhone('');
    setNotes('');
    setDeposit('');
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby={`${HEADING_ID}-form`}
      className="grid gap-sm"
    >
      <h3 id={`${HEADING_ID}-form`} className="m-0 font-arvo text-md text-text">
        Datos de la reserva
      </h3>
      <div className="max-w-[var(--container-form)]">
        <AppInput
          type="date"
          name="reservationDate"
          label="Fecha"
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
        <legend className="mb-xs p-0 text-sm leading-[1.5] text-muted">Horario</legend>
        {availabilityQuery.isLoading ? (
          <p className="m-0 text-sm leading-[18px] text-muted">Cargando horarios…</p>
        ) : availabilityQuery.error && !availabilityQuery.data ? (
          <div className="grid gap-sm">
            <InlineError
              message={describeError(
                availabilityQuery.error,
                'No se pudieron cargar los horarios.',
              )}
            />
            <AppButton
              variant="neutral"
              fullWidth={false}
              onPress={() => void availabilityQuery.refetch()}
            >
              Reintentar
            </AppButton>
          </div>
        ) : slots.length === 0 ? (
          <p className="m-0 text-md leading-[1.5] text-muted">
            {pitch.name} no tiene horarios ese día.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-sm sm:grid-cols-4 lg:grid-cols-6">
            {slots.map((slot) => {
              const available = slot.status === 'AVAILABLE';
              const start = formatTime(slot.startAt, timeZone);
              const unavailable = SLOT_UNAVAILABLE_LABEL[slot.status] ?? 'no disponible';
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
                        ? `${start}, ${formatMoneyMinor(slot.priceMinor, currency)}`
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
                        ? formatMoneyMinor(slot.priceMinor, currency)
                        : 'libre'
                      : unavailable}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

      <div className="grid max-w-[var(--container-form)] gap-sm sm:grid-cols-2">
        <AppInput
          type="text"
          name="customerName"
          label="Nombre del cliente"
          required
          minLength={2}
          maxLength={120}
          autoComplete="off"
          value={customerName}
          onChangeText={setCustomerName}
        />
        <HintedInput
          type="tel"
          name="customerPhone"
          label="Teléfono (opcional)"
          inputMode="tel"
          autoComplete="off"
          value={phone}
          onChangeText={setPhone}
          hint="Ej.: 300 123 4567 o +57 300 123 4567."
        />
      </div>
      <div className="grid max-w-[var(--container-form)] gap-sm">
        <label className="flex items-center gap-sm text-md leading-[1.5] text-text">
          <input
            type="checkbox"
            name="repeatWeekly"
            checked={repeat}
            onChange={(event) => setRepeat(event.target.checked)}
          />
          Repetir cada semana (cancha fija)
        </label>
        {repeat ? (
          <HintedInput
            type="number"
            name="repeatWeeks"
            label="Semanas (incluye la primera)"
            inputMode="numeric"
            min={2}
            max={RECURRING_MAX_WEEKS}
            autoComplete="off"
            value={weeks}
            onChangeText={setWeeks}
            hint="Mismo día y hora cada semana. Los turnos ocupados o bloqueados se omiten y te los mostramos."
          />
        ) : null}
      </div>
      <div className="grid max-w-[var(--container-form)] gap-sm sm:grid-cols-2">
        <HintedInput
          name="deposit"
          label={`Anticipo (${currency}, opcional)`}
          inputMode="decimal"
          autoComplete="off"
          value={deposit}
          disabled={repeat}
          onChangeText={setDeposit}
          hint={
            depositMinor
              ? `Se anotará ${formatMoneyMinor(depositMinor, currency)}.`
              : selectedSlot && selectedSlot.priceMinor > 0
                ? `Precio del turno ${formatAmountInput(selectedSlot.priceMinor)}. 17Suit no mueve dinero: solo lo anota.`
                : 'Ej.: 30.000. 17Suit no mueve dinero: solo lo anota.'
          }
        />
        <SelectField
          label="Medio del anticipo"
          name="depositMethod"
          value={method}
          onChangeValue={(value) => setMethod(value as ReservationPaymentMethod)}
          options={PAYMENT_METHOD_OPTIONS}
          disabled={!depositMinor || repeat}
        />
      </div>
      <div className="max-w-[var(--container-form)]">
        <AppInput
          type="text"
          name="notes"
          label="Nota (opcional)"
          maxLength={500}
          autoComplete="off"
          value={notes}
          onChangeText={setNotes}
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={isPending}>
          {isPending ? 'Guardando…' : 'Crear reserva'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
      {skipped.length > 0 ? (
        <div role="status" className="grid gap-xs text-sm leading-[18px] text-muted">
          <p className="m-0 font-bold text-text">Semanas omitidas ({skipped.length}):</p>
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
