'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useRef, useState, type FormEvent } from 'react';
import {
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import {
  AppBadge,
  AppButton,
  AppEmpty,
  AppFrame,
  AppInput,
  AppSkeleton,
  CalendarClock,
  Inbox,
  Search,
} from '@17suit/ui';
import {
  ChoiceChip,
  ConfirmDialog,
  InlineError,
  ListSkeleton,
  RefreshControl,
  SectionHeader,
} from '@/components/seven-rc-ui';
import { describeError, isSlotConflict } from '@/lib/seven-rc-errors';
import {
  addDaysToDateKey,
  dateKeyInTimeZone,
  formatBeforeTime,
  formatDateKey,
  formatDuration,
  formatLongDate,
  formatMoneyMinor,
  formatSlotWhen,
  formatTime,
  formatTimeRange,
  hourInTimeZone,
  minutesBetween,
  reservationStatus,
  safeTimeZone,
  sportLabel,
} from '@/lib/seven-rc-format';
import {
  useCancelReservationMutation,
  useCreateReservationMutation,
  useMyReservationsQuery,
  usePitchAvailabilityQuery,
  usePlayerVenuePitchesQuery,
  usePlayerVenuesQuery,
  type AvailabilitySlot,
  type Pitch,
  type PublicVenue,
  type ReservationBase,
  type ReservationWithVenuePitch,
} from '@/lib/player-queries';
import { useNow } from '@/lib/use-now';

const SEARCH_DEBOUNCE_MS = 350;
const DATE_STRIP_DAYS = 14;
const MAX_VENUE_RESULTS = 12;
const PENDING_POLL_MS = 30_000;
const RESERVE_FORM_ID = 'reserva-form';

/** Part-of-day buckets by venue-local start hour. */
const DAY_PARTS = [
  { key: 'manana', label: 'Mañana', from: 0, to: 12 },
  { key: 'tarde', label: 'Tarde', from: 12, to: 18 },
  { key: 'noche', label: 'Noche', from: 18, to: 24 },
] as const;

const SLOT_UNAVAILABLE_LABEL: Record<string, string> = {
  RESERVED: 'reservado',
  BLOCKED: 'no disponible',
  PAST: 'ya pasó',
};

/**
 * The server stores "no price configured" and "free" the same way (0). A slot priced 0
 * on a pitch whose base price is also 0 is read as unconfigured; 0 on a priced pitch
 * means the venue set a free rule for that time.
 */
function describeSlotPrice(
  priceMinor: number,
  pitch: Pick<Pitch, 'basePriceMinor'> | null,
  currency: string,
): { short: string; full: string } {
  if (priceMinor > 0) {
    const amount = formatMoneyMinor(priceMinor, currency);
    return { short: amount, full: amount };
  }
  if (!pitch || pitch.basePriceMinor <= 0) {
    return { short: 'A confirmar', full: 'Precio a confirmar con el complejo' };
  }
  return { short: 'Sin costo', full: 'Sin costo' };
}

/** Mirrors the server's deposit rule (`ceil(price × percent / 100)`). */
function depositEstimate(priceMinor: number, depositPercent: number): number {
  return Math.ceil((priceMinor * depositPercent) / 100);
}

/**
 * A reservation keeps a price snapshot, so a 0 only reads as free while the pitch is
 * unchanged since booking: a price set later says nothing about this reservation.
 */
function pitchAtBooking(reservation: ReservationWithVenuePitch): Pitch | null {
  return new Date(reservation.pitch.updatedAt) <= new Date(reservation.createdAt)
    ? reservation.pitch
    : null;
}

/** An unpaid hold past its deadline is already free, up to a minute before the status says so. */
function isHoldExpired(reservation: ReservationBase, now: number): boolean {
  return (
    reservation.status === 'pending_confirmation' &&
    Boolean(reservation.holdExpiresAt) &&
    new Date(reservation.holdExpiresAt as string).getTime() <= now
  );
}

interface CompletedBooking {
  reservation: ReservationBase;
  venue: PublicVenue;
  pitch: Pitch;
}

export default function PlayPage() {
  const router = useRouter();
  const { role, isLoading } = useCurrentUserRoleQuery();
  useRoleGate({ required: 'PLAYER', router });

  if (isLoading || role !== 'PLAYER') {
    return (
      <AppFrame appName="Reservar cancha" subtitle="Cargando tu cuenta…">
        <ListSkeleton rows={3} label="Cargando tu cuenta" />
      </AppFrame>
    );
  }

  // useSearchParams needs a Suspense boundary so the shell can prerender.
  return (
    <Suspense
      fallback={
        <AppFrame appName="Reservar cancha" subtitle="Cargando complejos…">
          <ListSkeleton rows={3} label="Cargando complejos" />
        </AppFrame>
      }
    >
      <PlayerWorkspace />
    </Suspense>
  );
}

type SelectionParam = 'venue' | 'pitch' | 'date';

/**
 * Venue, pitch and date live in the URL so a refresh or a shared link keeps the
 * choice. Local state answers the tap immediately; the URL is replaced alongside it.
 */
function useSelectionParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initial] = useState(() => ({
    venue: searchParams.get('venue'),
    pitch: searchParams.get('pitch'),
    date: searchParams.get('date'),
  }));

  const write = useCallback(
    (next: Partial<Record<SelectionParam, string | null>>) => {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(next)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  return { initial, write };
}

function PlayerWorkspace() {
  // Search: debounced from the change handler, committed immediately on Enter.
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selection = useSelectionParams();

  const venuesQuery = usePlayerVenuesQuery(searchTerm || undefined);
  const venues = venuesQuery.data ?? [];
  const [explicitVenueId, setExplicitVenueId] = useState<string | null>(selection.initial.venue);
  const selectedVenue = venues.find((venue) => venue.id === explicitVenueId) ?? venues[0] ?? null;
  // A venue restored from the URL can sit past the cap; it must still show as chosen.
  const firstVenues = venues.slice(0, MAX_VENUE_RESULTS);
  const visibleVenues =
    selectedVenue && !firstVenues.includes(selectedVenue)
      ? [selectedVenue, ...firstVenues.slice(0, MAX_VENUE_RESULTS - 1)]
      : firstVenues;

  const pitchesQuery = usePlayerVenuePitchesQuery(selectedVenue?.id ?? null);
  const pitches = pitchesQuery.data ?? [];
  const [explicitPitchId, setExplicitPitchId] = useState<string | null>(selection.initial.pitch);
  const selectedPitch = pitches.find((pitch) => pitch.id === explicitPitchId) ?? pitches[0] ?? null;

  const timeZone = safeTimeZone(selectedVenue?.timezone);
  const todayKey = dateKeyInTimeZone(new Date(), timeZone);
  const stripLength = Math.max(
    1,
    Math.min(DATE_STRIP_DAYS, (selectedVenue?.bookingHorizonDays ?? DATE_STRIP_DAYS - 1) + 1),
  );
  const dateKeys = Array.from({ length: stripLength }, (_, index) =>
    addDaysToDateKey(todayKey, index),
  );
  const [explicitDate, setExplicitDate] = useState<string | null>(selection.initial.date);
  const selectedDate =
    explicitDate && dateKeys.includes(explicitDate) ? explicitDate : (dateKeys[0] ?? todayKey);

  const availabilityQuery = usePitchAvailabilityQuery(selectedPitch?.id ?? null, selectedDate);
  const slots = availabilityQuery.data?.slots ?? [];
  const currency = availabilityQuery.data?.currency ?? selectedVenue?.currency ?? 'COP';
  // A slot belongs to its pitch: when a search or refetch swaps the default venue,
  // the same hour on another pitch must not inherit the choice.
  const [explicitSlot, setExplicitSlot] = useState<{ pitchId: string; startAt: string } | null>(
    null,
  );
  const selectedSlot =
    slots.find(
      (slot) =>
        explicitSlot?.pitchId === selectedPitch?.id &&
        slot.startAt === explicitSlot?.startAt &&
        slot.status === 'AVAILABLE',
    ) ?? null;

  const [invitedCount, setInvitedCount] = useState('0');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<CompletedBooking | null>(null);

  const createReservationMutation = useCreateReservationMutation();
  const slotPrice = selectedSlot
    ? describeSlotPrice(selectedSlot.priceMinor, selectedPitch, currency)
    : null;

  // Venue and pitch may still be defaults (first in the list), so every choice writes
  // them along: the defaults can differ after a refresh.
  function choosePitch(pitchId: string) {
    setExplicitVenueId(selectedVenue?.id ?? null);
    setExplicitPitchId(pitchId);
    selection.write({ venue: selectedVenue?.id ?? null, pitch: pitchId, date: selectedDate });
    resetSlotChoice();
  }

  function chooseDate(dateKey: string) {
    setExplicitVenueId(selectedVenue?.id ?? null);
    setExplicitPitchId(selectedPitch?.id ?? null);
    setExplicitDate(dateKey);
    selection.write({
      venue: selectedVenue?.id ?? null,
      pitch: selectedPitch?.id ?? null,
      date: dateKey,
    });
    resetSlotChoice();
  }

  function resetSlotChoice() {
    setExplicitSlot(null);
    setBookingError(null);
  }

  function onSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchTerm(value.trim()), SEARCH_DEBOUNCE_MS);
  }

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchTerm(searchInput.trim());
  }

  async function onReserve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingError(null);
    if (!selectedVenue || !selectedPitch || !selectedSlot) {
      setBookingError('Elige un horario disponible para reservar.');
      return;
    }

    const guests = Math.max(0, Math.min(50, Number(invitedCount) || 0));
    try {
      const reservation = await createReservationMutation.mutateAsync({
        pitchId: selectedPitch.id,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
        ...(guests > 0 ? { invitedCount: guests } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      setCompletedBooking({ reservation, venue: selectedVenue, pitch: selectedPitch });
      setExplicitSlot(null);
      setNotes('');
      setInvitedCount('0');
    } catch (error) {
      setBookingError(describeError(error, 'No se pudo enviar la reserva.'));
      if (isSlotConflict(error)) setExplicitSlot(null);
    }
  }

  return (
    <AppFrame
      appName="Reservar cancha"
      subtitle="Elige complejo, cancha, día y horario. Solo ves los turnos que están libres."
    >
      <section aria-labelledby="reservar-title" className="grid gap-lg">
        <SectionHeader id="reservar-title" title="Nueva reserva" />

        {completedBooking ? (
          <BookingSuccess
            booking={completedBooking}
            onBookAnother={() => setCompletedBooking(null)}
          />
        ) : (
          <div className="grid gap-lg lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div className="grid min-w-0 gap-lg">
              <form role="search" onSubmit={onSearchSubmit} className="grid gap-sm">
                <AppInput
                  type="search"
                  name="q"
                  label="Buscar complejo"
                  placeholder="Nombre o dirección"
                  autoComplete="off"
                  enterKeyHint="search"
                  value={searchInput}
                  onChangeText={onSearchChange}
                  leftIcon={<Search size={16} aria-hidden />}
                />
              </form>

              <VenuePicker
                isLoading={venuesQuery.isLoading}
                error={
                  venuesQuery.error
                    ? describeError(venuesQuery.error, 'No se pudieron cargar los complejos.')
                    : null
                }
                onRetry={() => void venuesQuery.refetch()}
                searchTerm={searchTerm}
                venues={visibleVenues}
                totalCount={venues.length}
                selectedId={selectedVenue?.id ?? null}
                onSelect={(id) => {
                  setExplicitVenueId(id);
                  setExplicitPitchId(null);
                  selection.write({ venue: id, pitch: null });
                  resetSlotChoice();
                }}
                onClearSearch={() => {
                  setSearchInput('');
                  setSearchTerm('');
                }}
              />

              {selectedVenue ? (
                <PitchPicker
                  isLoading={pitchesQuery.isLoading}
                  error={
                    pitchesQuery.error
                      ? describeError(pitchesQuery.error, 'No se pudieron cargar las canchas.')
                      : null
                  }
                  onRetry={() => void pitchesQuery.refetch()}
                  pitches={pitches}
                  selectedId={selectedPitch?.id ?? null}
                  onSelect={choosePitch}
                />
              ) : null}

              {selectedPitch ? (
                <>
                  <fieldset className="m-0 grid min-w-0 gap-sm border-0 p-0">
                    <legend className="mb-sm p-0 font-arvo text-md text-text">Día</legend>
                    <div className="-mx-1 flex gap-sm overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
                      {dateKeys.map((dateKey) => (
                        <ChoiceChip
                          key={dateKey}
                          name="fecha"
                          value={dateKey}
                          checked={dateKey === selectedDate}
                          onSelect={chooseDate}
                          ariaLabel={formatLongDate(dateKey)}
                          className="min-w-[68px] shrink-0 items-center text-center"
                        >
                          <span className="text-xs uppercase leading-[1.2] text-muted">
                            {dateKey === todayKey
                              ? 'Hoy'
                              : formatDateKey(dateKey, { weekday: 'short' }).replace('.', '')}
                          </span>
                          <span className="font-arvo text-lg leading-[1.2] tabular-nums">
                            {formatDateKey(dateKey, { day: 'numeric' })}
                          </span>
                          <span className="text-xs leading-[1.2] text-muted">
                            {formatDateKey(dateKey, { month: 'short' }).replace('.', '')}
                          </span>
                        </ChoiceChip>
                      ))}
                    </div>
                  </fieldset>

                  <SlotPicker
                    isLoading={availabilityQuery.isLoading}
                    error={
                      availabilityQuery.error
                        ? describeError(
                            availabilityQuery.error,
                            'No se pudieron cargar los horarios.',
                          )
                        : null
                    }
                    onRetry={() => void availabilityQuery.refetch()}
                    slots={slots}
                    pitch={selectedPitch}
                    timeZone={timeZone}
                    currency={currency}
                    dateLabel={formatLongDate(selectedDate)}
                    selectedStart={selectedSlot?.startAt ?? null}
                    onSelect={(startAt) => {
                      if (selectedPitch) setExplicitSlot({ pitchId: selectedPitch.id, startAt });
                      setBookingError(null);
                    }}
                    onNextDay={() => {
                      const index = dateKeys.indexOf(selectedDate);
                      const next = dateKeys[index + 1];
                      if (next) chooseDate(next);
                    }}
                    hasNextDay={dateKeys.indexOf(selectedDate) < dateKeys.length - 1}
                  />
                </>
              ) : null}
            </div>

            <form
              id={RESERVE_FORM_ID}
              onSubmit={onReserve}
              aria-labelledby="resumen-title"
              className="grid gap-md rounded-[var(--radius-lg)] border border-border-strong bg-background p-md lg:sticky lg:top-md"
            >
              <h3 id="resumen-title" className="m-0 font-arvo text-lg leading-[1.3] text-text">
                Tu reserva
              </h3>
              <BookingSummary
                venue={selectedVenue}
                pitch={selectedPitch}
                slot={selectedSlot}
                priceLabel={slotPrice?.full ?? null}
                timeZone={timeZone}
                currency={currency}
              />
              {selectedSlot ? (
                <>
                  <AppInput
                    type="number"
                    name="invitedCount"
                    label="Invitados además de ti (opcional)"
                    inputMode="numeric"
                    min={0}
                    max={50}
                    step={1}
                    value={invitedCount}
                    onChangeText={setInvitedCount}
                  />
                  <AppInput
                    name="notes"
                    label="Nota para el complejo (opcional)"
                    placeholder="Ej.: traemos balón"
                    maxLength={500}
                    autoComplete="off"
                    value={notes}
                    onChangeText={setNotes}
                  />
                </>
              ) : null}
              <AppButton
                type="submit"
                disabled={!selectedSlot || createReservationMutation.isPending}
                aria-describedby={bookingError ? 'reservar-error' : undefined}
              >
                {createReservationMutation.isPending ? 'Enviando reserva…' : 'Reservar'}
              </AppButton>
              <InlineError id="reservar-error" message={bookingError} />
            </form>
          </div>
        )}

        {!completedBooking && (selectedSlot || bookingError) ? (
          <MobileBookingBar
            when={
              selectedSlot
                ? formatTimeRange(selectedSlot.startAt, selectedSlot.endAt, timeZone)
                : null
            }
            pitchName={selectedPitch?.name ?? ''}
            price={slotPrice?.full ?? ''}
            isPending={createReservationMutation.isPending}
            error={bookingError}
          />
        ) : null}
      </section>

      <MyReservations />
    </AppFrame>
  );
}

function VenuePicker({
  isLoading,
  error,
  onRetry,
  searchTerm,
  venues,
  totalCount,
  selectedId,
  onSelect,
  onClearSearch,
}: {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  searchTerm: string;
  venues: PublicVenue[];
  totalCount: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClearSearch: () => void;
}) {
  if (isLoading) return <ListSkeleton rows={2} label="Buscando complejos" />;
  if (error) {
    return (
      <div className="grid gap-sm">
        <InlineError message={error} />
        <AppButton variant="neutral" fullWidth={false} onPress={onRetry}>
          Reintentar
        </AppButton>
      </div>
    );
  }
  if (venues.length === 0) {
    return searchTerm ? (
      <AppEmpty
        icon={<Search size={18} aria-hidden />}
        title={`Ningún complejo coincide con “${searchTerm}”`}
        description="Prueba con otra palabra del nombre o de la dirección."
        actionLabel="Ver todos los complejos"
        onAction={onClearSearch}
      />
    ) : (
      <AppEmpty
        icon={<Inbox size={18} aria-hidden />}
        title="Todavía no hay complejos publicados"
        description="Cuando un complejo abra sus canchas en Seven Reservations Club, aparecerá aquí."
      />
    );
  }

  return (
    <fieldset className="m-0 grid min-w-0 gap-sm border-0 p-0">
      <legend className="mb-sm p-0 font-arvo text-md text-text">Complejo</legend>
      <div className="grid gap-sm sm:grid-cols-2">
        {venues.map((venue) => (
          <ChoiceChip
            key={venue.id}
            name="complejo"
            value={venue.id}
            checked={venue.id === selectedId}
            onSelect={onSelect}
          >
            <span className="font-bold leading-[1.3]">{venue.name}</span>
            {venue.address ? (
              <span className="text-sm leading-[18px] text-muted">{venue.address}</span>
            ) : null}
          </ChoiceChip>
        ))}
      </div>
      {totalCount > venues.length ? (
        <p className="m-0 text-sm leading-[18px] text-muted">
          Mostrando {venues.length} de {totalCount}. Busca por nombre para encontrar el tuyo.
        </p>
      ) : null}
    </fieldset>
  );
}

function PitchPicker({
  isLoading,
  error,
  onRetry,
  pitches,
  selectedId,
  onSelect,
}: {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  pitches: Pitch[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (isLoading) return <ListSkeleton rows={1} label="Cargando canchas" />;
  if (error) {
    return (
      <div className="grid gap-sm">
        <InlineError message={error} />
        <AppButton variant="neutral" fullWidth={false} onPress={onRetry}>
          Reintentar
        </AppButton>
      </div>
    );
  }
  if (pitches.length === 0) {
    return (
      <AppEmpty
        icon={<Inbox size={18} aria-hidden />}
        title="Este complejo aún no tiene canchas disponibles"
        description="Elige otro complejo de la lista."
      />
    );
  }

  return (
    <fieldset className="m-0 grid min-w-0 gap-sm border-0 p-0">
      <legend className="mb-sm p-0 font-arvo text-md text-text">Cancha</legend>
      <div className="flex flex-wrap gap-sm">
        {pitches.map((pitch) => (
          <ChoiceChip
            key={pitch.id}
            name="cancha"
            value={pitch.id}
            checked={pitch.id === selectedId}
            onSelect={onSelect}
          >
            <span className="font-bold leading-[1.3]">{pitch.name}</span>
            <span className="text-sm leading-[18px] text-muted">
              {sportLabel(pitch.sportType)} · turnos de {formatDuration(pitch.slotDurationMinutes)}
            </span>
          </ChoiceChip>
        ))}
      </div>
    </fieldset>
  );
}

function SlotPicker({
  isLoading,
  error,
  onRetry,
  slots,
  pitch,
  timeZone,
  currency,
  dateLabel,
  selectedStart,
  onSelect,
  onNextDay,
  hasNextDay,
}: {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  slots: AvailabilitySlot[];
  pitch: Pitch | null;
  timeZone: string;
  currency: string;
  dateLabel: string;
  selectedStart: string | null;
  onSelect: (startAt: string) => void;
  onNextDay: () => void;
  hasNextDay: boolean;
}) {
  const availableCount = slots.filter((slot) => slot.status === 'AVAILABLE').length;

  return (
    <fieldset className="m-0 grid min-w-0 gap-sm border-0 p-0">
      <legend className="mb-sm p-0 font-arvo text-md text-text">Horario</legend>
      {isLoading ? (
        <div role="status" aria-label="Cargando horarios" className="flex flex-wrap gap-sm">
          {Array.from({ length: 8 }, (_, index) => (
            <AppSkeleton key={index} width={96} height={52} rounded="md" />
          ))}
        </div>
      ) : error ? (
        <div className="grid gap-sm">
          <InlineError message={error} />
          <AppButton variant="neutral" fullWidth={false} onPress={onRetry}>
            Reintentar
          </AppButton>
        </div>
      ) : availableCount === 0 ? (
        <AppEmpty
          icon={<CalendarClock size={18} aria-hidden />}
          title={
            slots.length === 0
              ? `La cancha no abre el ${dateLabel}`
              : `No quedan horarios libres el ${dateLabel}`
          }
          description="Prueba otro día o elige otra cancha."
          {...(hasNextDay ? { actionLabel: 'Ver el día siguiente', onAction: onNextDay } : {})}
        />
      ) : (
        <>
          <p className="m-0 text-sm leading-[18px] text-muted">
            {availableCount === 1 ? '1 horario libre' : `${availableCount} horarios libres`} · hora
            del complejo
          </p>
          {DAY_PARTS.map((part) => {
            const partSlots = slots.filter((slot) => {
              const hour = hourInTimeZone(slot.startAt, timeZone);
              return hour >= part.from && hour < part.to;
            });
            if (partSlots.length === 0) return null;
            const headingId = `horario-${part.key}`;
            return (
              <div key={part.key} role="group" aria-labelledby={headingId} className="grid gap-xs">
                <h3
                  id={headingId}
                  className="m-0 mt-xs text-sm font-bold leading-[18px] text-muted"
                >
                  {part.label}
                </h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-sm">
                  {partSlots.map((slot) => (
                    <SlotChip
                      key={slot.startAt}
                      slot={slot}
                      pitch={pitch}
                      timeZone={timeZone}
                      currency={currency}
                      checked={slot.startAt === selectedStart}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </fieldset>
  );
}

function SlotChip({
  slot,
  pitch,
  timeZone,
  currency,
  checked,
  onSelect,
}: {
  slot: AvailabilitySlot;
  pitch: Pitch | null;
  timeZone: string;
  currency: string;
  checked: boolean;
  onSelect: (startAt: string) => void;
}) {
  const isAvailable = slot.status === 'AVAILABLE';
  const start = formatTime(slot.startAt, timeZone);
  const unavailable = SLOT_UNAVAILABLE_LABEL[slot.status] ?? 'no disponible';
  const price = describeSlotPrice(slot.priceMinor, pitch, currency);
  return (
    <ChoiceChip
      name="horario"
      value={slot.startAt}
      checked={checked}
      disabled={!isAvailable}
      onSelect={onSelect}
      ariaLabel={isAvailable ? `${start}, ${price.full}` : `${start}, ${unavailable}`}
      className="items-center text-center"
    >
      <span
        className={
          isAvailable
            ? 'font-bold tabular-nums leading-[1.3]'
            : 'tabular-nums leading-[1.3] line-through'
        }
      >
        {start}
      </span>
      <span className="text-xs leading-[1.3] text-muted">
        {isAvailable ? price.short : unavailable}
      </span>
    </ChoiceChip>
  );
}

/**
 * Below `lg` the summary form sits after the slot grid, out of thumb reach. This bar
 * appears when a slot is chosen (the visible confirmation of the tap) and submits the
 * same form: guests and note are optional, so nothing else is required.
 */
function MobileBookingBar({
  when,
  pitchName,
  price,
  isPending,
  error,
}: {
  /** Null when the chosen slot was just lost: the bar stays to announce why. */
  when: string | null;
  pitchName: string;
  price: string;
  isPending: boolean;
  error: string | null;
}) {
  return (
    <>
      <div aria-hidden className="h-28 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border-strong bg-surface px-md pt-sm pb-[max(12px,env(safe-area-inset-bottom))] shadow-panel-strong transition-transform duration-300 ease-out starting:translate-y-full motion-reduce:transition-none lg:hidden">
        <div className="mx-auto grid max-w-[640px] gap-xs">
          <div className="flex items-center gap-md">
            <div className="grid min-w-0 flex-1">
              <p className="m-0 truncate font-bold leading-[1.3] tabular-nums text-text">
                {when ?? 'Elige otro horario'}
              </p>
              <p className="m-0 break-words text-sm leading-[18px] text-muted">
                {when ? `${pitchName} · ${price}` : pitchName}
              </p>
            </div>
            <AppButton
              type="submit"
              form={RESERVE_FORM_ID}
              fullWidth={false}
              disabled={!when || isPending}
            >
              {isPending ? 'Enviando…' : 'Reservar'}
            </AppButton>
          </div>
          <p aria-live="polite" className="m-0 text-sm leading-[18px] text-text empty:sr-only">
            {error ?? ''}
          </p>
        </div>
      </div>
    </>
  );
}

function BookingSummary({
  venue,
  pitch,
  slot,
  priceLabel,
  timeZone,
  currency,
}: {
  venue: PublicVenue | null;
  pitch: Pitch | null;
  slot: AvailabilitySlot | null;
  priceLabel: string | null;
  timeZone: string;
  currency: string;
}) {
  if (!slot || !pitch || !venue) {
    return (
      <p className="m-0 text-md leading-[1.5] text-muted">
        Elige un horario libre para ver el resumen antes de reservar.
      </p>
    );
  }

  const rows: Array<[string, string]> = [
    ['Complejo', venue.name],
    ['Cancha', `${pitch.name} · ${sportLabel(pitch.sportType)}`],
    ['Fecha', formatLongDate(dateKeyInTimeZone(slot.startAt, timeZone))],
    ['Hora', formatTimeRange(slot.startAt, slot.endAt, timeZone)],
    ['Duración', formatDuration(minutesBetween(slot.startAt, slot.endAt))],
  ];
  if (priceLabel) rows.push(['Precio', priceLabel]);
  if (slot.priceMinor > 0 && venue.depositPercent > 0) {
    rows.push([
      'Anticipo',
      `${formatMoneyMinor(depositEstimate(slot.priceMinor, venue.depositPercent), currency)} (${venue.depositPercent} %) para apartar el turno`,
    ]);
  }

  return (
    <dl className="m-0 grid gap-xs">
      {rows.map(([term, detail]) => (
        <div key={term} className="grid grid-cols-[88px_minmax(0,1fr)] gap-sm">
          <dt className="text-sm leading-[1.5] text-muted">{term}</dt>
          <dd className="m-0 break-words text-md leading-[1.5] text-text first-letter:uppercase">
            {detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function BookingSuccess({
  booking,
  onBookAnother,
}: {
  booking: CompletedBooking;
  onBookAnother: () => void;
}) {
  const { reservation, pitch } = booking;
  // The venue search returns only name, address and time zone. Payment and cancellation
  // terms come with the reservation list, which refetches right after booking.
  const details = useMyReservationsQuery().data?.find((item) => item.id === reservation.id);
  const venue = details?.venue ?? booking.venue;
  const timeZone = safeTimeZone(venue.timezone);
  const isPending = reservation.status === 'pending_confirmation';
  const focusOnMount = useCallback((node: HTMLDivElement | null) => node?.focus(), []);

  return (
    <div
      ref={focusOnMount}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="grid gap-md rounded-[var(--radius-lg)] border border-success/60 bg-feedback-success-soft p-lg outline-none focus-visible:ring-2 focus-visible:ring-action-primary/40"
    >
      <div className="grid gap-xs">
        <h3 className="m-0 font-arvo text-lg leading-[1.3] text-text">
          {isPending
            ? 'Solicitud enviada — pendiente de confirmación del complejo'
            : 'Reserva confirmada'}
        </h3>
        <p className="m-0 text-md leading-[1.5] text-text first-letter:uppercase">
          {venue.name} · {pitch.name} ·{' '}
          {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)}
        </p>
        <p className="m-0 text-md leading-[1.5] text-muted">
          Precio: {describeSlotPrice(reservation.priceMinor, pitch, reservation.currency).full}
        </p>
      </div>

      <div className="grid gap-xs text-md leading-[1.5] text-text">
        <p className="m-0 font-bold">Qué sigue</p>
        {isPending ? (
          <>
            {reservation.depositMinor > 0 ? (
              <p className="m-0">
                El complejo pide un anticipo de{' '}
                {formatMoneyMinor(reservation.depositMinor, reservation.currency)} para confirmar el
                turno
                {reservation.holdExpiresAt
                  ? `. Si no se confirma ${formatBeforeTime(reservation.holdExpiresAt, timeZone)}, el horario se libera.`
                  : '.'}
              </p>
            ) : (
              <p className="m-0">El complejo revisará tu solicitud y la confirmará.</p>
            )}
            {venue.paymentInstructions ? (
              <p className="m-0 whitespace-pre-line text-muted">{venue.paymentInstructions}</p>
            ) : null}
            {venue.contactPhone ? (
              <p className="m-0 text-muted">
                Contacto del complejo:{' '}
                <a
                  href={`tel:${venue.contactPhone.replace(/[^\d+]/g, '')}`}
                  className="text-text underline underline-offset-2"
                >
                  {venue.contactPhone}
                </a>
              </p>
            ) : null}
            <p className="m-0 text-muted">
              Cuando el complejo confirme, el estado cambiará en “Mis próximas reservas”, más abajo.
              Ahí también verás estos datos de pago.
            </p>
          </>
        ) : (
          <p className="m-0">
            Tu turno está apartado.{' '}
            {details
              ? `Si no puedes ir, cancela con al menos ${details.policySnapshot.cancellationWindowHours} h de anticipación desde “Mis próximas reservas”.`
              : 'Si no puedes ir, revisa el plazo de cancelación en “Mis próximas reservas”.'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-sm">
        <AppButton fullWidth={false} onPress={onBookAnother}>
          Reservar otro horario
        </AppButton>
        <a
          href="#mis-reservas-title"
          className="inline-flex min-h-11 items-center px-3 text-md font-bold text-text underline underline-offset-4"
        >
          Ver mis reservas
        </a>
      </div>
    </div>
  );
}

function MyReservations() {
  // Refetch on focus, and poll every 30 s only while a request awaits the venue and
  // the tab is visible; settled lists cost no background requests.
  const myReservationsQuery = useMyReservationsQuery({
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: (query) =>
      query.state.data?.some((reservation) => reservation.status === 'pending_confirmation')
        ? PENDING_POLL_MS
        : false,
    refetchIntervalInBackground: false,
  });
  const cancelReservationMutation = useCancelReservationMutation();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ReservationWithVenuePitch | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelledNotice, setCancelledNotice] = useState<string | null>(null);
  const [mountedAt] = useState(() => Date.now());
  const tick = useNow();
  const now = tick || mountedAt;

  const reservations = myReservationsQuery.data ?? [];
  // Requests still waiting on payment or the venue come first: they need action.
  const upcoming = reservations
    .filter((reservation) => new Date(reservation.endAt).getTime() > now)
    .sort(
      (a, b) =>
        Number(b.status === 'pending_confirmation') - Number(a.status === 'pending_confirmation') ||
        a.startAt.localeCompare(b.startAt),
    );
  const past = reservations
    .filter((reservation) => new Date(reservation.endAt).getTime() <= now)
    .sort((a, b) => b.startAt.localeCompare(a.startAt));

  function openCancel(reservation: ReservationWithVenuePitch) {
    setCancelTarget(reservation);
    setCancelError(null);
    setCancelledNotice(null);
    dialogRef.current?.showModal();
  }

  async function confirmCancel() {
    if (!cancelTarget) return;
    setCancelError(null);
    try {
      await cancelReservationMutation.mutateAsync(cancelTarget.id);
      setCancelledNotice(`Cancelaste la reserva en ${cancelTarget.pitch.name}.`);
      dialogRef.current?.close();
    } catch (error) {
      setCancelError(describeError(error, 'No se pudo cancelar la reserva.'));
    }
  }

  const targetTimeZone = safeTimeZone(cancelTarget?.venue.timezone);

  return (
    <section aria-labelledby="mis-reservas-title" className="mt-lg grid gap-md">
      <SectionHeader
        id="mis-reservas-title"
        title="Mis próximas reservas"
        aside={
          <RefreshControl
            dataUpdatedAt={myReservationsQuery.dataUpdatedAt}
            isFetching={myReservationsQuery.isFetching}
            onRefresh={() => void myReservationsQuery.refetch()}
          />
        }
      />
      <p aria-live="polite" className="m-0 text-sm leading-[18px] text-muted">
        {cancelledNotice ?? ''}
      </p>

      {myReservationsQuery.isLoading ? (
        <ListSkeleton rows={2} label="Cargando tus reservas" />
      ) : myReservationsQuery.error ? (
        <div className="grid gap-sm">
          <InlineError
            message={describeError(
              myReservationsQuery.error,
              'No se pudieron cargar tus reservas.',
            )}
          />
          <AppButton
            variant="neutral"
            fullWidth={false}
            onPress={() => void myReservationsQuery.refetch()}
          >
            Reintentar
          </AppButton>
        </div>
      ) : upcoming.length === 0 ? (
        <AppEmpty
          icon={<CalendarClock size={18} aria-hidden />}
          title="No tienes reservas próximas"
          description="Elige un horario libre arriba y aparecerá aquí con su estado."
          actionLabel="Elegir horario"
          onAction={() => document.getElementById('reservar-title')?.scrollIntoView()}
        />
      ) : (
        <ul className="m-0 grid list-none gap-sm p-0">
          {upcoming.map((reservation) => (
            <ReservationItem
              key={reservation.id}
              reservation={reservation}
              now={now}
              onCancel={() => openCancel(reservation)}
            />
          ))}
        </ul>
      )}

      {past.length > 0 ? (
        <details className="group rounded-[var(--radius-lg)] border border-border-default">
          <summary className="flex min-h-11 cursor-pointer items-center px-md font-bold text-text">
            Historial ({past.length})
          </summary>
          <ul className="m-0 grid list-none gap-sm p-md pt-0">
            {past.map((reservation) => (
              <ReservationItem key={reservation.id} reservation={reservation} now={now} />
            ))}
          </ul>
        </details>
      ) : null}

      <ConfirmDialog
        dialogRef={dialogRef}
        title="¿Cancelar esta reserva?"
        confirmLabel="Sí, cancelar reserva"
        pendingLabel="Cancelando…"
        dismissLabel="Conservar reserva"
        isPending={cancelReservationMutation.isPending}
        error={cancelError}
        onConfirm={() => void confirmCancel()}
        onClosed={() => {
          setCancelTarget(null);
          setCancelError(null);
        }}
      >
        {cancelTarget ? (
          <>
            <p className="m-0 text-text first-letter:uppercase">
              {cancelTarget.venue.name} · {cancelTarget.pitch.name} ·{' '}
              {formatSlotWhen(cancelTarget.startAt, cancelTarget.endAt, targetTimeZone)}
            </p>
            <p className="m-0">
              El horario quedará libre para otros jugadores. Esta acción no se puede deshacer.
            </p>
          </>
        ) : null}
      </ConfirmDialog>
    </section>
  );
}

function ReservationItem({
  reservation,
  now,
  onCancel,
}: {
  reservation: ReservationWithVenuePitch;
  now: number;
  onCancel?: () => void;
}) {
  const timeZone = safeTimeZone(reservation.venue.timezone);
  const status = reservationStatus(reservation.status);
  const isPending = reservation.status === 'pending_confirmation';
  const isActive = isPending || reservation.status === 'confirmed';
  const windowHours = reservation.policySnapshot.cancellationWindowHours;
  const cancelDeadline = new Date(reservation.startAt).getTime() - windowHours * 3_600_000;
  const holdExpired = isHoldExpired(reservation, now);
  const canCancel = isActive && !holdExpired && now < cancelDeadline && Boolean(onCancel);

  return (
    <li className="grid gap-sm rounded-[var(--radius-lg)] border border-border-default bg-background p-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="grid min-w-0 gap-xs">
        <div className="flex flex-wrap items-center gap-sm">
          <p className="m-0 break-words font-bold leading-[1.3] text-text">
            {reservation.venue.name} · {reservation.pitch.name}
          </p>
          <AppBadge variant={status.variant}>{status.label}</AppBadge>
        </div>
        <p className="m-0 text-md leading-[1.5] text-text first-letter:uppercase">
          {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)}
        </p>
        <p className="m-0 text-sm leading-[18px] text-muted">
          {
            describeSlotPrice(
              reservation.priceMinor,
              pitchAtBooking(reservation),
              reservation.currency,
            ).full
          }
          {!isPending && reservation.depositMinor > 0
            ? ` · anticipo ${formatMoneyMinor(reservation.depositMinor, reservation.currency)}`
            : ''}
        </p>
        {isPending && onCancel ? (
          <PendingPaymentInfo reservation={reservation} timeZone={timeZone} now={now} />
        ) : null}
        {isActive && !holdExpired && onCancel && !canCancel ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            Ya no se puede cancelar en línea: el complejo acepta cancelaciones hasta {windowHours} h
            antes.
          </p>
        ) : null}
      </div>
      {canCancel ? (
        <AppButton variant="neutral" compact fullWidth={false} onPress={onCancel}>
          Cancelar reserva
        </AppButton>
      ) : null}
    </li>
  );
}

/**
 * What a pending request still needs from the player: the deposit, the deadline before
 * the hold releases the slot, how to pay and who to call. Stays on the reservation so it
 * survives leaving the success screen.
 */
function PendingPaymentInfo({
  reservation,
  timeZone,
  now,
}: {
  reservation: ReservationWithVenuePitch;
  timeZone: string;
  now: number;
}) {
  const { venue } = reservation;
  const owesDeposit =
    reservation.depositMinor > 0 && reservation.paidMinor < reservation.depositMinor;
  const holdExpiresAt = reservation.holdExpiresAt;
  const deadline = holdExpiresAt
    ? dateKeyInTimeZone(holdExpiresAt, timeZone) === dateKeyInTimeZone(new Date(now), timeZone)
      ? `Paga ${formatBeforeTime(holdExpiresAt, timeZone)}`
      : `Paga ${formatBeforeTime(holdExpiresAt, timeZone)} del ${formatLongDate(dateKeyInTimeZone(holdExpiresAt, timeZone))}`
    : null;
  const expired = isHoldExpired(reservation, now);
  const instructions = expired ? null : venue.paymentInstructions?.trim() || null;
  const phone = venue.contactPhone?.trim() || null;

  return (
    <div className="grid gap-xs rounded-[var(--radius-md)] bg-feedback-warning-soft p-sm text-sm leading-[18px] text-text">
      {expired ? (
        <>
          <p className="m-0 font-bold">
            Anticipo: {formatMoneyMinor(reservation.depositMinor, reservation.currency)} · venció el
            plazo para pagarlo
          </p>
          <p className="m-0">El horario se liberó. No pagues sin hablar antes con el complejo.</p>
        </>
      ) : owesDeposit ? (
        <>
          <p className="m-0 font-bold">
            Anticipo: {formatMoneyMinor(reservation.depositMinor, reservation.currency)}
            {deadline ? ` · ${deadline}` : ''}
          </p>
          {deadline ? (
            <p className="m-0 text-muted">Si no se registra a tiempo, el horario se libera.</p>
          ) : null}
        </>
      ) : reservation.depositMinor > 0 ? (
        <p className="m-0 font-bold">Anticipo registrado. Falta la confirmación del complejo.</p>
      ) : (
        <p className="m-0 font-bold">El complejo revisará tu solicitud y la confirmará.</p>
      )}
      {instructions ? <p className="m-0 whitespace-pre-line">{instructions}</p> : null}
      {phone ? (
        <p className="m-0">
          Contacto del complejo:{' '}
          <a
            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
            className="font-bold text-text underline underline-offset-2"
          >
            {phone}
          </a>
        </p>
      ) : null}
    </div>
  );
}
