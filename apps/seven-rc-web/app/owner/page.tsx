'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent, type MouseEvent, type RefObject } from 'react';
import { flushSync } from 'react-dom';
import {
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import {
  AppBadge,
  AppButton,
  AppFrame,
  AppInput,
  CalendarClock,
  CheckCircle2,
  Inbox,
  cx,
} from '@17suit/ui';
import { PitchBlocksSection } from '@/components/pitch-blocks';
import { PublishVenueForm } from '@/components/publish-venue-form';
import {
  ConfirmDialog,
  HintedInput,
  InlineError,
  InlineStatus,
  ListSkeleton,
  RefreshControl,
  SectionHeader,
  SelectField,
  TextAreaField,
} from '@/components/seven-rc-ui';
import { describeError } from '@/lib/seven-rc-errors';
import {
  DEFAULT_TIMEZONE,
  DISPLAY_LOCALE,
  SPORT_OPTIONS,
  VENUE_TIMEZONE_OPTIONS,
  WEEKDAYS,
  addDaysToDateKey,
  dateKeyInTimeZone,
  formatDuration,
  formatLongDate,
  formatMoneyMinor,
  formatSlotWhen,
  formatTime,
  formatTimeRange,
  reservationStatus,
  safeTimeZone,
  sportLabel,
} from '@/lib/seven-rc-format';
import {
  useCompleteReservationMutation,
  useConfigurePitchPricingMutation,
  useConfigurePitchSlotsMutation,
  useConfirmVenueReservationMutation,
  useCreateVenueMutation,
  useCreateVenuePitchMutation,
  useMarkNoShowMutation,
  useOwnerCancelReservationMutation,
  useOwnerVenuePitchesQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
  useRecordReservationPaymentMutation,
  useRejectVenueReservationMutation,
  useUpdateVenueSettingsMutation,
  type OwnerVenue,
  type PitchWithPricing,
  type ReservationPaymentKind,
  type ReservationPaymentMethod,
  type VenueReservation,
} from '@/lib/owner-queries';
import { useNow } from '@/lib/use-now';

const DEFAULT_RANGE_DAYS = 7;
const DEFAULT_HORIZON_DAYS = 30;
const PENDING_POLL_MS = 30_000;
const SETTLED_ROW_MS = 2_500;
const PENDING_HEADING_ID = 'pendientes-title';
const TODAY_HEADING_ID = 'hoy-title';
/** The server stores amounts as 32-bit integers of minor units. */
const MAX_AMOUNT_MINOR = 2_147_483_647;
const PAYABLE_STATUSES = new Set(['pending_confirmation', 'confirmed', 'completed']);
const VENUE_NAME_INPUT_ID = 'nuevo-complejo-nombre';
const INACTIVE_STATUSES = new Set(['cancelled', 'rejected', 'expired']);
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

type SettledOutcome = 'confirmed' | 'rejected';
type OwnerActionKind = 'confirm' | 'reject' | 'complete' | 'no_show' | 'cancel';
type NoticeArea = 'pending' | 'agenda';

const ACTION_COPY: Record<
  OwnerActionKind,
  {
    title: string;
    confirmLabel: string;
    pendingLabel: string;
    dismissLabel: string;
    tone: 'primary' | 'destructive';
    body: string;
    done: (name: string) => string;
    fallback: string;
  }
> = {
  confirm: {
    title: '¿Confirmar esta reserva?',
    confirmLabel: 'Confirmar reserva',
    pendingLabel: 'Confirmando…',
    dismissLabel: 'Volver',
    tone: 'primary',
    body: 'El jugador verá la reserva como confirmada y el turno queda apartado. Si luego cambias de idea, tendrás que cancelarla.',
    done: (name) => `Confirmaste la reserva de ${name}.`,
    fallback: 'No se pudo confirmar la reserva.',
  },
  reject: {
    title: '¿Rechazar esta solicitud?',
    confirmLabel: 'Sí, rechazar solicitud',
    pendingLabel: 'Rechazando…',
    dismissLabel: 'Volver',
    tone: 'destructive',
    body: 'El jugador verá la solicitud como rechazada y el horario quedará libre. No se puede deshacer.',
    done: (name) => `Rechazaste la solicitud de ${name}.`,
    fallback: 'No se pudo rechazar la solicitud.',
  },
  complete: {
    title: '¿Marcar como completada?',
    confirmLabel: 'Marcar completada',
    pendingLabel: 'Guardando…',
    dismissLabel: 'Volver',
    tone: 'primary',
    body: 'Indica que el turno se jugó. La reserva pasa al historial y ya no se puede cancelar.',
    done: (name) => `Marcaste como completada la reserva de ${name}.`,
    fallback: 'No se pudo marcar la reserva como completada.',
  },
  no_show: {
    title: '¿Marcar que no asistió?',
    confirmLabel: 'Marcar no asistió',
    pendingLabel: 'Guardando…',
    dismissLabel: 'Volver',
    tone: 'destructive',
    body: 'Queda registrado que nadie llegó al turno. No se puede deshacer.',
    done: (name) => `Registraste que ${name} no asistió.`,
    fallback: 'No se pudo registrar la inasistencia.',
  },
  cancel: {
    title: '¿Cancelar esta reserva?',
    confirmLabel: 'Sí, cancelar reserva',
    pendingLabel: 'Cancelando…',
    dismissLabel: 'Conservar reserva',
    tone: 'destructive',
    body: 'El horario quedará libre y el jugador verá la reserva cancelada. No se puede deshacer.',
    done: (name) => `Cancelaste la reserva de ${name}.`,
    fallback: 'No se pudo cancelar la reserva.',
  },
};

const PAYMENT_KIND_OPTIONS: ReadonlyArray<{ value: ReservationPaymentKind; label: string }> = [
  { value: 'deposit', label: 'Anticipo' },
  { value: 'balance', label: 'Saldo' },
  { value: 'refund', label: 'Devolución' },
];

const PAYMENT_METHOD_OPTIONS: ReadonlyArray<{ value: ReservationPaymentMethod; label: string }> = [
  { value: 'transfer', label: 'Transferencia' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'other', label: 'Otro' },
];

function pendingRowId(reservationId: string) {
  return `pendiente-${reservationId}`;
}

/** Moves focus to a row or heading that may not be focusable by default. */
function focusById(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
  element.focus();
}

/**
 * es-CO amount typed by the owner ("120.000", "120000", "12,50") to minor units. Anything
 * ambiguous ("120,000", "-5") is refused rather than guessed: this is money.
 */
function parseAmount(value: string): number | null {
  const match = /^(\d+|\d{1,3}(?:[. ]\d{3})+)(?:,(\d{1,2}))?$/.exec(value.trim());
  if (!match?.[1]) return null;
  const minor =
    Number(match[1].replace(/[. ]/g, '')) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
  return minor <= MAX_AMOUNT_MINOR ? minor : null;
}

/** Inverse of parseAmount, for prefilling a field. */
function formatAmountInput(amountMinor: number): string {
  return new Intl.NumberFormat(DISPLAY_LOCALE, { maximumFractionDigits: 2 }).format(
    amountMinor / 100,
  );
}

function holdExpired(reservation: VenueReservation, now: number): boolean {
  return Boolean(reservation.holdExpiresAt && new Date(reservation.holdExpiresAt).getTime() <= now);
}

/** Focus target for content that replaces what the owner was using. */
function focusOnMount(node: HTMLElement | null) {
  node?.focus();
}

/** Accepts "+57 300 123 4567" or a local Colombian mobile ("300 123 4567"). */
function normalizePhone(value: string, countryCode: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const compact = trimmed.replace(/[\s().-]/g, '');
  if (compact.startsWith('+')) return compact;
  if (countryCode === 'CO' && /^3\d{9}$/.test(compact)) return `+57${compact}`;
  return compact;
}

function parseIntInRange(value: string, min: number, max: number): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const parsed = Number(value);
  return parsed >= min && parsed <= max ? parsed : null;
}

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

