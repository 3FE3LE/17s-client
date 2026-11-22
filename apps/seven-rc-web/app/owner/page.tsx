'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
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
  CalendarClock,
  Inbox,
  ListChecks,
} from '@17suit/ui';
import {
  ConfirmDialog,
  InlineError,
  InlineStatus,
  ListSkeleton,
  SectionHeader,
  SelectField,
} from '@/components/seven-rc-ui';
import { describeError } from '@/lib/seven-rc-errors';
import {
  DEFAULT_TIMEZONE,
  SPORT_OPTIONS,
  VENUE_TIMEZONE_OPTIONS,
  WEEKDAYS,
  addDaysToDateKey,
  dateKeyInTimeZone,
  formatDuration,
  formatLongDate,
  formatMoneyMinor,
  formatSlotWhen,
  formatTimeRange,
  reservationStatus,
  safeTimeZone,
  sportLabel,
} from '@/lib/seven-rc-format';
import {
  useConfigurePitchSlotsMutation,
  useConfirmVenueReservationMutation,
  useCreateVenueMutation,
  useCreateVenuePitchMutation,
  useOwnerVenuePitchesQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
  useRejectVenueReservationMutation,
  type VenueReservation,
} from '@/lib/owner-queries';

const DEFAULT_RANGE_DAYS = 7;
const VENUE_NAME_INPUT_ID = 'nuevo-complejo-nombre';
const INACTIVE_STATUSES = new Set(['cancelled', 'rejected', 'expired']);

export default function OwnerPage() {
  const router = useRouter();
  const { role, isLoading } = useCurrentUserRoleQuery();
  useRoleGate({ required: 'OWNER', router });

  if (isLoading || role !== 'OWNER') {
    return (
      <AppFrame appName="Mi complejo" subtitle="Cargando tu cuenta…">
        <ListSkeleton rows={3} label="Cargando tu cuenta" />
      </AppFrame>
    );
  }

  return <OwnerWorkspace />;
}

function customerLabel(reservation: VenueReservation): string {
  return (
    reservation.user?.name ??
    reservation.customerName ??
    reservation.user?.email ??
    'Jugador sin nombre'
  );
}

