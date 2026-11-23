import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppBadge } from '@17suit/ui';
import { GuestBookingForm } from '@/components/guest-booking-form';
import { fetchPublicVenue, fetchPublicVenueAvailability } from '@/lib/public-venue-api';
import {
  addDaysToDateKey,
  formatDuration,
  formatLongDate,
  formatMoneyMinor,
  formatSlotWhen,
  formatTime,
  safeTimeZone,
  sportLabel,
} from '@/lib/seven-rc-format';

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

type SlotStatus = 'AVAILABLE' | 'RESERVED' | 'BLOCKED' | 'PAST';

const SLOT_STATUS: Record<
  SlotStatus,
  { label: string; variant: 'success' | 'neutral' | 'warning' }
> = {
  AVAILABLE: { label: 'Libre', variant: 'success' },
  RESERVED: { label: 'Ocupado', variant: 'neutral' },
  BLOCKED: { label: 'Bloqueado', variant: 'warning' },
  PAST: { label: 'Pasado', variant: 'neutral' },
};

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    fecha?: string | string[];
    turno?: string | string[];
    conflicto?: string | string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = await fetchPublicVenue(slug);
  if (!venue) return { title: 'Complejo no encontrado | Seven Reservations Club' };
  return {
    title: `${venue.name} | Seven Reservations Club`,
    description: `Mira los horarios libres de ${venue.name} y reserva tu cancha.`,
  };
}

/** Keeps `fecha` inside [today, today + horizon]; anything else falls back to today. */
function resolveDate(raw: string | string[] | undefined, today: string, horizon: number): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !DATE_KEY.test(value)) return today;
  const max = addDaysToDateKey(today, horizon);
  if (value < today || value > max) return today;
  return value;
}

