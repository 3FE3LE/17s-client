'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, type MouseEvent, type RefObject } from 'react';
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
import { asDepositPolicy, DEPOSIT_OUTCOME_LABEL, DEPOSIT_POLICY_LABEL } from '@/lib/deposit-policy';
import { CustomerHistoryNote } from '@/components/customer-history-note';
import { PitchPolicyForm } from '@/components/pitch-policy-form';
import { PitchPriceRules } from '@/components/pitch-price-rules';
import { IntegrationNotice } from '@/components/integration-notice';
import { OwnerBalances } from '@/components/owner-balances';
import { OwnerReservationSection } from '@/components/owner-reservation-form';
import { CreateVenueForm, VENUE_NAME_INPUT_ID } from '@/components/create-venue-form';
import { OpeningHoursForm } from '@/components/opening-hours-form';
import { PaymentForm } from '@/components/payment-form';
import { PitchPriceForm } from '@/components/pitch-price-form';
import { SlotDurationForm } from '@/components/slot-duration-form';
import { VenueSettingsForm } from '@/components/venue-settings-form';
import { PitchBlocksSection } from '@/components/pitch-blocks';
import { customerLabel, PAYABLE_STATUSES } from '@/lib/owner-reservation-view';
import { CreatePitchForm } from '@/components/create-pitch-form';
import { PublishVenueForm } from '@/components/publish-venue-form';
import { VenueIdentityForm } from '@/components/venue-identity-form';
import {
  ConfirmDialog,
  HintedInput,
  InlineError,
  InlineStatus,
  ListSkeleton,
  RefreshControl,
  SectionHeader,
  SelectField,
} from '@/components/seven-rc-ui';
import { describeError } from '@/lib/seven-rc-errors';
import {
  addDaysToDateKey,
  dateKeyInTimeZone,
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
  useConfirmVenueReservationMutation,
  useIntegrationsQuery,
  useMarkNoShowMutation,
  useCancelReservationSeriesMutation,
  useOwnerCancelReservationMutation,
  useOwnerVenuePitchesQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
  useRecordReservationPaymentMutation,
  useRejectVenueReservationMutation,
  type OwnerVenue,
  type PitchWithPricing,
  type ReservationPaymentMethod,
  type VenueReservation,
} from '@/lib/owner-queries';
import { PAYMENT_KIND_OPTIONS, PAYMENT_METHOD_OPTIONS } from '@/lib/owner-payment';
import { useNow } from '@/lib/use-now';

const DEFAULT_RANGE_DAYS = 7;
const DEFAULT_HORIZON_DAYS = 30;
const PENDING_POLL_MS = 30_000;
const SETTLED_ROW_MS = 2_500;
const PENDING_HEADING_ID = 'pendientes-title';
const TODAY_HEADING_ID = 'hoy-title';
const INACTIVE_STATUSES = new Set(['cancelled', 'rejected', 'expired']);

type SettledOutcome = 'confirmed' | 'rejected';
type OwnerActionKind = 'confirm' | 'reject' | 'complete' | 'no_show' | 'cancel' | 'cancel_series';
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
  cancel_series: {
    title: '¿Cancelar toda la serie semanal?',
    confirmLabel: 'Sí, cancelar serie',
    pendingLabel: 'Cancelando…',
    dismissLabel: 'Conservar serie',
    tone: 'destructive',
    body: 'Se cancelan las reservas futuras de esta cancha fija. Las ya jugadas quedan en el historial. No se puede deshacer.',
    done: (name) => `Cancelaste las reservas futuras de la serie de ${name}.`,
    fallback: 'No se pudo cancelar la serie.',
  },
};

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

function holdExpired(reservation: VenueReservation, now: number): boolean {
  return Boolean(reservation.holdExpiresAt && new Date(reservation.holdExpiresAt).getTime() <= now);
}

