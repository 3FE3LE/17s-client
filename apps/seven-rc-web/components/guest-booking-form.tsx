'use client';

import { useActionState, useState } from 'react';
import { AppButton } from '@17suit/ui';
import { reserveAction, type BookingFormState } from '@/app/c/[slug]/actions';
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
}

const INITIAL: BookingFormState = { fieldErrors: {}, formError: null };

function holdText(minutes: number): string {
  if (minutes < 60) return `${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const base = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  return rest === 0 ? base : `${base} y ${rest} minutos`;
}

export function GuestBookingForm(props: GuestBookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    reserveAction.bind(null, props.slug),
    INITIAL,
  );
  const needsDeposit = props.depositPercent > 0;
  // Controlled: React resets uncontrolled fields after a form action, which would wipe a failed submit.
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <form
      action={formAction}
      noValidate
      aria-labelledby="reservar-titulo"
      className="grid gap-md rounded-[var(--radius-lg)] border border-border-strong p-md"
    >
      <h2 id="reservar-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
        Reserva este horario
      </h2>
      <input type="hidden" name="pitchId" value={props.pitchId} />
      <input type="hidden" name="startAt" value={props.startAt} />
      <input type="hidden" name="fecha" value={props.date} />
      <input type="hidden" name="policyVersion" value={props.policyVersion} />

      <dl className="m-0 grid gap-xs text-md text-text">
        <div className="grid gap-[2px]">
          <dt className="text-sm leading-[18px] text-muted">Cancha y horario</dt>
          <dd className="m-0">
            {props.pitchName} · {props.when}
          </dd>
        </div>
        <div className="grid gap-[2px]">
          <dt className="text-sm leading-[18px] text-muted">Precio total</dt>
          <dd className="m-0">{props.priceLabel}</dd>
        </div>
        <div className="grid gap-[2px]">
          <dt className="text-sm leading-[18px] text-muted">Anticipo</dt>
          <dd className="m-0">
            {needsDeposit
              ? `${props.depositLabel} (${props.depositPercent} %)`
              : 'No pide anticipo'}
          </dd>
        </div>
      </dl>
      <p className="m-0 text-sm leading-[18px] text-muted">
        {needsDeposit
          ? `Apartamos el turno ${holdText(props.holdMinutes)} para que pagues el anticipo. Si no llega a tiempo, el horario se libera.`
          : 'Tu reserva se confirma al instante.'}
      </p>

      <div className="grid gap-md md:grid-cols-2">
        <HintedInput
          type="text"
          name="customerName"
          label="Tu nombre"
          autoComplete="name"
          maxLength={80}
          required
          errorMessage={state.fieldErrors.name ?? null}
          value={name}
          onChangeText={setName}
          hint="Como quieres que te llame el complejo."
        />
        <HintedInput
          type="tel"
          name="customerPhone"
          label="Tu teléfono o WhatsApp"
          autoComplete="tel"
          inputMode="tel"
          spellCheck={false}
          placeholder="+57 300 123 4567"
          required
          errorMessage={state.fieldErrors.phone ?? null}
          value={phone}
          onChangeText={setPhone}
          hint="El complejo lo usa para confirmarte o avisarte de cambios."
        />
      </div>
      <TextAreaField
        label="Nota (opcional)"
        name="notes"
        maxLength={300}
        value={notes}
        onChangeValue={setNotes}
      />

      <InlineError message={state.formError} />
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={isPending}>
          {isPending ? 'Reservando…' : 'Reservar'}
        </AppButton>
      </div>
    </form>
  );
}