export default async function PublicVenuePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const venue = await fetchPublicVenue(slug);
  if (!venue) notFound();

  const { fecha, turno, conflicto } = await searchParams;
  const date = resolveDate(fecha, venue.today, venue.bookingHorizonDays);
  const maxDate = addDaysToDateKey(venue.today, venue.bookingHorizonDays);
  const availability = await fetchPublicVenueAvailability(slug, date);
  if (!availability) notFound();

  const timeZone = safeTimeZone(venue.timezone);

  // `turno` = "<pitchId>|<startAt>". Honored only while that slot is still free on this date.
  const turnoRaw = Array.isArray(turno) ? turno[0] : turno;
  const [turnoPitchId, turnoStartAt] = (turnoRaw ?? '').split('|');
  const selectedPitch = availability.pitches.find((pitch) => pitch.pitchId === turnoPitchId);
  const selectedSlot = selectedPitch?.slots.find(
    (slot) => slot.startAt === turnoStartAt && slot.status === 'AVAILABLE',
  );
  const hadConflict = (Array.isArray(conflicto) ? conflicto[0] : conflicto) === '1';

  return (
    <main className="mx-auto grid w-full max-w-[var(--container-content)] gap-xl px-lg py-xl">
      <header className="grid gap-xs">
        <h1 className="m-0 font-arvo text-2xl leading-[1.2] text-text">{venue.name}</h1>
        {venue.address ? <p className="m-0 text-md text-muted">{venue.address}</p> : null}
        {venue.contactPhone ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            Contacto:{' '}
            <a href={`tel:${venue.contactPhone}`} className="underline">
              {venue.contactPhone}
            </a>
          </p>
        ) : null}
      </header>

      {hadConflict ? (
        <p
          role="alert"
          className="m-0 rounded-[var(--radius-md)] border border-destructive/50 bg-feedback-error-soft px-3 py-2 text-sm leading-[18px] text-text"
        >
          Otra persona acaba de reservar ese horario. Actualizamos la lista: elige otro.
        </p>
      ) : null}

      <section aria-labelledby="canchas-titulo" className="grid gap-sm">
        <h2 id="canchas-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
          Canchas
        </h2>
        {venue.pitches.length === 0 ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            Este complejo todavía no tiene canchas publicadas.
          </p>
        ) : (
          <ul className="m-0 grid list-none gap-sm p-0 sm:grid-cols-2">
            {venue.pitches.map((pitch) => (
              <li
                key={pitch.id}
                className="grid gap-xs rounded-[var(--radius-lg)] border border-border-default p-md"
              >
                <p className="m-0 font-arvo text-md leading-[1.3] text-text">{pitch.name}</p>
                <p className="m-0 text-sm leading-[18px] text-muted">
                  {sportLabel(pitch.sportType)} · turnos de{' '}
                  {formatDuration(pitch.slotDurationMinutes)}
                </p>
                <p className="m-0 text-sm leading-[18px] text-text">
                  {formatMoneyMinor(pitch.basePriceMinor, venue.currency)} por turno
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="horarios-titulo" className="grid gap-md">
        <h2 id="horarios-titulo" className="m-0 font-arvo text-lg leading-[1.3] text-text">
          Horarios
        </h2>
        <form method="get" className="flex flex-wrap items-end gap-sm">
          <div className="grid gap-xs">
            <label htmlFor="fecha" className="text-sm leading-[18px] text-text">
              Fecha
            </label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              defaultValue={date}
              min={venue.today}
              max={maxDate}
              required
              autoComplete="off"
              className="min-h-[44px] rounded-[var(--radius-md)] border border-border-default bg-background px-3 text-md text-text"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] rounded-[var(--radius-md)] border border-border-strong px-md text-md text-text"
          >
            Ver horarios
          </button>
        </form>
        <p className="m-0 text-sm leading-[18px] text-muted">
          {formatLongDate(date)} · hora del complejo. Reserva hasta {venue.bookingHorizonDays} días
          por adelantado.
        </p>

        {availability.pitches.length === 0 ? (
          <p className="m-0 text-sm leading-[18px] text-muted">No hay canchas para mostrar.</p>
        ) : (
          availability.pitches.map((pitch) => (
            <article key={pitch.pitchId} className="grid gap-sm">
              <h3 className="m-0 font-arvo text-md leading-[1.3] text-text">
                {pitch.pitchName} · {sportLabel(pitch.sportType)}
              </h3>
              {pitch.slots.length === 0 ? (
                <p className="m-0 text-sm leading-[18px] text-muted">Sin turnos este día.</p>
              ) : (
                <ul className="m-0 grid list-none gap-xs p-0">
                  {pitch.slots.map((slot) => {
                    const status = SLOT_STATUS[slot.status];
                    const free = slot.status === 'AVAILABLE';
                    return (
                      <li
                        key={slot.startAt}
                        className="flex items-center justify-between gap-sm rounded-[var(--radius-md)] border border-border-default px-md py-sm"
                      >
                        <span className={free ? 'text-md text-text' : 'text-md text-muted'}>
                          <time dateTime={slot.startAt}>{formatTime(slot.startAt, timeZone)}</time>
                          {' · '}
                          {formatMoneyMinor(slot.priceMinor, availability.currency)}
                        </span>
                        {free ? (
                          <a
                            href={`?${new URLSearchParams({
                              fecha: date,
                              turno: `${pitch.pitchId}|${slot.startAt}`,
                            }).toString()}#reservar`}
                            aria-current={
                              selectedSlot?.startAt === slot.startAt &&
                              selectedPitch?.pitchId === pitch.pitchId
                                ? 'true'
                                : undefined
                            }
                            className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-border-strong px-md text-sm font-bold text-text"
                          >
                            Reservar
                            <span className="sr-only">
                              {' '}
                              {pitch.pitchName} a las {formatTime(slot.startAt, timeZone)}
                            </span>
                          </a>
                        ) : (
                          <AppBadge variant={status.variant}>{status.label}</AppBadge>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          ))
        )}
      </section>

      {selectedPitch && selectedSlot ? (
        <div id="reservar" className="scroll-mt-lg">
          <GuestBookingForm
            key={`${selectedPitch.pitchId}|${selectedSlot.startAt}`}
            slug={venue.slug}
            date={date}
            pitchId={selectedPitch.pitchId}
            startAt={selectedSlot.startAt}
            when={formatSlotWhen(selectedSlot.startAt, selectedSlot.endAt, timeZone)}
            pitchName={selectedPitch.pitchName}
            priceLabel={formatMoneyMinor(selectedSlot.priceMinor, availability.currency)}
            depositPercent={venue.depositPercent}
            depositLabel={formatMoneyMinor(
              Math.ceil((selectedSlot.priceMinor * venue.depositPercent) / 100),
              availability.currency,
            )}
            holdMinutes={venue.holdMinutes}
          />
        </div>
      ) : null}
    </main>
  );
}