/** Focus target for content that replaces what the owner was using. */
function focusOnMount(node: HTMLElement | null) {
  node?.focus();
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
  const integrationsQuery = useIntegrationsQuery();
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
    cancel_series: useCancelReservationSeriesMutation(venueId),
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
  // Paid reservations: the server requires a refund decision before cancelling.
  const [refundDecision, setRefundDecision] = useState<'' | 'refund' | 'none_due'>('');
  const [refundMethod, setRefundMethod] = useState<ReservationPaymentMethod>('cash');
  const [refundNote, setRefundNote] = useState('');
  // No-show on a paid reservation: what the owner did with the deposit.
  const [noShowOutcome, setNoShowOutcome] = useState<'' | 'refunded' | 'retained'>('');

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
      setRefundDecision('');
      setRefundNote('');
      setNoShowOutcome(defaultNoShowOutcome(kind, reservation));
      setNotice(null);
    });
    actionDialogRef.current?.showModal();
  }

  async function runAction() {
    if (!action) return;
    const { kind, reservation, area } = action;
    setActionError(null);
    try {
      if (kind === 'cancel_series') {
        if (!reservation.seriesId) throw new Error('La reserva no pertenece a una serie.');
        await mutations.cancel_series.mutateAsync(reservation.seriesId);
      } else if (kind === 'cancel') {
        const paid = reservation.paidMinor > 0;
        if (paid && !refundDecision) {
          setActionError('Indica si devuelves el dinero o si no corresponde devolución.');
          return;
        }
        if (paid && refundDecision === 'none_due' && !refundNote.trim()) {
          setActionError('Anota por qué no corresponde devolución.');
          return;
        }
        await mutations.cancel.mutateAsync({
          reservationId: reservation.id,
          input: paid
            ? refundDecision === 'refund'
              ? { refundDecision, method: refundMethod }
              : { refundDecision: 'none_due', note: refundNote.trim() }
            : undefined,
        });
      } else if (kind === 'no_show') {
        const paid = reservation.paidMinor > 0;
        if (paid && !noShowOutcome) {
          setActionError('Indica si devolviste o conservaste el anticipo.');
          return;
        }
        await mutations.no_show.mutateAsync({
          reservationId: reservation.id,
          ...(paid ? { input: { depositOutcome: noShowOutcome as 'refunded' | 'retained' } } : {}),
        });
      } else {
        await mutations[kind].mutateAsync(reservation.id);
      }
      setNotice({ area, message: ACTION_COPY[kind].done(customerLabel(reservation)) });
      // Close first: the dialog returns focus to its opener, which settleRow then moves.
      actionDialogRef.current?.close();
      if (kind === 'confirm') settleRow(reservation, 'confirmed');
      if (kind === 'reject') settleRow(reservation, 'rejected');
      // These remove the row or its menu, so focus moves to where the result is announced.
      if (kind === 'cancel' || kind === 'cancel_series' || kind === 'no_show')
        focusById(TODAY_HEADING_ID);
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

      {selectedVenue ? (
        <p className="m-0">
          <Link href="/owner/reports" className="text-text underline">
            Ver reportes de ingresos y ocupación
          </Link>
          {' · '}
          <Link href="/owner/customers" className="text-text underline">
            Ver clientes
          </Link>
        </p>
      ) : null}

      {setupIncomplete ? <SetupChecklist items={setupItems} onGo={goToSetup} /> : null}

      <IntegrationNotice items={integrationsQuery.data ?? []} />

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

          <OwnerBalances
            key={selectedVenue.id}
            venueId={selectedVenue.id}
            timeZone={timeZone}
            todayKey={todayKey}
            onRecordPayment={(reservation) => openPayment(reservation, 'agenda')}
          />
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
        <OwnerReservationSection
          key={`reserva-${selectedVenue.id}`}
          venue={selectedVenue}
          pitches={pitches}
          timeZone={timeZone}
          todayKey={todayKey}
        />
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
              <VenueIdentityForm key={`identity-${selectedVenue.id}`} venue={selectedVenue} />
              <VenueSettingsForm key={selectedVenue.id} venue={selectedVenue} />
              <PublishVenueForm
                key={`publish-${selectedVenue.id}`}
                venue={selectedVenue}
                missing={publishMissing}
              />
              <PitchConfig
                venueId={selectedVenue.id}
                venue={selectedVenue}
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
            {action.kind === 'confirm' || action.kind === 'no_show' || action.kind === 'cancel' ? (
              <CustomerHistoryNote venueId={venueId} phone={action.reservation.customerPhone} />
            ) : null}
            {action.kind === 'no_show' && action.reservation.paidMinor > 0 ? (
              <div className="grid gap-sm">
                <p className="m-0 text-text">
                  Esta reserva tiene{' '}
                  {formatMoneyMinor(action.reservation.paidMinor, action.reservation.currency)}{' '}
                  pagados. Solo queda anotado lo que decidas: la plataforma no mueve dinero.
                </p>
                <SelectField
                  label="Anticipo"
                  name="noShowOutcome"
                  value={noShowOutcome}
                  onChangeValue={(value) =>
                    setNoShowOutcome(value === 'refunded' || value === 'retained' ? value : '')
                  }
                  options={[
                    { value: '', label: 'Elige una opción' },
                    { value: 'retained', label: DEPOSIT_OUTCOME_LABEL.retained },
                    { value: 'refunded', label: DEPOSIT_OUTCOME_LABEL.refunded },
                  ]}
                  hint={`Política con que reservó: ${DEPOSIT_POLICY_LABEL[
                    asDepositPolicy(action.reservation.policySnapshot.noShowDeposit)
                  ].toLowerCase()}.`}
                />
              </div>
            ) : null}
            {action.kind === 'reject' && action.reservation.paidMinor > 0 ? (
              <p className="m-0 text-text">
                Registraste pagos por{' '}
                {formatMoneyMinor(action.reservation.paidMinor, action.reservation.currency)}. Si
                los vas a devolver, anota la devolución con “Registrar anticipo” antes de continuar:
                después la reserva sale de la agenda.
              </p>
            ) : null}
            {action.kind === 'cancel' && action.reservation.paidMinor > 0 ? (
              <div className="grid gap-sm">
                <p className="m-0 text-text">
                  Esta reserva tiene{' '}
                  {formatMoneyMinor(action.reservation.paidMinor, action.reservation.currency)}{' '}
                  pagados. Antes de cancelar, indica qué pasa con ese dinero.
                </p>
                <SelectField
                  label="Dinero pagado"
                  name="refundDecision"
                  value={refundDecision}
                  onChangeValue={(value) => setRefundDecision(value as '' | 'refund' | 'none_due')}
                  options={[
                    { value: '', label: 'Elige una opción' },
                    { value: 'refund', label: 'Lo devuelvo todo' },
                    { value: 'none_due', label: 'No corresponde devolución' },
                  ]}
                />
                {refundDecision === 'refund' ? (
                  <SelectField
                    label="Medio de la devolución"
                    name="refundMethod"
                    value={refundMethod}
                    onChangeValue={(value) => setRefundMethod(value as ReservationPaymentMethod)}
                    options={PAYMENT_METHOD_OPTIONS}
                  />
                ) : null}
                {refundDecision === 'none_due' ? (
                  <HintedInput
                    name="refundNote"
                    label="Motivo"
                    autoComplete="off"
                    required
                    maxLength={300}
                    value={refundNote}
                    onChangeText={setRefundNote}
                    hint="Queda anotado en la reserva."
                  />
                ) : null}
              </div>
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
    if (reservation.seriesId) {
      items.push({
        key: 'cancel_series',
        label: 'Cancelar toda la serie',
        run: () => onAction('cancel_series'),
        destructive: true,
      });
    }
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

/** The booked policy preselects the outcome; owner-decides leaves it empty so it is a conscious choice. */
function defaultNoShowOutcome(
  kind: OwnerActionKind,
  reservation: VenueReservation,
): '' | 'refunded' | 'retained' {
  if (kind !== 'no_show') return '';
  const policy = reservation.policySnapshot.noShowDeposit;
  return policy === 'refund' ? 'refunded' : policy === 'retain' ? 'retained' : '';
}

/** One pitch picker drives price, weekly hours and slot length, each saved on its own. */
function PitchConfig({
  venueId,
  venue,
  currency,
  pitches,
  selectedId,
  onSelect,
  isLoading,
  error,
  onRetry,
}: {
  venueId: string;
  venue: OwnerVenue;
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
      <PitchPriceRules
        key={`tarifas-${pitch.id}-${JSON.stringify(pitch.priceRules)}-${pitch.basePriceMinor}`}
        venueId={venueId}
        currency={currency}
        pitch={pitch}
      />
      <PitchPolicyForm
        key={`condiciones-${pitch.id}-${pitch.depositPercent}-${pitch.holdMinutes}-${pitch.cancellationWindowHours}-${pitch.paymentInstructions}-${pitch.lateCancelDeposit}-${pitch.noShowDeposit}-${pitch.conditionsText}`}
        venueId={venueId}
        venue={venue}
        pitch={pitch}
      />
      <OpeningHoursForm key={`horas-${pitch.id}`} venueId={venueId} pitch={pitch} />
      <SlotDurationForm key={`turno-${pitch.id}`} venueId={venueId} pitch={pitch} />
    </div>
  );
}
