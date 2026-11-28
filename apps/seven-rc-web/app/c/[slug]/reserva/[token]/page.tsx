import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppBadge } from '@17suit/ui';
import { getServerT } from '@/lib/i18n-server';
import { CancelReservation, ShareReservation } from '@/components/reservation-link-actions';
import { asDepositPolicy, depositOutcomeLabel, policySummaryLines } from '@/lib/deposit-policy';
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
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerT('play');
  return {
    title: t('reservationPage.title'),
    robots: { index: false, follow: false },
    referrer: 'no-referrer',
  };
}

export default async function PublicReservationPage({ params }: PageProps) {
  const { slug, token } = await params;
  const { t, locale } = await getServerT('play');
  if (!UUID.test(token)) notFound();
  const reservation = await fetchPublicReservation(token);
  if (!reservation) notFound();

  const timeZone = safeTimeZone(reservation.venue.timezone);
  const status = reservationStatus(reservation.status, t);
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
          <h1 className="m-0 font-arvo text-2xl leading-[1.2] text-text">
            {t('reservationPage.heading')}
          </h1>
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
          {t('reservationPage.detail')}
        </h2>
        <dl className="m-0 grid gap-xs text-md text-text">
          <div className="grid gap-[2px]">
            <dt className="text-sm leading-[18px] text-muted">{t('reservationPage.pitch')}</dt>
            <dd className="m-0">
              {reservation.pitch.name} · {sportLabel(reservation.pitch.sportType, t)}
            </dd>
          </div>
          <div className="grid gap-[2px]">
            <dt className="text-sm leading-[18px] text-muted">{t('reservationPage.schedule')}</dt>
            <dd className="m-0">
              {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone, locale)}
            </dd>
          </div>
          <div className="grid gap-[2px]">
            <dt className="text-sm leading-[18px] text-muted">{t('reservationPage.total')}</dt>
            <dd className="m-0">
              {formatMoneyMinor(reservation.priceMinor, reservation.currency, locale)}
            </dd>
          </div>
          {reservation.depositMinor > 0 ? (
            <div className="grid gap-[2px]">
              <dt className="text-sm leading-[18px] text-muted">{t('reservationPage.deposit')}</dt>
              <dd className="m-0">
                {formatMoneyMinor(reservation.depositMinor, reservation.currency, locale)}
                {reservation.paidMinor > 0
                  ? t('reservationPage.paid', {
                      amount: formatMoneyMinor(reservation.paidMinor, reservation.currency, locale),
                    })
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
            {t('reservationPage.howToPay')}
          </h2>
          {owed > 0 ? (
            <p className="m-0 text-md text-text">
              {t('reservationPage.pay', {
                amount: formatMoneyMinor(owed, reservation.currency, locale),
              })}
            </p>
          ) : null}
          {instructions ? (
            <p className="m-0 whitespace-pre-line text-md text-text">{instructions}</p>
          ) : (
            <p className="m-0 text-sm leading-[18px] text-muted">
              {t('reservationPage.noInstructions')}
            </p>
          )}
          {reservation.holdExpiresAt ? (
            <p className="m-0 text-sm leading-[18px] text-muted">
              {t('reservationPage.holdUntil', {
                date: formatLongDate(
                  dateKeyInTimeZone(reservation.holdExpiresAt, timeZone),
                  locale,
                ),
                time: formatTime(reservation.holdExpiresAt, timeZone, locale),
              })}
            </p>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="condiciones-titulo" className="grid gap-xs">
        <h2 id="condiciones-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
          {t('reservationPage.conditions')}
        </h2>
        <ul className="m-0 grid list-disc gap-[2px] pl-md text-sm leading-[18px] text-muted">
          {policySummaryLines(
            {
              cancellationWindowHours: reservation.policy.cancellationWindowHours,
              lateCancelDeposit: asDepositPolicy(reservation.policy.lateCancelDeposit),
              noShowDeposit: asDepositPolicy(reservation.policy.noShowDeposit),
            },
            t,
          ).map((line) => (
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
            {depositOutcomeLabel(reservation.depositOutcome, t)}.
          </p>
        ) : null}
      </section>

      {active ? (
        <section aria-labelledby="cancelar-titulo" className="grid gap-xs">
          <h2 id="cancelar-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
            {t('reservationPage.cancel')}
          </h2>
          {canCancel ? (
            <>
              <p className="m-0 text-sm leading-[18px] text-muted">
                {t('reservationPage.cancelUntil', {
                  date: formatLongDate(
                    dateKeyInTimeZone(reservation.cancellableUntil, timeZone),
                    locale,
                  ),
                  time: formatTime(reservation.cancellableUntil, timeZone, locale),
                })}
              </p>
              <CancelReservation slug={venueSlug} token={token} />
            </>
          ) : (
            <p className="m-0 text-sm leading-[18px] text-muted">
              {t('reservationPage.cancelClosed', {
                date: formatLongDate(
                  dateKeyInTimeZone(reservation.cancellableUntil, timeZone),
                  locale,
                ),
                time: formatTime(reservation.cancellableUntil, timeZone, locale),
                phone: phone ? t('reservationPage.cancelClosedPhone', { phone }) : '',
              })}
            </p>
          )}
        </section>
      ) : null}

      <section aria-labelledby="guardar-titulo" className="grid gap-xs">
        <h2 id="guardar-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
          {t('reservationPage.save')}
        </h2>
        {shareUrl ? (
          <ShareReservation
            url={shareUrl}
            venueName={reservation.venue.name}
            pitchName={reservation.pitch.name}
            when={formatSlotWhen(reservation.startAt, reservation.endAt, timeZone, locale)}
            calendarUrl={`${shareUrl}/calendario`}
          />
        ) : null}
        <p className="m-0 text-sm leading-[18px] text-muted">{t('reservationPage.saveNote')}</p>
        {phone ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            {t('reservationPage.questions')}{' '}
            <a href={`tel:${phone}`} className="underline">
              {phone}
            </a>
          </p>
        ) : null}
        <p className="m-0 text-sm leading-[18px]">
          <Link href={`/c/${encodeURIComponent(venueSlug)}`} className="text-text underline">
            {t('reservationPage.back')}
          </Link>
        </p>
      </section>
    </main>
  );
}
