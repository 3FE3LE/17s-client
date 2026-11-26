import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppBadge } from '@17suit/ui';
import { CancelReservation, ShareReservation } from '@/components/reservation-link-actions';
import { asDepositPolicy, DEPOSIT_OUTCOME_LABEL, policySummaryLines } from '@/lib/deposit-policy';
import { fetchPublicReservation } from '@/lib/public-venue-api';
import {
  dateKeyInTimeZone,
  formatLongDate,
  formatMoneyMinor,
  formatSlotWhen,
  formatTime,
  reservationStatus,
  safeTimeZone,
  sportLabel,
} from '@/lib/seven-rc-format';

interface PageProps {
  params: Promise<{ slug: string; token: string }>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The token is a bearer secret: keep it out of search indexes and referrers.
export const metadata: Metadata = {
  title: 'Tu reserva | Seven Reservations Club',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function PublicReservationPage({ params }: PageProps) {
  const { slug, token } = await params;
  if (!UUID.test(token)) notFound();
  const reservation = await fetchPublicReservation(token);
  if (!reservation) notFound();

  const timeZone = safeTimeZone(reservation.venue.timezone);
  const status = reservationStatus(reservation.status);
  const pending = reservation.status === 'pending_confirmation';
  const owed = Math.max(reservation.depositMinor - reservation.paidMinor, 0);
  const instructions = reservation.venue.paymentInstructions?.trim();
  const phone = reservation.venue.contactPhone;
  const venueSlug = reservation.venue.slug ?? slug;
  const active = pending || reservation.status === 'confirmed';
  const canCancel = active && Date.now() <= Date.parse(reservation.cancellableUntil);
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  const proto = requestHeaders.get('x-forwarded-proto') ?? 'https';
  const shareUrl = host
    ? `${proto}://${host}/c/${encodeURIComponent(slug)}/reserva/${encodeURIComponent(token)}`
    : null;

  return (
    <main className="mx-auto grid w-full max-w-[var(--container-content)] gap-lg px-lg py-xl">
      <header className="grid gap-xs">
        <div className="flex flex-wrap items-center gap-sm">
          <h1 className="m-0 font-arvo text-2xl leading-[1.2] text-text">Tu reserva</h1>
          <AppBadge variant={status.variant}>{status.label}</AppBadge>
        </div>
        <p className="m-0 text-md text-muted">
          {reservation.venue.name}
          {reservation.venue.address ? ` · ${reservation.venue.address}` : ''}
        </p>
      </header>

      <section
        aria-labelledby="detalle-titulo"
        className="grid gap-sm rounded-[var(--radius-lg)] border border-border-default p-md"
      >
        <h2 id="detalle-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
          Detalle
        </h2>
        <dl className="m-0 grid gap-xs text-md text-text">
          <div className="grid gap-[2px]">
            <dt className="text-sm leading-[18px] text-muted">Cancha</dt>
            <dd className="m-0">
              {reservation.pitch.name} · {sportLabel(reservation.pitch.sportType)}
            </dd>
          </div>
          <div className="grid gap-[2px]">
            <dt className="text-sm leading-[18px] text-muted">Horario</dt>
            <dd className="m-0">
              {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)}
            </dd>
          </div>
          <div className="grid gap-[2px]">
            <dt className="text-sm leading-[18px] text-muted">Precio total</dt>
            <dd className="m-0">
              {formatMoneyMinor(reservation.priceMinor, reservation.currency)}
            </dd>
          </div>
          {reservation.depositMinor > 0 ? (
            <div className="grid gap-[2px]">
              <dt className="text-sm leading-[18px] text-muted">Anticipo</dt>
              <dd className="m-0">
                {formatMoneyMinor(reservation.depositMinor, reservation.currency)}
                {reservation.paidMinor > 0
                  ? ` · pagado ${formatMoneyMinor(reservation.paidMinor, reservation.currency)}`
                  : ''}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      {pending ? (
        <section
          aria-labelledby="pago-titulo"
          className="grid gap-sm rounded-[var(--radius-lg)] border border-border-strong p-md"
        >
          <h2 id="pago-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
            Cómo pagar el anticipo
          </h2>
          {owed > 0 ? (
            <p className="m-0 text-md text-text">
              Paga {formatMoneyMinor(owed, reservation.currency)} para confirmar tu turno.
            </p>
          ) : null}
          {instructions ? (
            <p className="m-0 whitespace-pre-line text-md text-text">{instructions}</p>
          ) : (
            <p className="m-0 text-sm leading-[18px] text-muted">
              El complejo aún no publicó instrucciones de pago. Escríbele para coordinar.
            </p>
          )}
          {reservation.holdExpiresAt ? (
            <p className="m-0 text-sm leading-[18px] text-muted">
              Tu turno queda apartado hasta el{' '}
              {formatLongDate(dateKeyInTimeZone(reservation.holdExpiresAt, timeZone))} a las{' '}
              {formatTime(reservation.holdExpiresAt, timeZone)}. Si no llega el pago, se libera.
            </p>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="condiciones-titulo" className="grid gap-xs">
        <h2 id="condiciones-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
          Condiciones que aceptaste
        </h2>
        <ul className="m-0 grid list-disc gap-[2px] pl-md text-sm leading-[18px] text-muted">
          {policySummaryLines({
            cancellationWindowHours: reservation.policy.cancellationWindowHours,
            lateCancelDeposit: asDepositPolicy(reservation.policy.lateCancelDeposit),
            noShowDeposit: asDepositPolicy(reservation.policy.noShowDeposit),
          }).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {reservation.policy.conditionsText?.trim() ? (
          <p className="m-0 whitespace-pre-line text-sm leading-[18px] text-text">
            {reservation.policy.conditionsText.trim()}
          </p>
        ) : null}
        {reservation.depositOutcome !== 'none' ? (
          <p className="m-0 text-sm leading-[18px] text-text">
            {DEPOSIT_OUTCOME_LABEL[reservation.depositOutcome]}.
          </p>
        ) : null}
      </section>

      {active ? (
        <section aria-labelledby="cancelar-titulo" className="grid gap-xs">
          <h2 id="cancelar-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
            Cancelar
          </h2>
          {canCancel ? (
            <>
              <p className="m-0 text-sm leading-[18px] text-muted">
                Puedes cancelar sin costo hasta el{' '}
                {formatLongDate(dateKeyInTimeZone(reservation.cancellableUntil, timeZone))} a las{' '}
                {formatTime(reservation.cancellableUntil, timeZone)}.
              </p>
              <CancelReservation slug={venueSlug} token={token} />
            </>
          ) : (
            <p className="m-0 text-sm leading-[18px] text-muted">
              El plazo para cancelar en línea terminó el{' '}
              {formatLongDate(dateKeyInTimeZone(reservation.cancellableUntil, timeZone))} a las{' '}
              {formatTime(reservation.cancellableUntil, timeZone)}. Para cambios, escribe al
              complejo{phone ? ` al ${phone}` : ''}.
            </p>
          )}
        </section>
      ) : null}

      <section aria-labelledby="guardar-titulo" className="grid gap-xs">
        <h2 id="guardar-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
          Guarda este enlace
        </h2>
        {shareUrl ? (
          <ShareReservation
            url={shareUrl}
            venueName={reservation.venue.name}
            pitchName={reservation.pitch.name}
            when={formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)}
            calendarUrl={`${shareUrl}/calendario`}
          />
        ) : null}
        <p className="m-0 text-sm leading-[18px] text-muted">
          Esta página es tu comprobante: no necesitas cuenta. Cualquiera con el enlace puede verla,
          así que no lo compartas más de lo necesario.
        </p>
        {phone ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            ¿Dudas? Escribe al complejo:{' '}
            <a href={`tel:${phone}`} className="underline">
              {phone}
            </a>
          </p>
        ) : null}
        <p className="m-0 text-sm leading-[18px]">
          <Link href={`/c/${encodeURIComponent(venueSlug)}`} className="text-text underline">
            Volver al complejo
          </Link>
        </p>
      </section>
    </main>
  );
}