function OwnerWorkspace() {
  const venuesQuery = useOwnerVenuesQuery();
  const venues = venuesQuery.data ?? [];
  const [explicitVenueId, setExplicitVenueId] = useState<string | null>(null);
  const selectedVenue = venues.find((venue) => venue.id === explicitVenueId) ?? venues[0] ?? null;
  const venueId = selectedVenue?.id ?? null;
  const timeZone = safeTimeZone(selectedVenue?.timezone);
  const todayKey = dateKeyInTimeZone(new Date(), timeZone);

  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
  const pitches = pitchesQuery.data ?? [];

  const [explicitFrom, setExplicitFrom] = useState<string | null>(null);
  const [explicitTo, setExplicitTo] = useState<string | null>(null);
  const dateFrom = explicitFrom ?? todayKey;
  const dateTo = explicitTo ?? addDaysToDateKey(todayKey, DEFAULT_RANGE_DAYS);
  const reservationsQuery = useOwnerVenueReservationsQuery(venueId, dateFrom, dateTo);
  const reservations = reservationsQuery.data ?? [];

  const confirmMutation = useConfirmVenueReservationMutation(venueId);
  const rejectMutation = useRejectVenueReservationMutation(venueId);
  const [actionError, setActionError] = useState<{ id: string; message: string } | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const rejectDialogRef = useRef<HTMLDialogElement | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VenueReservation | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);

  const configRef = useRef<HTMLDetailsElement | null>(null);
  const [configOpen, setConfigOpen] = useState<boolean | null>(null);
  const pitchesWithoutHours = pitches.filter(
    (pitch) => Object.keys(pitch.openingHours ?? {}).length === 0,
  );
  const needsSetup =
    !venuesQuery.isLoading &&
    (venues.length === 0 ||
      (!pitchesQuery.isLoading && (pitches.length === 0 || pitchesWithoutHours.length > 0)));

  const pending = reservations
    .filter((reservation) => reservation.status === 'pending_confirmation')
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
  const active = reservations.filter((reservation) => !INACTIVE_STATUSES.has(reservation.status));
  const today = active.filter(
    (reservation) => dateKeyInTimeZone(reservation.startAt, timeZone) === todayKey,
  );
  const upcomingByDay = new Map<string, VenueReservation[]>();
  for (const reservation of active) {
    const key = dateKeyInTimeZone(reservation.startAt, timeZone);
    if (key === todayKey) continue;
    upcomingByDay.set(key, [...(upcomingByDay.get(key) ?? []), reservation]);
  }

  function openConfig() {
    if (configRef.current) configRef.current.open = true;
    setConfigOpen(true);
    document.getElementById(VENUE_NAME_INPUT_ID)?.focus();
  }

  async function onConfirm(reservation: VenueReservation) {
    setActionError(null);
    setActionNotice(null);
    setConfirmingId(reservation.id);
    try {
      await confirmMutation.mutateAsync(reservation.id);
      setActionNotice(`Confirmaste la reserva de ${customerLabel(reservation)}.`);
    } catch (error) {
      setActionError({
        id: reservation.id,
        message: describeError(error, 'No se pudo confirmar la reserva.'),
      });
      void reservationsQuery.refetch();
    } finally {
      setConfirmingId(null);
    }
  }

  function openReject(reservation: VenueReservation) {
    setRejectTarget(reservation);
    setRejectError(null);
    setActionError(null);
    setActionNotice(null);
    rejectDialogRef.current?.showModal();
  }

  async function onRejectConfirmed() {
    if (!rejectTarget) return;
    setRejectError(null);
    try {
      await rejectMutation.mutateAsync(rejectTarget.id);
      setActionNotice(`Rechazaste la solicitud de ${customerLabel(rejectTarget)}.`);
      rejectDialogRef.current?.close();
    } catch (error) {
      setRejectError(describeError(error, 'No se pudo rechazar la solicitud.'));
      void reservationsQuery.refetch();
    }
  }

  if (venuesQuery.isLoading) {
    return (
      <AppFrame appName="Mi complejo" subtitle="Cargando tus complejos…">
        <ListSkeleton rows={3} label="Cargando tus complejos" />
      </AppFrame>
    );
  }

  const reservationsBusy = Boolean(venueId) && reservationsQuery.isLoading;
  const reservationsError = reservationsQuery.error
    ? describeError(reservationsQuery.error, 'No se pudieron cargar las reservas.')
    : null;

  return (
    <AppFrame
      appName="Mi complejo"
      subtitle={
        selectedVenue
          ? `${selectedVenue.name} · solicitudes y agenda en hora del complejo`
          : 'Crea tu complejo para empezar a recibir reservas.'
      }
    >
      {venuesQuery.error ? (
        <div className="grid gap-sm">
          <InlineError
            message={describeError(venuesQuery.error, 'No se pudieron cargar tus complejos.')}
          />
          <AppButton variant="neutral" fullWidth={false} onPress={() => void venuesQuery.refetch()}>
            Reintentar
          </AppButton>
        </div>
      ) : null}

      {venues.length > 1 ? (
        <div className="max-w-[var(--container-form)]">
          <SelectField
            label="Complejo"
            name="complejo"
            value={selectedVenue?.id ?? ''}
            onChangeValue={(value) => {
              setExplicitVenueId(value);
              setExplicitFrom(null);
              setExplicitTo(null);
            }}
            options={venues.map((venue) => ({ value: venue.id, label: venue.name }))}
          />
        </div>
      ) : null}

      {venues.length === 0 && !venuesQuery.error ? (
        <AppEmpty
          icon={<ListChecks size={18} aria-hidden />}
          title="Aún no tienes un complejo"
          description="Créalo, agrega tus canchas y define horarios. Después verás aquí las solicitudes de los jugadores."
          actionLabel="Crear mi complejo"
          onAction={openConfig}
        />
      ) : null}

      {selectedVenue ? (
        <>
          <p aria-live="polite" className="m-0 min-h-[18px] text-sm leading-[18px] text-muted">
            {actionNotice ?? ''}
          </p>

          <section aria-labelledby="pendientes-title" className="grid gap-md">
            <SectionHeader
              id="pendientes-title"
              title={`Solicitudes pendientes${pending.length > 0 ? ` (${pending.length})` : ''}`}
              description="Confirma o rechaza cada solicitud. El jugador ve el cambio en su lista de reservas."
            />
            {reservationsBusy ? (
              <ListSkeleton rows={2} label="Cargando solicitudes" />
            ) : reservationsError ? (
              <div className="grid gap-sm">
                <InlineError message={reservationsError} />
                <AppButton
                  variant="neutral"
                  fullWidth={false}
                  onPress={() => void reservationsQuery.refetch()}
                >
                  Reintentar
                </AppButton>
              </div>
            ) : pending.length === 0 ? (
              <AppEmpty
                icon={<Inbox size={18} aria-hidden />}
                title="No hay solicitudes por atender"
                description="Las nuevas solicitudes de los jugadores aparecerán aquí."
              />
            ) : (
              <ul className="m-0 grid list-none gap-sm p-0">
                {pending.map((reservation) => (
                  <li
                    key={reservation.id}
                    className="grid gap-sm rounded-[var(--radius-lg)] border border-border-strong bg-background p-md md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <ReservationDetails reservation={reservation} timeZone={timeZone} showDate />
                    <div className="grid gap-sm">
                      <div className="flex flex-wrap gap-sm">
                        <AppButton
                          variant="success"
                          compact
                          fullWidth={false}
                          disabled={confirmingId === reservation.id}
                          onPress={() => void onConfirm(reservation)}
                        >
                          {confirmingId === reservation.id ? 'Confirmando…' : 'Confirmar'}
                        </AppButton>
                        <AppButton
                          variant="neutral"
                          compact
                          fullWidth={false}
                          disabled={confirmingId === reservation.id}
                          onPress={() => openReject(reservation)}
                        >
                          Rechazar
                        </AppButton>
                      </div>
                      <InlineError
                        message={actionError?.id === reservation.id ? actionError.message : null}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="hoy-title" className="mt-lg grid gap-md">
            <SectionHeader
              id="hoy-title"
              title="Agenda de hoy"
              description={formatLongDate(todayKey)}
            />
            {reservationsBusy ? (
              <ListSkeleton rows={2} label="Cargando la agenda de hoy" />
            ) : reservationsError ? null : today.length === 0 ? (
              <AppEmpty
                icon={<CalendarClock size={18} aria-hidden />}
                title="Hoy no hay reservas"
                description="Comparte el complejo con tus jugadores para que reserven desde Seven RC."
              />
            ) : (
              <AgendaList reservations={today} timeZone={timeZone} />
            )}
          </section>

          <section aria-labelledby="proximos-title" className="mt-lg grid gap-md">
            <SectionHeader id="proximos-title" title="Próximos días" />
            <div className="grid max-w-[var(--container-form)] grid-cols-2 gap-sm">
              <AppInput
                type="date"
                name="desde"
                label="Desde"
                value={dateFrom}
                min={todayKey}
                max={dateTo}
                onChangeText={(value) => setExplicitFrom(value || null)}
              />
              <AppInput
                type="date"
                name="hasta"
                label="Hasta"
                value={dateTo}
                min={dateFrom}
                onChangeText={(value) => setExplicitTo(value || null)}
              />
            </div>
            {reservationsBusy ? (
              <ListSkeleton rows={2} label="Cargando próximas reservas" />
            ) : reservationsError ? null : upcomingByDay.size === 0 ? (
              <p className="m-0 text-md leading-[1.5] text-muted">
                No hay reservas en esas fechas.
              </p>
            ) : (
              <div className="grid gap-md">
                {[...upcomingByDay.entries()]
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([dateKey, dayReservations]) => (
                    <div key={dateKey} className="grid gap-sm">
                      <h3 className="m-0 font-arvo text-md leading-[1.3] text-text first-letter:uppercase">
                        {formatLongDate(dateKey)}
                      </h3>
                      <AgendaList reservations={dayReservations} timeZone={timeZone} />
                    </div>
                  ))}
              </div>
            )}
          </section>
        </>
      ) : null}

      <details
        ref={configRef}
        open={configOpen ?? needsSetup}
        onToggle={(event) => setConfigOpen(event.currentTarget.open)}
        className="mt-lg rounded-[var(--radius-lg)] border border-border-strong"
      >
        <summary className="flex min-h-12 cursor-pointer items-center gap-sm px-md font-arvo text-lg text-text">
          Configuración
          {needsSetup ? (
            <AppBadge variant="warning">
              {venues.length === 0 ? 'Empieza aquí' : 'Falta completar'}
            </AppBadge>
          ) : null}
        </summary>
        <div className="grid gap-xl border-t border-border-default p-md">
          <CreateVenueForm
            onCreated={(id) => {
              setExplicitVenueId(id);
              setConfigOpen(true);
            }}
          />
          {selectedVenue ? (
            <>
              <CreatePitchForm venueId={selectedVenue.id} venueName={selectedVenue.name} />
              <OpeningHoursForm
                venueId={selectedVenue.id}
                pitches={pitches}
                isLoading={pitchesQuery.isLoading}
              />
            </>
          ) : null}
        </div>
      </details>

      <ConfirmDialog
        dialogRef={rejectDialogRef}
        title="¿Rechazar esta solicitud?"
        confirmLabel="Sí, rechazar solicitud"
        pendingLabel="Rechazando…"
        dismissLabel="Volver"
        isPending={rejectMutation.isPending}
        error={rejectError}
        onConfirm={() => void onRejectConfirmed()}
        onClosed={() => {
          setRejectTarget(null);
          setRejectError(null);
        }}
      >
        {rejectTarget ? (
          <>
            <p className="m-0 text-text first-letter:uppercase">
              {customerLabel(rejectTarget)} · {rejectTarget.pitch.name} ·{' '}
              {formatSlotWhen(rejectTarget.startAt, rejectTarget.endAt, timeZone)}
            </p>
            <p className="m-0">
              El jugador verá la solicitud como rechazada y el horario quedará libre. No se puede
              deshacer.
            </p>
          </>
        ) : null}
      </ConfirmDialog>
    </AppFrame>
  );
}

function ReservationDetails({
  reservation,
  timeZone,
  showDate = false,
}: {
  reservation: VenueReservation;
  timeZone: string;
  showDate?: boolean;
}) {
  const status = reservationStatus(reservation.status);
  return (
    <div className="grid min-w-0 gap-xs">
      <div className="flex flex-wrap items-center gap-sm">
        <p className="m-0 break-words font-bold leading-[1.3] text-text">
          {customerLabel(reservation)}
        </p>
        <AppBadge variant={status.variant}>{status.label}</AppBadge>
      </div>
      <p className="m-0 text-md leading-[1.5] text-text first-letter:uppercase">
        {reservation.pitch.name} ·{' '}
        {showDate
          ? formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)
          : formatTimeRange(reservation.startAt, reservation.endAt, timeZone)}
      </p>
      <p className="m-0 text-sm leading-[18px] text-muted">
        {[
          reservation.priceMinor > 0
            ? formatMoneyMinor(reservation.priceMinor, reservation.currency)
            : null,
          reservation.depositMinor > 0
            ? `anticipo ${formatMoneyMinor(reservation.depositMinor, reservation.currency)}`
            : null,
          reservation.paidMinor > 0
            ? `pagado ${formatMoneyMinor(reservation.paidMinor, reservation.currency)}`
            : null,
          reservation.invitedCount > 0 ? `${reservation.invitedCount} invitados` : null,
          reservation.customerPhone ?? null,
        ]
          .filter(Boolean)
          .join(' · ')}
      </p>
      {reservation.notes ? (
        <p className="m-0 break-words text-sm leading-[18px] text-muted">
          Nota: {reservation.notes}
        </p>
      ) : null}
    </div>
  );
}

function AgendaList({
  reservations,
  timeZone,
}: {
  reservations: VenueReservation[];
  timeZone: string;
}) {
  return (
    <ul className="m-0 grid list-none gap-sm p-0">
      {[...reservations]
        .sort((a, b) => a.startAt.localeCompare(b.startAt))
        .map((reservation) => (
          <li
            key={reservation.id}
            className="rounded-[var(--radius-lg)] border border-border-default bg-background p-md"
          >
            <ReservationDetails reservation={reservation} timeZone={timeZone} />
          </li>
        ))}
    </ul>
  );
}

function CreateVenueForm({ onCreated }: { onCreated: (venueId: string) => void }) {
  const createVenueMutation = useCreateVenueMutation();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (name.trim().length < 3) {
      setError('El nombre del complejo necesita al menos 3 caracteres.');
      return;
    }
    try {
      const created = await createVenueMutation.mutateAsync({
        name: name.trim(),
        ...(location.trim() ? { location: location.trim() } : {}),
        timezone,
      });
      setName('');
      setLocation('');
      setNotice(`Creaste “${created.name}”. Ahora agrega sus canchas.`);
      onCreated(created.id);
    } catch (caught) {
      setError(describeError(caught, 'No se pudo crear el complejo.'));
    }
  }

  return (
    <form onSubmit={onSubmit} aria-labelledby="crear-complejo-title" className="grid gap-sm">
      <h3 id="crear-complejo-title" className="m-0 font-arvo text-md text-text">
        Nuevo complejo
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <AppInput
          id={VENUE_NAME_INPUT_ID}
          name="name"
          label="Nombre del complejo"
          autoComplete="organization"
          required
          minLength={3}
          maxLength={120}
          value={name}
          onChangeText={setName}
        />
        <AppInput
          name="location"
          label="Dirección (opcional)"
          autoComplete="street-address"
          maxLength={255}
          value={location}
          onChangeText={setLocation}
        />
        <SelectField
          label="Zona horaria del complejo"
          name="timezone"
          value={timezone}
          onChangeValue={setTimezone}
          options={VENUE_TIMEZONE_OPTIONS}
          hint="Los horarios de las canchas se muestran en esta hora."
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={createVenueMutation.isPending}>
          {createVenueMutation.isPending ? 'Creando…' : 'Crear complejo'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}

function CreatePitchForm({ venueId, venueName }: { venueId: string; venueName: string }) {
  const createPitchMutation = useCreateVenuePitchMutation(venueId);
  const [name, setName] = useState('');
  const [sportType, setSportType] = useState('futbol-5');
  const [capacity, setCapacity] = useState('10');
  const [duration, setDuration] = useState('60');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const parsedCapacity = Number(capacity);
    const parsedDuration = Number(duration);
    if (name.trim().length < 2) {
      setError('El nombre de la cancha necesita al menos 2 caracteres.');
      return;
    }
    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 1 || parsedCapacity > 100) {
      setError('La capacidad debe estar entre 1 y 100 jugadores.');
      return;
    }
    if (!Number.isInteger(parsedDuration) || parsedDuration < 30 || parsedDuration > 240) {
      setError('La duración del turno debe estar entre 30 y 240 minutos.');
      return;
    }
    try {
      const created = await createPitchMutation.mutateAsync({
        name: name.trim(),
        sportType,
        capacity: parsedCapacity,
        slotDurationMinutes: parsedDuration,
      });
      setName('');
      setNotice(`Agregaste “${created.name}”. Define sus horarios abajo.`);
    } catch (caught) {
      setError(describeError(caught, 'No se pudo crear la cancha.'));
    }
  }

  return (
    <form onSubmit={onSubmit} aria-labelledby="crear-cancha-title" className="grid gap-sm">
      <h3 id="crear-cancha-title" className="m-0 font-arvo text-md text-text">
        Nueva cancha en {venueName}
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <AppInput
          name="pitchName"
          label="Nombre de la cancha"
          placeholder="Ej.: Cancha 1"
          autoComplete="off"
          required
          minLength={2}
          maxLength={120}
          value={name}
          onChangeText={setName}
        />
        <SelectField
          label="Deporte"
          name="sportType"
          value={sportType}
          onChangeValue={setSportType}
          options={SPORT_OPTIONS}
        />
        <AppInput
          type="number"
          name="capacity"
          label="Capacidad (jugadores)"
          inputMode="numeric"
          min={1}
          max={100}
          step={1}
          required
          value={capacity}
          onChangeText={setCapacity}
        />
        <AppInput
          type="number"
          name="slotDurationMinutes"
          label="Duración del turno (minutos)"
          inputMode="numeric"
          min={30}
          max={240}
          step={15}
          required
          value={duration}
          onChangeText={setDuration}
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={createPitchMutation.isPending}>
          {createPitchMutation.isPending ? 'Guardando…' : 'Agregar cancha'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}

function OpeningHoursForm({
  venueId,
  pitches,
  isLoading,
}: {
  venueId: string;
  pitches: Array<{
    id: string;
    name: string;
    sportType: string;
    slotDurationMinutes: number;
    openingHours: Record<string, { openTime?: string; closeTime?: string }>;
  }>;
  isLoading: boolean;
}) {
  const [explicitPitchId, setExplicitPitchId] = useState<string | null>(null);
  const pitch = pitches.find((item) => item.id === explicitPitchId) ?? pitches[0] ?? null;
  const configureMutation = useConfigurePitchSlotsMutation(pitch?.id ?? 'missing', venueId);
  const [days, setDays] = useState<number[]>([]);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [duration, setDuration] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (isLoading) return <ListSkeleton rows={1} label="Cargando canchas" />;
  if (!pitch) {
    return (
      <p className="m-0 text-md leading-[1.5] text-muted">
        Agrega una cancha para definir sus horarios.
      </p>
    );
  }

  const currentHours = pitch.openingHours ?? {};
  const durationValue = duration ?? String(pitch.slotDurationMinutes);

  function toggleDay(day: number, checked: boolean) {
    setDays((current) =>
      checked ? [...new Set([...current, day])] : current.filter((value) => value !== day),
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pitch) return;
    setError(null);
    setNotice(null);
    if (days.length === 0) {
      setError('Elige al menos un día.');
      return;
    }
    if (closeTime <= openTime && closeTime !== '00:00') {
      setError('La hora de cierre debe ser posterior a la de apertura.');
      return;
    }
    const parsedDuration = Number(durationValue);
    if (!Number.isInteger(parsedDuration) || parsedDuration < 30 || parsedDuration > 240) {
      setError('La duración del turno debe estar entre 30 y 240 minutos.');
      return;
    }

    // The endpoint replaces the whole week, so carry over days not being edited.
    const keptDays = Object.entries(currentHours)
      .filter(([day, hours]) => !days.includes(Number(day)) && hours.openTime && hours.closeTime)
      .map(([day, hours]) => ({
        dayOfWeek: Number(day),
        openTime: hours.openTime as string,
        closeTime: hours.closeTime as string,
      }));
    const editedDays = days.map((dayOfWeek) => ({ dayOfWeek, openTime, closeTime }));

    try {
      await configureMutation.mutateAsync({
        openingHours: [...keptDays, ...editedDays],
        slotDurationMinutes: parsedDuration,
      });
      const names = WEEKDAYS.filter((day) => days.includes(day.value))
        .map((day) => day.label.toLowerCase())
        .join(', ');
      setNotice(`Guardaste ${openTime}–${closeTime} para ${names} en ${pitch.name}.`);
      setDays([]);
    } catch (caught) {
      setError(describeError(caught, 'No se pudieron guardar los horarios.'));
    }
  }

  return (
    <form onSubmit={onSubmit} aria-labelledby="horarios-title" className="grid gap-md">
      <h3 id="horarios-title" className="m-0 font-arvo text-md text-text">
        Horarios de apertura
      </h3>
      <div className="grid gap-md md:grid-cols-2">
        <div className="grid content-start gap-sm">
          {pitches.length > 1 ? (
            <SelectField
              label="Cancha"
              name="pitch"
              value={pitch.id}
              onChangeValue={(value) => {
                setExplicitPitchId(value);
                setDuration(null);
                setDays([]);
                setNotice(null);
              }}
              options={pitches.map((item) => ({
                value: item.id,
                label: `${item.name} · ${sportLabel(item.sportType)}`,
              }))}
            />
          ) : (
            <p className="m-0 text-md leading-[1.5] text-text">
              {pitch.name} · {sportLabel(pitch.sportType)}
            </p>
          )}
          <div>
            <p className="m-0 mb-xs text-sm leading-[1.5] text-muted">Semana actual</p>
            <ul className="m-0 grid list-none gap-1 p-0 text-sm leading-[1.5]">
              {WEEKDAYS.map((day) => {
                const hours = currentHours[String(day.value)];
                return (
                  <li key={day.value} className="flex justify-between gap-sm">
                    <span className="text-text">{day.label}</span>
                    <span className="tabular-nums text-muted">
                      {hours?.openTime && hours.closeTime
                        ? `${hours.openTime}–${hours.closeTime}`
                        : 'Cerrado'}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="m-0 mt-xs text-sm leading-[18px] text-muted">
              Turnos de {formatDuration(pitch.slotDurationMinutes)}.
            </p>
          </div>
        </div>

        <div className="grid content-start gap-sm">
          <fieldset className="m-0 grid gap-sm border-0 p-0">
            <legend className="mb-xs p-0 text-sm leading-[1.5] text-muted">
              Días a los que aplicar el horario
            </legend>
            <div className="flex flex-wrap gap-sm">
              {WEEKDAYS.map((day) => (
                <label
                  key={day.value}
                  className="flex min-h-11 cursor-pointer items-center gap-xs rounded-[var(--radius-md)] border border-border-strong px-3 text-md text-text has-[:checked]:border-action-primary has-[:checked]:bg-action-primary-soft"
                >
                  <input
                    type="checkbox"
                    name="days"
                    value={day.value}
                    checked={days.includes(day.value)}
                    onChange={(event) => toggleDay(day.value, event.target.checked)}
                    className="h-4 w-4 accent-[var(--color-action-primary)]"
                  />
                  {day.label}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-sm">
              <button
                type="button"
                className="min-h-11 cursor-pointer border-0 bg-transparent px-0 text-sm text-text underline underline-offset-4"
                onClick={() => setDays([1, 2, 3, 4, 5])}
              >
                Lunes a viernes
              </button>
              <button
                type="button"
                className="min-h-11 cursor-pointer border-0 bg-transparent px-0 text-sm text-text underline underline-offset-4"
                onClick={() => setDays([0, 1, 2, 3, 4, 5, 6])}
              >
                Toda la semana
              </button>
            </div>
          </fieldset>
          <div className="grid grid-cols-2 gap-sm">
            <AppInput
              type="time"
              name="openTime"
              label="Abre"
              step={900}
              required
              value={openTime}
              onChangeText={setOpenTime}
            />
            <AppInput
              type="time"
              name="closeTime"
              label="Cierra"
              step={900}
              required
              value={closeTime}
              onChangeText={setCloseTime}
            />
          </div>
          <AppInput
            type="number"
            name="slotDurationMinutes"
            label="Duración del turno (minutos)"
            inputMode="numeric"
            min={30}
            max={240}
            step={15}
            value={durationValue}
            onChangeText={setDuration}
          />
          <AppButton type="submit" disabled={configureMutation.isPending}>
            {configureMutation.isPending ? 'Guardando…' : 'Guardar horarios'}
          </AppButton>
          <InlineError message={error} />
          <InlineStatus message={notice} />
        </div>
      </div>
    </form>
  );
}