function owesDeposit(reservation: VenueReservation): boolean {
  return reservation.depositMinor > 0 && reservation.paidMinor < reservation.depositMinor;
}

interface SetupItem {
  key: string;
  label: string;
  description: string;
  done: boolean;
  /** Heading id of the form that completes the step; null while a prior step is missing. */
  target: string | null;
  /** Pitch that still lacks this step, selected before focusing its form. */
  pitchId?: string | undefined;
}

function OwnerWorkspace() {
  const venuesQuery = useOwnerVenuesQuery();
  const venues = venuesQuery.data ?? [];
  const [explicitVenueId, setExplicitVenueId] = useState<string | null>(null);
  const selectedVenue = venues.find((venue) => venue.id === explicitVenueId) ?? venues[0] ?? null;
  const venueId = selectedVenue?.id ?? null;
  const timeZone = safeTimeZone(selectedVenue?.timezone);
  const todayKey = dateKeyInTimeZone(new Date(), timeZone);
  const [mountedAt] = useState(() => Date.now());
  const tick = useNow();
  const now = tick || mountedAt;

  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
  const pitches = pitchesQuery.data ?? [];

  const [explicitFrom, setExplicitFrom] = useState<string | null>(null);
  const [explicitTo, setExplicitTo] = useState<string | null>(null);
  const dateFrom = explicitFrom ?? todayKey;
  const dateTo = explicitTo ?? addDaysToDateKey(todayKey, DEFAULT_RANGE_DAYS);
  const reservationsQuery = useOwnerVenueReservationsQuery(venueId, dateFrom, dateTo, {
    refetchOnWindowFocus: true,
  });
  const reservations = reservationsQuery.data ?? [];

  // Pending requests ignore the agenda range: fetch the whole bookable window so a
  // request made 8–14 days ahead is never hidden. Polls only while the tab is
  // visible (refetchIntervalInBackground: false) and refetches on focus.
  const horizonDays = Math.max(1, selectedVenue?.bookingHorizonDays ?? DEFAULT_HORIZON_DAYS);
  const pendingQuery = useOwnerVenueReservationsQuery(
    venueId,
    todayKey,
    addDaysToDateKey(todayKey, horizonDays),
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchInterval: PENDING_POLL_MS,
      refetchIntervalInBackground: false,
    },
  );

  const mutations = {
    confirm: useConfirmVenueReservationMutation(venueId),
    reject: useRejectVenueReservationMutation(venueId),
    complete: useCompleteReservationMutation(venueId),
    no_show: useMarkNoShowMutation(venueId),
    cancel: useOwnerCancelReservationMutation(venueId),
  } as const;
  const [notice, setNotice] = useState<{ area: NoticeArea; message: string } | null>(null);
  // Rows just confirmed/rejected stay visible briefly with their outcome, so the
  // result shows where the owner was looking instead of the row simply vanishing.
  const [settled, setSettled] = useState<
    Record<string, { reservation: VenueReservation; outcome: SettledOutcome }>
  >({});

  const actionDialogRef = useRef<HTMLDialogElement | null>(null);
  const [action, setAction] = useState<{
    kind: OwnerActionKind;
    reservation: VenueReservation;
    area: NoticeArea;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const paymentDialogRef = useRef<HTMLDialogElement | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<{
    reservation: VenueReservation;
    area: NoticeArea;
  } | null>(null);

  const configRef = useRef<HTMLDetailsElement | null>(null);
  const [configOpen, setConfigOpen] = useState<boolean | null>(null);
  const [configPitchId, setConfigPitchId] = useState<string | null>(null);

  const pitchesReady = pitchesQuery.data !== undefined;
  const hasVenue = venues.length > 0;
  const hasPitch = pitches.length > 0;
  const withoutHours = pitches.filter(
    (pitch) => Object.keys(pitch.openingHours ?? {}).length === 0,
  );
  const withoutPrice = pitches.filter(
    (pitch) => pitch.basePriceMinor <= 0 && pitch.priceRules.length === 0,
  );
  const missingIn = (missing: PitchWithPricing[]) =>
    missing.length > 0 && pitches.length > 1
      ? ` Falta en ${missing.map((pitch) => pitch.name).join(', ')}.`
      : '';
  const publishMissing = [
    ...(hasPitch ? [] : ['una cancha']),
    ...(hasPitch && withoutHours.length > 0
      ? [`horario en ${withoutHours.map((pitch) => pitch.name).join(', ')}`]
      : []),
    ...(hasPitch && withoutPrice.length > 0
      ? [`precio en ${withoutPrice.map((pitch) => pitch.name).join(', ')}`]
      : []),
  ];
  const setupItems: SetupItem[] = [
    {
      key: 'complejo',
      label: 'Complejo',
      description: 'Nombre, dirección y zona horaria.',
      done: hasVenue,
      target: 'crear-complejo-title',
    },
    {
      key: 'cancha',
      label: 'Cancha',
      description: 'Al menos una cancha con su deporte y capacidad.',
      done: hasPitch,
      target: hasVenue ? 'crear-cancha-title' : null,
    },
    {
      key: 'horarios',
      label: 'Horarios',
      description: `Días y horas en que cada cancha recibe reservas.${missingIn(withoutHours)}`,
      done: hasPitch && withoutHours.length === 0,
      target: hasPitch ? 'horarios-title' : null,
      pitchId: withoutHours[0]?.id,
    },
    {
      key: 'precio',
      label: 'Precio',
      description: `Lo que cuesta cada turno. Sin precio, los jugadores ven “a confirmar”.${missingIn(withoutPrice)}`,
      done: hasPitch && withoutPrice.length === 0,
      target: hasPitch ? 'precio-title' : null,
      pitchId: withoutPrice[0]?.id,
    },
    {
      key: 'ajustes',
      label: 'Ajustes',
      description: 'Teléfono de contacto y, si pides anticipo, cómo pagarlo.',
      done: Boolean(
        selectedVenue?.contactPhone &&
        (selectedVenue.depositPercent === 0 || selectedVenue.paymentInstructions?.trim()),
      ),
      target: hasVenue ? 'ajustes-title' : null,
    },
    {
      key: 'publicar',
      label: 'Publicar',
      description: publishMissing.length
        ? `Para publicar falta: ${publishMissing.join('; ')}.`
        : 'Define tu enlace y publica la página para que los jugadores reserven.',
      done: Boolean(selectedVenue?.isPublished),
      target: hasVenue ? 'publicar-title' : null,
    },
  ];
  const setupKnown = !venuesQuery.isLoading && !venuesQuery.error && (!hasVenue || pitchesReady);
  const setupIncomplete = setupKnown && setupItems.some((item) => !item.done);

  // Last known setup state, adjusted during render. It holds steady while queries load,
  // and hands Configuración back to automatic open/closed when setup starts or finishes.
  const [setup, setSetup] = useState({ venueId, needed: false, finished: false });
  if (setupKnown && (setup.venueId !== venueId || setup.needed !== setupIncomplete)) {
    setSetup({
      venueId,
      needed: setupIncomplete,
      finished: setup.venueId === venueId && setup.needed && !setupIncomplete,
    });
    if (setup.needed !== setupIncomplete) setConfigOpen(null);
  }
  const needsSetup = setup.needed;

  const horizonEnd = addDaysToDateKey(todayKey, horizonDays);
  // Shortening the horizon does not cancel requests already made past it: those still
  // surface here when the agenda range reaches them.
  const pending = [
    ...(pendingQuery.data ?? []),
    ...reservations.filter(
      (reservation) => dateKeyInTimeZone(reservation.startAt, timeZone) > horizonEnd,
    ),
  ]
    .filter(
      (reservation) => reservation.status === 'pending_confirmation' && !settled[reservation.id],
    )
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
  const pendingRows = [
    ...pending.map((reservation) => ({ reservation, outcome: null as SettledOutcome | null })),
    ...Object.values(settled),
  ].sort((a, b) => a.reservation.startAt.localeCompare(b.reservation.startAt));
  const pendingToday = pending.filter(
    (reservation) => dateKeyInTimeZone(reservation.startAt, timeZone) === todayKey,
  ).length;
  // The agenda lists settled bookings only; pending requests live in their own section.
  const inAgenda = (reservation: VenueReservation) =>
    !INACTIVE_STATUSES.has(reservation.status) && reservation.status !== 'pending_confirmation';
  const agenda = reservations.filter(inAgenda);
  // Today comes from the polled window, which always starts today: the date filter
  // below must not be able to empty "Agenda de hoy".
  const today = (pendingQuery.data ?? []).filter(
    (reservation) =>
      inAgenda(reservation) && dateKeyInTimeZone(reservation.startAt, timeZone) === todayKey,
  );
  const upcomingByDay = new Map<string, VenueReservation[]>();
  for (const reservation of agenda) {
    const key = dateKeyInTimeZone(reservation.startAt, timeZone);
    if (key === todayKey) continue;
    upcomingByDay.set(key, [...(upcomingByDay.get(key) ?? []), reservation]);
  }

  /** Opens Configuración and moves focus to the form that completes a step. */
  function goToSetup(targetId: string, pitchId?: string) {
    if (configRef.current) configRef.current.open = true;
    // Commit first: switching pitch remounts the form whose heading receives focus.
    flushSync(() => {
      setConfigOpen(true);
      if (pitchId) setConfigPitchId(pitchId);
    });
    if (targetId === 'crear-complejo-title') {
      document.getElementById(VENUE_NAME_INPUT_ID)?.focus();
      return;
    }
    focusById(targetId);
  }

  function refreshAll() {
    void pendingQuery.refetch();
    void reservationsQuery.refetch();
  }

  /** Shows the outcome on the row, moves focus on, then drops the row. */
  function settleRow(reservation: VenueReservation, outcome: SettledOutcome) {
    const index = pending.findIndex((item) => item.id === reservation.id);
    const remaining = pending.filter((item) => item.id !== reservation.id);
    const next = remaining[index] ?? remaining[index - 1] ?? null;
    setSettled((current) => ({ ...current, [reservation.id]: { reservation, outcome } }));
    focusById(next ? pendingRowId(next.id) : PENDING_HEADING_ID);
    setTimeout(() => {
      setSettled((current) => {
        const rest = { ...current };
        delete rest[reservation.id];
        return rest;
      });
    }, SETTLED_ROW_MS);
  }

  function openAction(kind: OwnerActionKind, reservation: VenueReservation, area: NoticeArea) {
    // Commit first, so the dialog is named and filled when it takes focus.
    flushSync(() => {
      setAction({ kind, reservation, area });
      setActionError(null);
      setNotice(null);
    });
    actionDialogRef.current?.showModal();
  }

  async function runAction() {
    if (!action) return;
    const { kind, reservation, area } = action;
    setActionError(null);
    try {
      await mutations[kind].mutateAsync(reservation.id);
      setNotice({ area, message: ACTION_COPY[kind].done(customerLabel(reservation)) });
      // Close first: the dialog returns focus to its opener, which settleRow then moves.
      actionDialogRef.current?.close();
      if (kind === 'confirm') settleRow(reservation, 'confirmed');
      if (kind === 'reject') settleRow(reservation, 'rejected');
      // These remove the row or its menu, so focus moves to where the result is announced.
      if (kind === 'cancel' || kind === 'no_show') focusById(TODAY_HEADING_ID);
    } catch (error) {
      setActionError(describeError(error, ACTION_COPY[kind].fallback));
      refreshAll();
    }
  }

  function openPayment(reservation: VenueReservation, area: NoticeArea) {
    flushSync(() => {
      setPaymentTarget({ reservation, area });
      setNotice(null);
    });
    paymentDialogRef.current?.showModal();
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
    ? describeError(reservationsQuery.error, 'No se pudo cargar la agenda.')
    : null;
  const todayError = pendingQuery.error
    ? describeError(pendingQuery.error, 'No se pudo cargar la agenda.')
    : null;
  const pendingBusy = Boolean(venueId) && pendingQuery.isLoading;
  const pendingError = pendingQuery.error
    ? describeError(pendingQuery.error, 'No se pudieron cargar las solicitudes.')
    : null;
  const currentAction = action ? ACTION_COPY[action.kind] : null;

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

      {setupIncomplete ? <SetupChecklist items={setupItems} onGo={goToSetup} /> : null}

      {selectedVenue ? (
        <>
          <section aria-labelledby={PENDING_HEADING_ID} className="grid gap-md">
            <SectionHeader
              id={PENDING_HEADING_ID}
              title={`Solicitudes pendientes${pending.length > 0 ? ` (${pending.length})` : ''}`}
              description={`Confirma o rechaza cada solicitud de los próximos ${horizonDays} días. Las nuevas aparecen solas mientras tengas esta página abierta.`}
              aside={
                venueId ? (
                  <RefreshControl
                    dataUpdatedAt={pendingQuery.dataUpdatedAt}
                    isFetching={pendingQuery.isFetching}
                    onRefresh={refreshAll}
                  />
                ) : null
              }
            />
            <InlineStatus message={notice?.area === 'pending' ? notice.message : null} />
            {pendingBusy ? (
              <ListSkeleton rows={2} label="Cargando solicitudes" />
            ) : pendingError ? (
              <div className="grid gap-sm">
                <InlineError message={pendingError} />
                <AppButton
                  variant="neutral"
                  fullWidth={false}
                  onPress={() => void pendingQuery.refetch()}
                >
                  Reintentar
                </AppButton>
              </div>
            ) : pendingRows.length === 0 ? (
              <p className="m-0 inline-flex items-center gap-sm text-md leading-[1.5] text-muted">
                <Inbox size={18} aria-hidden />
                No hay solicitudes por atender.
              </p>
            ) : (
              <ul className="m-0 grid list-none gap-sm p-0">
                {pendingRows.map(({ reservation, outcome }) => (
                  <li
                    key={reservation.id}
                    id={pendingRowId(reservation.id)}
                    tabIndex={-1}
                    aria-label={`Solicitud de ${customerLabel(reservation)}`}
                    className={cx(
                      'grid gap-sm rounded-[var(--radius-lg)] border bg-background p-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-action-primary/40 md:grid-cols-[minmax(0,1fr)_auto] md:items-center',
                      outcome === 'confirmed'
                        ? 'border-success/60 bg-feedback-success-soft'
                        : outcome === 'rejected'
                          ? 'border-border-default opacity-70'
                          : 'border-border-strong',
                    )}
                  >
                    <ReservationDetails
                      reservation={reservation}
                      timeZone={timeZone}
                      now={now}
                      showDate
                      pendingInfo={outcome === null}
                      hideStatus={outcome !== null}
                    />
                    {outcome ? (
                      <p className="m-0 inline-flex items-center gap-xs text-md font-bold leading-[1.3] text-text">
                        {outcome === 'confirmed' ? (
                          <>
                            <CheckCircle2 size={18} aria-hidden className="text-success" />
                            Confirmada
                          </>
                        ) : (
                          'Rechazada'
                        )}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-sm md:justify-end">
                        <AppButton
                          variant="success"
                          compact
                          fullWidth={false}
                          onPress={() => openAction('confirm', reservation, 'pending')}
                        >
                          Confirmar
                        </AppButton>
                        <AppButton
                          variant="neutral"
                          compact
                          fullWidth={false}
                          onPress={() => openAction('reject', reservation, 'pending')}
                        >
                          Rechazar
                        </AppButton>
                        {owesDeposit(reservation) && !holdExpired(reservation, now) ? (
                          <AppButton
                            variant="neutral"
                            compact
                            fullWidth={false}
                            onPress={() => openPayment(reservation, 'pending')}
                          >
                            Registrar anticipo
                          </AppButton>
                        ) : null}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby={TODAY_HEADING_ID} className="mt-lg grid gap-md">
            <SectionHeader
              id={TODAY_HEADING_ID}
              title="Agenda de hoy"
              description={`${formatLongDate(todayKey)} · reservas confirmadas`}
            />
            <InlineStatus message={notice?.area === 'agenda' ? notice.message : null} />
            {pendingBusy ? (
              <ListSkeleton rows={2} label="Cargando la agenda de hoy" />
            ) : todayError ? (
              <div className="grid gap-sm">
                <InlineError message={todayError} />
                <AppButton
                  variant="neutral"
                  fullWidth={false}
                  onPress={() => void pendingQuery.refetch()}
                >
                  Reintentar
                </AppButton>
              </div>
            ) : today.length === 0 ? (
              <div className="grid gap-xs">
                <p className="m-0 inline-flex items-center gap-sm text-md font-bold leading-[1.5] text-text">
                  <CalendarClock size={18} aria-hidden />
                  {pendingToday > 0
                    ? 'Hoy aún no hay reservas confirmadas'
                    : 'Hoy no hay reservas confirmadas'}
                </p>
                <p className="m-0 text-md leading-[1.5] text-muted">
                  {pendingToday > 0
                    ? `${pendingToday === 1 ? 'Una solicitud de hoy espera' : `${pendingToday} solicitudes de hoy esperan`} tu respuesta en “Solicitudes pendientes”. ${pendingToday === 1 ? 'Al confirmarla aparece aquí.' : 'Al confirmarlas aparecen aquí.'}`
                    : 'Las reservas confirmadas para hoy aparecerán aquí con su horario.'}
                </p>
              </div>
            ) : (
              <AgendaList
                reservations={today}
                timeZone={timeZone}
                now={now}
                onAction={(kind, reservation) => openAction(kind, reservation, 'agenda')}
                onPayment={(reservation) => openPayment(reservation, 'agenda')}
              />
            )}
          </section>

          <section aria-labelledby="proximos-title" className="mt-lg grid gap-md">
            <SectionHeader
              id="proximos-title"
              title="Próximos días"
              description="Estas fechas solo filtran la agenda confirmada. Las solicitudes pendientes siempre muestran todo el periodo reservable."
            />
            <fieldset className="m-0 grid max-w-[var(--container-form)] grid-cols-2 gap-sm border-0 p-0">
              <legend className="mb-xs p-0 text-sm leading-[1.5] text-muted">
                Fechas de la agenda
              </legend>
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
            </fieldset>
            {reservationsBusy ? (
              <ListSkeleton rows={2} label="Cargando próximas reservas" />
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
            ) : upcomingByDay.size === 0 ? (
              <p className="m-0 text-md leading-[1.5] text-muted">
                No hay reservas confirmadas en esas fechas.
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
                      <AgendaList
                        reservations={dayReservations}
                        timeZone={timeZone}
                        now={now}
                        onAction={(kind, reservation) => openAction(kind, reservation, 'agenda')}
                        onPayment={(reservation) => openPayment(reservation, 'agenda')}
                      />
                    </div>
                  ))}
              </div>
            )}
          </section>
        </>
      ) : null}

      {setup.finished && setup.venueId === venueId ? (
        <p
          ref={focusOnMount}
          tabIndex={-1}
          className="m-0 mt-lg inline-flex items-center gap-sm text-md leading-[1.5] text-text"
        >
          <CheckCircle2 size={18} aria-hidden className="text-success" />
          Tu complejo quedó configurado. Puedes cambiarlo cuando quieras en “Configuración”.
        </p>
      ) : null}

      {selectedVenue && pitchesReady ? (
        <PitchBlocksSection
          key={selectedVenue.id}
          pitches={pitches}
          timeZone={timeZone}
          todayKey={todayKey}
        />
      ) : null}

      <details
        ref={configRef}
        open={configOpen ?? needsSetup}
        onToggle={(event) => setConfigOpen(event.currentTarget.open)}
        className="mt-lg rounded-[var(--radius-lg)] border border-border-strong"
      >
        <summary className="flex min-h-12 cursor-pointer items-center gap-sm px-md text-text">
          <h2 className="m-0 font-arvo text-lg leading-[1.3] text-text">Configuración</h2>
          {needsSetup ? (
            <AppBadge variant="warning">
              {venues.length === 0 ? 'Empieza aquí' : 'Falta completar'}
            </AppBadge>
          ) : null}
        </summary>
        <div className="grid gap-xl border-t border-border-default p-md">
          {selectedVenue ? (
            <>
              <VenueSettingsForm key={selectedVenue.id} venue={selectedVenue} />
              <PublishVenueForm
                key={`publish-${selectedVenue.id}`}
                venue={selectedVenue}
                missing={publishMissing}
              />
              <PitchConfig
                venueId={selectedVenue.id}
                currency={selectedVenue.currency}
                pitches={pitches}
                selectedId={configPitchId}
                onSelect={setConfigPitchId}
                isLoading={pitchesQuery.isLoading}
                error={
                  pitchesQuery.error && !pitchesReady
                    ? describeError(pitchesQuery.error, 'No se pudieron cargar las canchas.')
                    : null
                }
                onRetry={() => void pitchesQuery.refetch()}
              />
              <CreatePitchForm venueId={selectedVenue.id} venueName={selectedVenue.name} />
            </>
          ) : null}
          <CreateVenueForm
            onCreated={(id) => {
              setExplicitVenueId(id);
              setConfigOpen(true);
            }}
          />
        </div>
      </details>

      <ConfirmDialog
        dialogRef={actionDialogRef}
        title={currentAction?.title ?? ''}
        confirmLabel={currentAction?.confirmLabel ?? ''}
        pendingLabel={currentAction?.pendingLabel ?? ''}
        dismissLabel={currentAction?.dismissLabel ?? 'Volver'}
        tone={currentAction?.tone ?? 'destructive'}
        isPending={action ? mutations[action.kind].isPending : false}
        error={actionError}
        onConfirm={() => void runAction()}
        onClosed={() => {
          setAction(null);
          setActionError(null);
        }}
      >
        {action && currentAction ? (
          <>
            <p className="m-0 text-text first-letter:uppercase">
              {customerLabel(action.reservation)} · {action.reservation.pitch.name} ·{' '}
              {formatSlotWhen(action.reservation.startAt, action.reservation.endAt, timeZone)}
            </p>
            <p className="m-0">{currentAction.body}</p>
            {(action.kind === 'cancel' || action.kind === 'reject') &&
            action.reservation.paidMinor > 0 ? (
              <p className="m-0 text-text">
                Registraste pagos por{' '}
                {formatMoneyMinor(action.reservation.paidMinor, action.reservation.currency)}. Si
                los vas a devolver, anota la devolución con “
                {action.kind === 'reject' ? 'Registrar anticipo' : 'Registrar pago'}” antes de
                continuar: después la reserva sale de la agenda.
              </p>
            ) : null}
            {action.kind === 'confirm' &&
            owesDeposit(action.reservation) &&
            !holdExpired(action.reservation, now) ? (
              <p className="m-0 text-text">
                Aún no registras el anticipo de{' '}
                {formatMoneyMinor(action.reservation.depositMinor, action.reservation.currency)}. Si
                ya lo recibiste, usa “Registrar anticipo”: confirma la reserva y deja el pago
                anotado.
              </p>
            ) : null}
          </>
        ) : null}
      </ConfirmDialog>

      <PaymentDialog
        dialogRef={paymentDialogRef}
        venueId={venueId}
        reservation={paymentTarget?.reservation ?? null}
        timeZone={timeZone}
        onRecorded={(message, reservation, confirmed) => {
          setNotice({ area: paymentTarget?.area ?? 'agenda', message });
          if (confirmed) settleRow(reservation, 'confirmed');
          else if (reservation.status === 'no_show') focusById(TODAY_HEADING_ID);
        }}
        onClosed={() => setPaymentTarget(null)}
      />
    </AppFrame>
  );
}

function SetupChecklist({
  items,
  onGo,
}: {
  items: SetupItem[];
  onGo: (targetId: string, pitchId?: string) => void;
}) {
  const doneCount = items.filter((item) => item.done).length;
  return (
    <section
      aria-labelledby="setup-title"
      className="grid gap-md rounded-[var(--radius-lg)] border border-border-strong bg-background p-md"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-sm">
        <h2 id="setup-title" className="m-0 font-arvo text-lg leading-[1.3] text-text">
          Termina de configurar tu complejo
        </h2>
        <p className="m-0 text-sm leading-[18px] tabular-nums text-muted">
          {doneCount} de {items.length} listos
        </p>
      </div>
      <ol className="m-0 grid list-none gap-xs p-0">
        {items.map((item) => (
          <li
            key={item.key}
            className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-sm border-t border-border-default py-sm first:border-t-0 first:pt-0"
          >
            {item.done ? (
              <CheckCircle2 size={18} aria-hidden className="text-success" />
            ) : (
              <span
                aria-hidden
                className="h-[18px] w-[18px] rounded-full border-2 border-border-strong"
              />
            )}
            <div className="grid min-w-0 gap-[2px]">
              <p
                className={cx(
                  'm-0 font-bold leading-[1.3]',
                  item.done ? 'text-muted' : 'text-text',
                )}
              >
                {item.label}
                <span className="sr-only">{item.done ? ' (listo)' : ' (pendiente)'}</span>
              </p>
              {item.done ? null : (
                <p className="m-0 text-sm leading-[18px] text-muted">{item.description}</p>
              )}
            </div>
            {item.done ? null : item.target ? (
              <button
                type="button"
                className="min-h-11 cursor-pointer border-0 bg-transparent px-xs text-sm font-bold text-text underline underline-offset-4"
                onClick={() => item.target && onGo(item.target, item.pitchId)}
              >
                Completar
                <span className="sr-only"> {item.label.toLowerCase()}</span>
              </button>
            ) : (
              <span className="text-sm leading-[18px] text-muted">Después</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function holdLabel(holdExpiresAt: string, timeZone: string, now: number): string {
  const expired = new Date(holdExpiresAt).getTime() <= now;
  const sameDay =
    dateKeyInTimeZone(holdExpiresAt, timeZone) === dateKeyInTimeZone(new Date(now), timeZone);
  const time = formatTime(holdExpiresAt, timeZone);
  const when = sameDay
    ? time
    : `${time} del ${formatLongDate(dateKeyInTimeZone(holdExpiresAt, timeZone))}`;
  return expired ? `Venció ${when}` : `Vence ${when}`;
}

function ReservationDetails({
  reservation,
  timeZone,
  now,
  showDate = false,
  hideStatus = false,
  pendingInfo = false,
}: {
  reservation: VenueReservation;
  timeZone: string;
  now: number;
  showDate?: boolean;
  hideStatus?: boolean;
  pendingInfo?: boolean;
}) {
  const status = reservationStatus(reservation.status);
  const meta = [
    reservation.priceMinor > 0
      ? formatMoneyMinor(reservation.priceMinor, reservation.currency)
      : 'Precio sin definir',
    !pendingInfo && reservation.depositMinor > 0
      ? `anticipo ${formatMoneyMinor(reservation.depositMinor, reservation.currency)}`
      : null,
    reservation.paidMinor > 0
      ? `pagado ${formatMoneyMinor(reservation.paidMinor, reservation.currency)}`
      : null,
    reservation.invitedCount > 0 ? `${reservation.invitedCount} invitados` : null,
  ].filter(Boolean);
  const phone = reservation.customerPhone?.trim() || null;
  return (
    <div className="grid min-w-0 gap-xs">
      <div className="flex flex-wrap items-center gap-sm">
        <p className="m-0 break-words font-bold leading-[1.3] text-text">
          {customerLabel(reservation)}
        </p>
        {hideStatus ? null : <AppBadge variant={status.variant}>{status.label}</AppBadge>}
      </div>
      <p className="m-0 text-md leading-[1.5] text-text first-letter:uppercase">
        {reservation.pitch.name} ·{' '}
        {showDate
          ? formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)
          : formatTimeRange(reservation.startAt, reservation.endAt, timeZone)}
      </p>
      {pendingInfo ? (
        <p className="m-0 text-sm leading-[18px] text-text">
          {reservation.holdExpiresAt ? (
            <span className="font-bold">{holdLabel(reservation.holdExpiresAt, timeZone, now)}</span>
          ) : null}
          {reservation.holdExpiresAt && reservation.depositMinor > 0 ? ' · ' : null}
          {reservation.depositMinor > 0
            ? owesDeposit(reservation)
              ? `Anticipo de ${formatMoneyMinor(reservation.depositMinor, reservation.currency)} sin registrar`
              : `Anticipo de ${formatMoneyMinor(reservation.depositMinor, reservation.currency)} registrado`
            : null}
        </p>
      ) : null}
      {meta.length > 0 || phone ? (
        <p className="m-0 text-sm leading-[18px] text-muted">
          {meta.join(' · ')}
          {meta.length > 0 && phone ? ' · ' : null}
          {phone ? (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="text-text underline underline-offset-2"
            >
              {phone}
            </a>
          ) : null}
        </p>
      ) : null}
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
  now,
  onAction,
  onPayment,
}: {
  reservations: VenueReservation[];
  timeZone: string;
  now: number;
  onAction: (kind: OwnerActionKind, reservation: VenueReservation) => void;
  onPayment: (reservation: VenueReservation) => void;
}) {
  return (
    <ul className="m-0 grid list-none gap-sm p-0">
      {[...reservations]
        .sort((a, b) => a.startAt.localeCompare(b.startAt))
        .map((reservation) => (
          <li
            key={reservation.id}
            className="grid gap-sm rounded-[var(--radius-lg)] border border-border-default bg-background p-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
          >
            <ReservationDetails reservation={reservation} timeZone={timeZone} now={now} />
            <RowActions
              reservation={reservation}
              now={now}
              onAction={(kind) => onAction(kind, reservation)}
              onPayment={() => onPayment(reservation)}
            />
          </li>
        ))}
    </ul>
  );
}

/**
 * Overflow menu built on a native <details> disclosure: the summary is the toggle
 * (announced as expanded/collapsed), the items are plain buttons in tab order.
 * Only actions the server accepts for the row's current state are listed.
 */
function RowActions({
  reservation,
  now,
  onAction,
  onPayment,
}: {
  reservation: VenueReservation;
  now: number;
  onAction: (kind: OwnerActionKind) => void;
  onPayment: () => void;
}) {
  const started = new Date(reservation.startAt).getTime() <= now;
  const status = reservation.status;
  const items: Array<{ key: string; label: string; run: () => void; destructive?: boolean }> = [];
  if (PAYABLE_STATUSES.has(status)) {
    items.push({ key: 'pay', label: 'Registrar pago', run: onPayment });
  } else if (reservation.paidMinor > 0) {
    items.push({ key: 'refund', label: 'Registrar devolución', run: onPayment });
  }
  if (status === 'confirmed' && started) {
    items.push({ key: 'complete', label: 'Marcar completada', run: () => onAction('complete') });
    items.push({
      key: 'no_show',
      label: 'Marcar no asistió',
      run: () => onAction('no_show'),
      destructive: true,
    });
  }
  if (status === 'pending_confirmation' || status === 'confirmed') {
    items.push({
      key: 'cancel',
      label: 'Cancelar reserva',
      run: () => onAction('cancel'),
      destructive: true,
    });
  }
  if (items.length === 0) return null;

  function choose(event: MouseEvent<HTMLButtonElement>, run: () => void) {
    const menu = event.currentTarget.closest('details');
    if (menu) {
      menu.open = false;
      // The dialog returns focus to whatever had it; the item itself is hidden by then.
      menu.querySelector('summary')?.focus();
    }
    run();
  }

  return (
    <details
      name="acciones-reserva"
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        event.currentTarget.open = false;
        event.currentTarget.querySelector('summary')?.focus();
      }}
      className="group relative justify-self-start sm:justify-self-end"
    >
      <summary
        aria-label={`Acciones para la reserva de ${customerLabel(reservation)}`}
        className="flex min-h-11 cursor-pointer list-none items-center gap-xs rounded-[var(--radius-md)] border border-border-strong px-3 text-sm font-bold text-text hover:border-action-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary/40 [&::-webkit-details-marker]:hidden"
      >
        Acciones
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </summary>
      <ul className="absolute right-0 z-10 m-0 mt-xs grid min-w-[208px] list-none gap-[2px] rounded-[var(--radius-md)] border border-border-strong bg-surface p-xs shadow-panel-strong max-sm:left-0 max-sm:right-auto">
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={(event) => choose(event, item.run)}
              className={cx(
                'flex min-h-11 w-full cursor-pointer items-center rounded-[var(--radius-sm)] border-0 bg-transparent px-3 text-left text-md hover:bg-action-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary/40',
                item.destructive ? 'text-destructive' : 'text-text',
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

function PaymentDialog({
  dialogRef,
  venueId,
  reservation,
  timeZone,
  onRecorded,
  onClosed,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  venueId: string | null;
  reservation: VenueReservation | null;
  timeZone: string;
  onRecorded: (message: string, reservation: VenueReservation, confirmed: boolean) => void;
  onClosed: () => void;
}) {
  const mutation = useRecordReservationPaymentMutation(venueId);
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="pago-title"
      onCancel={(event) => {
        if (mutation.isPending) event.preventDefault();
      }}
      onClose={onClosed}
      className="m-auto w-[min(92vw,480px)] rounded-[var(--radius-lg)] border border-border-strong bg-surface p-lg text-text shadow-panel-strong backdrop:bg-brand-dark/50"
    >
      {reservation ? (
        <PaymentForm
          key={reservation.id}
          reservation={reservation}
          timeZone={timeZone}
          isPending={mutation.isPending}
          onCancel={() => dialogRef.current?.close()}
          onSubmit={async (input) => {
            const updated = await mutation.mutateAsync({ reservationId: reservation.id, input });
            const confirmed =
              reservation.status === 'pending_confirmation' && updated.status === 'confirmed';
            const amount = formatMoneyMinor(input.amountMinor, reservation.currency);
            const kindLabel =
              PAYMENT_KIND_OPTIONS.find((option) => option.value === input.kind)?.label ?? 'Pago';
            dialogRef.current?.close();
            onRecorded(
              confirmed
                ? `Registraste ${kindLabel.toLowerCase()} de ${amount}. La reserva de ${customerLabel(reservation)} quedó confirmada.`
                : `Registraste ${kindLabel.toLowerCase()} de ${amount} para ${customerLabel(reservation)}.`,
              reservation,
              confirmed,
            );
          }}
        />
      ) : null}
    </dialog>
  );
}

function PaymentForm({
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
  const [kind, setKind] = useState<ReservationPaymentKind>(defaultKind);
  const [method, setMethod] = useState<ReservationPaymentMethod>('transfer');
  const [amount, setAmount] = useState(defaultAmount > 0 ? formatAmountInput(defaultAmount) : '');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const preview = parseAmount(amount);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!preview || preview <= 0) {
      setError('Escribe un monto mayor que cero, p. ej. 30.000.');
      return;
    }
    if (kind === 'refund' && preview > reservation.paidMinor) {
      setError('La devolución supera lo que el jugador ha pagado.');
      return;
    }
    try {
      await onSubmit({
        kind,
        method,
        amountMinor: preview,
        ...(note.trim() ? { note: note.trim() } : {}),
      });
    } catch (caught) {
      setError(describeError(caught, 'No se pudo registrar el pago.'));
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="grid gap-md">
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
        <SelectField
          label="Concepto"
          name="kind"
          value={kind}
          onChangeValue={(value) => {
            const next = value as ReservationPaymentKind;
            setKind(next);
            setAmount(dueByKind[next] > 0 ? formatAmountInput(dueByKind[next]) : '');
          }}
          options={kindOptions}
        />
        <SelectField
          label="Medio"
          name="method"
          value={method}
          onChangeValue={(value) => setMethod(value as ReservationPaymentMethod)}
          options={PAYMENT_METHOD_OPTIONS}
        />
      </div>
      <HintedInput
        name="amount"
        label={`Monto (${reservation.currency})`}
        inputMode="decimal"
        autoComplete="off"
        required
        value={amount}
        onChangeText={setAmount}
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
      <AppInput
        name="note"
        label="Nota (opcional)"
        placeholder="Ej.: comprobante Nequi 4821"
        maxLength={300}
        autoComplete="off"
        value={note}
        onChangeText={setNote}
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

function VenueSettingsForm({ venue }: { venue: OwnerVenue }) {
  const mutation = useUpdateVenueSettingsMutation(venue.id);
  const [phone, setPhone] = useState(venue.contactPhone ?? '');
  const [instructions, setInstructions] = useState(venue.paymentInstructions ?? '');
  const [deposit, setDeposit] = useState(String(venue.depositPercent));
  const [hold, setHold] = useState(String(venue.holdMinutes));
  const [cancelWindow, setCancelWindow] = useState(String(venue.cancellationWindowHours));
  const [horizon, setHorizon] = useState(String(venue.bookingHorizonDays));
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const depositValue = parseIntInRange(deposit, 0, 100);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);
    const next: Partial<Record<string, string>> = {};
    const normalizedPhone = normalizePhone(phone, venue.countryCode);
    if (normalizedPhone && !E164_PATTERN.test(normalizedPhone)) {
      next.phone = 'Escribe el número con indicativo, p. ej. +57 300 123 4567.';
    }
    if (!normalizedPhone && venue.contactPhone) {
      next.phone = 'Deja un teléfono: los jugadores lo usan para pagar o avisar.';
    }
    const parsedDeposit = parseIntInRange(deposit, 0, 100);
    if (parsedDeposit === null) next.deposit = 'Usa un número entero entre 0 y 100.';
    const parsedHold = parseIntInRange(hold, 5, 1440);
    if (parsedHold === null) next.hold = 'Usa entre 5 y 1440 minutos (24 h).';
    const parsedWindow = parseIntInRange(cancelWindow, 0, 168);
    if (parsedWindow === null) next.cancelWindow = 'Usa entre 0 y 168 horas (7 días).';
    const parsedHorizon = parseIntInRange(horizon, 1, 180);
    if (parsedHorizon === null) next.horizon = 'Usa entre 1 y 180 días.';
    setErrors(next);
    if (
      Object.keys(next).length > 0 ||
      parsedDeposit === null ||
      parsedHold === null ||
      parsedWindow === null ||
      parsedHorizon === null
    ) {
      setFormError('Revisa los campos marcados.');
      return;
    }
    try {
      await mutation.mutateAsync({
        ...(normalizedPhone ? { contactPhone: normalizedPhone } : {}),
        paymentInstructions: instructions.trim(),
        depositPercent: parsedDeposit,
        holdMinutes: parsedHold,
        cancellationWindowHours: parsedWindow,
        bookingHorizonDays: parsedHorizon,
      });
      if (normalizedPhone) setPhone(normalizedPhone);
      setNotice('Guardaste los ajustes. Las próximas reservas ya usan estas reglas.');
    } catch (caught) {
      setFormError(describeError(caught, 'No se pudieron guardar los ajustes.'));
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="ajustes-title"
      noValidate
      className="grid gap-md"
    >
      <div className="grid gap-xs">
        <h3 id="ajustes-title" className="m-0 font-arvo text-md text-text">
          Ajustes del complejo
        </h3>
        <p className="m-0 max-w-[var(--container-measure)] text-sm leading-[18px] text-muted">
          Reglas que ven los jugadores al reservar en {venue.name}.
        </p>
      </div>
      <div className="grid gap-md md:grid-cols-2">
        <HintedInput
          type="tel"
          name="contactPhone"
          label="Teléfono o WhatsApp de contacto"
          autoComplete="tel"
          inputMode="tel"
          spellCheck={false}
          placeholder="+57 300 123 4567"
          errorMessage={errors.phone ?? null}
          value={phone}
          onChangeText={setPhone}
          hint="Aparece en las reservas pendientes para que el jugador pague o avise."
        />
        <TextAreaField
          label="Instrucciones de pago"
          name="paymentInstructions"
          value={instructions}
          onChangeValue={setInstructions}
          maxLength={500}
          placeholder="Ej.: Llave Bre-B @micancha · Nequi 300 123 4567"
          hint="El jugador las ve mientras su reserva espera el anticipo."
        />
        <HintedInput
          type="number"
          name="depositPercent"
          label="Anticipo (% del precio)"
          inputMode="numeric"
          min={0}
          max={100}
          step={1}
          errorMessage={errors.deposit ?? null}
          value={deposit}
          onChangeText={setDeposit}
          hint={
            depositValue === 0
              ? 'Con 0 %, cada reserva se confirma al instante, sin pasar por ti.'
              : 'La reserva queda pendiente hasta que registres el anticipo o la confirmes.'
          }
        />
        <HintedInput
          type="number"
          name="holdMinutes"
          label="Minutos para pagar el anticipo"
          inputMode="numeric"
          min={5}
          max={1440}
          step={5}
          errorMessage={errors.hold ?? null}
          value={hold}
          onChangeText={setHold}
          hint="El turno queda apartado este tiempo. Si vence sin anticipo, el horario se libera."
        />
        <HintedInput
          type="number"
          name="cancellationWindowHours"
          label="Cancelación en línea (horas antes)"
          inputMode="numeric"
          min={0}
          max={168}
          step={1}
          errorMessage={errors.cancelWindow ?? null}
          value={cancelWindow}
          onChangeText={setCancelWindow}
          hint="Hasta cuántas horas antes del turno el jugador puede cancelar sin escribirte."
        />
        <HintedInput
          type="number"
          name="bookingHorizonDays"
          label="Reservas con anticipación (días)"
          inputMode="numeric"
          min={1}
          max={180}
          step={1}
          errorMessage={errors.horizon ?? null}
          value={horizon}
          onChangeText={setHorizon}
          hint="Hasta cuántos días adelante pueden reservar los jugadores."
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar ajustes'}
        </AppButton>
      </div>
      <InlineError message={formError} />
      <InlineStatus message={notice} />
    </form>
  );
}

/** One pitch picker drives price, weekly hours and slot length, each saved on its own. */
function PitchConfig({
  venueId,
  currency,
  pitches,
  selectedId,
  onSelect,
  isLoading,
  error,
  onRetry,
}: {
  venueId: string;
  currency: string;
  pitches: PitchWithPricing[];
  selectedId: string | null;
  onSelect: (pitchId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const pitch = pitches.find((item) => item.id === selectedId) ?? pitches[0] ?? null;

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
  if (!pitch) {
    return (
      <p id="horarios-title" className="m-0 text-md leading-[1.5] text-muted">
        Agrega una cancha para definir su precio y sus horarios.
      </p>
    );
  }

  return (
    <div className="grid gap-lg">
      {pitches.length > 1 ? (
        <div className="max-w-[var(--container-form)]">
          <SelectField
            label="Cancha a configurar"
            name="pitch"
            value={pitch.id}
            onChangeValue={onSelect}
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
      <PitchPriceForm
        key={`precio-${pitch.id}`}
        venueId={venueId}
        currency={currency}
        pitch={pitch}
      />
      <OpeningHoursForm key={`horas-${pitch.id}`} venueId={venueId} pitch={pitch} />
      <SlotDurationForm key={`turno-${pitch.id}`} venueId={venueId} pitch={pitch} />
    </div>
  );
}

function PitchPriceForm({
  venueId,
  currency,
  pitch,
}: {
  venueId: string;
  currency: string;
  pitch: PitchWithPricing;
}) {
  const mutation = useConfigurePitchPricingMutation(pitch.id, venueId);
  const [amount, setAmount] = useState(
    pitch.basePriceMinor > 0 ? formatAmountInput(pitch.basePriceMinor) : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const preview = parseAmount(amount);
  const ruleCount = pitch.priceRules.length;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const basePriceMinor = amount.trim() ? preview : 0;
    if (basePriceMinor === null) {
      setError('Escribe un precio válido, p. ej. 120.000 (máximo 21.474.836).');
      return;
    }
    try {
      // The endpoint replaces base price and rules together; carry the rules over.
      await mutation.mutateAsync({
        basePriceMinor,
        rules: pitch.priceRules.map((rule) => ({
          daysOfWeek: rule.daysOfWeek,
          startTime: rule.startTime,
          endTime: rule.endTime,
          priceMinor: rule.priceMinor,
        })),
      });
      setNotice(
        basePriceMinor > 0
          ? `${pitch.name} cuesta ${formatMoneyMinor(basePriceMinor, currency)} por turno.`
          : ruleCount > 0
            ? `${pitch.name} quedó sin precio base: fuera de las tarifas por horario, los jugadores verán “Precio a confirmar con el complejo”.`
            : `${pitch.name} quedó sin precio: los jugadores verán “Precio a confirmar con el complejo”.`,
      );
    } catch (caught) {
      setError(describeError(caught, 'No se pudo guardar el precio.'));
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="precio-title"
      className="grid gap-sm"
    >
      <h3 id="precio-title" className="m-0 font-arvo text-md text-text">
        Precio por turno
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <HintedInput
          name="basePrice"
          label={`Precio de un turno de ${formatDuration(pitch.slotDurationMinutes)} (${currency})`}
          inputMode="decimal"
          autoComplete="off"
          placeholder="120.000"
          value={amount}
          onChangeText={setAmount}
          hint={
            preview
              ? `Los jugadores verán ${formatMoneyMinor(preview, currency)}. El anticipo se calcula sobre este valor.`
              : 'Sin precio, los jugadores ven “Precio a confirmar con el complejo” y la reserva se confirma sin anticipo.'
          }
        />
      </div>
      {ruleCount > 0 ? (
        <p className="m-0 text-sm leading-[18px] text-muted">
          Esta cancha tiene {ruleCount === 1 ? '1 tarifa' : `${ruleCount} tarifas`} por horario
          (hora pico). Se conservan al guardar.
        </p>
      ) : null}
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar precio'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
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
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="crear-complejo-title"
      className="grid gap-sm"
    >
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
      setNotice(`Agregaste “${created.name}”. Define su precio y sus horarios arriba.`);
    } catch (caught) {
      setError(describeError(caught, 'No se pudo crear la cancha.'));
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="crear-cancha-title"
      className="grid gap-sm"
    >
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

/** Current week as the slots endpoint expects it (it replaces the whole week). */
function weekPayload(openingHours: PitchWithPricing['openingHours']) {
  return Object.entries(openingHours ?? {})
    .filter(([, hours]) => hours.openTime && hours.closeTime)
    .map(([day, hours]) => ({
      dayOfWeek: Number(day),
      openTime: hours.openTime as string,
      closeTime: hours.closeTime as string,
    }));
}

function SlotDurationForm({ venueId, pitch }: { venueId: string; pitch: PitchWithPricing }) {
  const mutation = useConfigurePitchSlotsMutation(pitch.id, venueId);
  const [duration, setDuration] = useState(String(pitch.slotDurationMinutes));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const parsed = parseIntInRange(duration, 30, 240);
    if (parsed === null) {
      setError('La duración del turno debe estar entre 30 y 240 minutos.');
      return;
    }
    if (parsed === pitch.slotDurationMinutes) {
      setNotice('La duración ya era esa. No hubo cambios.');
      return;
    }
    try {
      await mutation.mutateAsync({
        openingHours: weekPayload(pitch.openingHours),
        slotDurationMinutes: parsed,
      });
      setNotice(`Los turnos de ${pitch.name} ahora duran ${formatDuration(parsed)}.`);
    } catch (caught) {
      setError(describeError(caught, 'No se pudo guardar la duración del turno.'));
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="duracion-title"
      className="grid gap-sm"
    >
      <h3 id="duracion-title" className="m-0 font-arvo text-md text-text">
        Duración del turno
      </h3>
      <div className="grid gap-sm md:grid-cols-2">
        <HintedInput
          type="number"
          name="slotDurationMinutes"
          label="Minutos por turno"
          inputMode="numeric"
          min={30}
          max={240}
          step={15}
          required
          value={duration}
          onChangeText={setDuration}
          hint="Cada reserva dura esto. Las reservas ya hechas conservan su horario."
        />
      </div>
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar duración'}
        </AppButton>
      </div>
      <InlineError message={error} />
      <InlineStatus message={notice} />
    </form>
  );
}

function OpeningHoursForm({ venueId, pitch }: { venueId: string; pitch: PitchWithPricing }) {
  const configureMutation = useConfigurePitchSlotsMutation(pitch.id, venueId);
  const [days, setDays] = useState<number[]>([]);
  const [mode, setMode] = useState<'open' | 'closed'>('open');
  const closeDialogRef = useRef<HTMLDialogElement | null>(null);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const currentHours = pitch.openingHours ?? {};

  function toggleDay(day: number, checked: boolean) {
    setDays((current) =>
      checked ? [...new Set([...current, day])] : current.filter((value) => value !== day),
    );
  }

  const dayNames = (values: number[]) =>
    WEEKDAYS.filter((day) => values.includes(day.value))
      .map((day) => day.label.toLowerCase())
      .join(', ');
  // Days in the selection that are open today and would become closed.
  const closingDays = days.filter((day) => {
    const hours = currentHours[String(day)];
    return Boolean(hours?.openTime && hours.closeTime);
  });

  async function save() {
    // The endpoint replaces the whole week, so carry over days not being edited.
    // Days marked "Cerrado" are simply left out of the payload.
    const keptDays = weekPayload(currentHours).filter((item) => !days.includes(item.dayOfWeek));
    const editedDays =
      mode === 'open' ? days.map((dayOfWeek) => ({ dayOfWeek, openTime, closeTime })) : [];

    try {
      // Slot length has its own form; omitted, the server keeps the stored value.
      await configureMutation.mutateAsync({ openingHours: [...keptDays, ...editedDays] });
      const names = dayNames(days);
      setNotice(
        mode === 'open'
          ? `Guardaste ${openTime}–${closeTime} para ${names} en ${pitch.name}.`
          : `Días cerrados en ${pitch.name}: ${names}. Los jugadores ya no verán turnos esos días.`,
      );
      setDays([]);
      closeDialogRef.current?.close();
    } catch (caught) {
      setError(describeError(caught, 'No se pudieron guardar los horarios.'));
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (days.length === 0) {
      setError('Elige al menos un día.');
      return;
    }
    if (mode === 'open' && closeTime <= openTime && closeTime !== '00:00') {
      setError('La hora de cierre debe ser posterior a la de apertura.');
      return;
    }

    if (mode === 'closed') {
      if (closingDays.length === 0) {
        setNotice(
          days.length === 1
            ? `El ${dayNames(days)} ya estaba cerrado. No hubo cambios.`
            : `Esos días ya estaban cerrados. No hubo cambios.`,
        );
        return;
      }
      closeDialogRef.current?.showModal();
      return;
    }
    void save();
  }

  return (
    <form onSubmit={onSubmit} aria-labelledby="horarios-title" className="grid gap-md">
      <h3 id="horarios-title" className="m-0 font-arvo text-md text-text">
        Horarios de apertura
      </h3>
      <div className="grid gap-md md:grid-cols-2">
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
            <div className="flex flex-wrap gap-md">
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
          <fieldset className="m-0 grid gap-sm border-0 p-0">
            <legend className="mb-xs p-0 text-sm leading-[1.5] text-muted">
              Cada día elegido queda
            </legend>
            <div className="flex flex-wrap gap-sm">
              {(
                [
                  ['open', 'Abierto'],
                  ['closed', 'Cerrado'],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-11 cursor-pointer items-center gap-xs rounded-[var(--radius-md)] border border-border-strong px-3 text-md text-text has-[:checked]:border-action-primary has-[:checked]:bg-action-primary-soft"
                >
                  <input
                    type="radio"
                    name="hoursMode"
                    value={value}
                    checked={mode === value}
                    onChange={() => setMode(value)}
                    className="h-4 w-4 accent-[var(--color-action-primary)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className={cx('grid grid-cols-2 gap-sm', mode === 'closed' && 'hidden')}>
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
          <AppButton type="submit" disabled={configureMutation.isPending}>
            {configureMutation.isPending
              ? 'Guardando…'
              : mode === 'closed'
                ? 'Marcar como cerrado'
                : 'Guardar horarios'}
          </AppButton>
          <InlineError message={error} />
          <InlineStatus message={notice} />
        </div>
      </div>
      <ConfirmDialog
        dialogRef={closeDialogRef}
        title="¿Cerrar estos días?"
        confirmLabel="Sí, cerrar"
        pendingLabel="Guardando…"
        dismissLabel="Volver"
        isPending={configureMutation.isPending}
        error={error}
        onConfirm={() => void save()}
        onClosed={() => undefined}
      >
        <p className="m-0 text-text">
          {pitch.name} dejará de abrir {dayNames(closingDays)}.
        </p>
        <p className="m-0">
          Los jugadores ya no podrán reservar esos días. Las reservas ya hechas no se cancelan.
        </p>
      </ConfirmDialog>
    </form>
  );
}
