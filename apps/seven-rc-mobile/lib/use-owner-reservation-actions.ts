import { useState } from 'react';
import { confirmAction, confirmDestructive } from './confirm';
import { humanizeError } from './error-messages';
import { feedback } from './feedback';
import {
  useCompleteReservationMutation,
  useConfirmVenueReservationMutation,
  useMarkNoShowMutation,
  useOwnerCancelReservationMutation,
  useRecordReservationPaymentMutation,
  useRejectVenueReservationMutation,
  type RecordReservationPaymentInput,
  type ReservationPaymentKind,
  type VenueReservation,
} from './owner-queries';
import { displayStatus, formatMoney, formatVenueRange } from './reservation-format';

export type OwnerAgendaAction = 'complete' | 'no_show' | 'cancel';
export type OwnerReservationAction = 'confirm' | 'reject' | OwnerAgendaAction | 'payment';

/** Payment kinds the server accepts for this reservation right now. */
export function paymentKindsFor(
  reservation: VenueReservation,
  now: number,
): ReservationPaymentKind[] {
  const status = displayStatus(reservation, now);
  const kinds: ReservationPaymentKind[] =
    status === 'pending_confirmation' || status === 'confirmed' || status === 'completed'
      ? ['deposit', 'balance']
      : [];
  // Money already received can always be returned, also after a cancellation.
  if (reservation.paidMinor > 0) kinds.push('refund');
  return kinds;
}

/**
 * Status changes the server accepts. A pending request is closed with Rechazar,
 * so Cancelar is only for confirmed ones; completed and no-show need a started slot.
 */
export function agendaActionsFor(reservation: VenueReservation, now: number): OwnerAgendaAction[] {
  if (reservation.status !== 'confirmed') return [];
  return new Date(reservation.startAt).getTime() <= now
    ? ['complete', 'no_show', 'cancel']
    : ['cancel'];
}

export const AGENDA_ACTION_LABELS: Record<OwnerAgendaAction, string> = {
  complete: 'Completada',
  no_show: 'No asistió',
  cancel: 'Cancelar reserva',
};

export function reservationPlayerName(reservation: VenueReservation): string | null {
  return reservation.user?.name?.trim() || reservation.customerName?.trim() || null;
}

/**
 * Owner actions on a reservation, each behind a native confirm: none can be
 * undone from the app (there is no "un-confirm"). Also holds which reservation
 * has its action sheet open, so a poll that moves the card between sections
 * does not close the sheet mid-edit.
 */
export function useOwnerReservationActions() {
  const confirmMutation = useConfirmVenueReservationMutation();
  const rejectMutation = useRejectVenueReservationMutation();
  const paymentMutation = useRecordReservationPaymentMutation();
  const completeMutation = useCompleteReservationMutation();
  const noShowMutation = useMarkNoShowMutation();
  const cancelMutation = useOwnerCancelReservationMutation();
  const [sheet, setSheet] = useState<{
    reservation: VenueReservation;
    timeZone: string | null;
  } | null>(null);
  const [busy, setBusy] = useState<{ id: string; action: OwnerReservationAction } | null>(null);

  const run = async (reservation: VenueReservation, action: 'confirm' | 'reject') => {
    const input = { reservationId: reservation.id, venueId: reservation.venueId };
    setBusy({ id: reservation.id, action });
    try {
      if (action === 'confirm') {
        await confirmMutation.mutateAsync(input);
        feedback.success('Reserva confirmada', 'El jugador ya ve su reserva como confirmada.');
      } else {
        await rejectMutation.mutateAsync(input);
        feedback.success('Reserva rechazada', 'El horario quedó libre para otros jugadores.');
      }
    } catch (error) {
      feedback.error(
        action === 'confirm' ? 'No se pudo confirmar' : 'No se pudo rechazar',
        humanizeError(error, action),
      );
    } finally {
      setBusy(null);
    }
  };

  const describe = (reservation: VenueReservation, timeZone?: string | null) =>
    `${reservation.pitch?.name ?? 'Cancha'} · ${formatVenueRange(
      reservation.startAt,
      reservation.endAt,
      timeZone,
    )}`;

  const askConfirm = (reservation: VenueReservation, timeZone?: string | null) => {
    const who = reservationPlayerName(reservation) ?? 'El jugador';
    confirmAction(
      {
        title: '¿Confirmar esta reserva?',
        message: `${describe(reservation, timeZone)}. ${who} la verá confirmada. Después no se puede volver a "por confirmar".`,
        confirmText: 'Confirmar',
        cancelText: 'Volver',
      },
      () => void run(reservation, 'confirm'),
    );
  };

  const askReject = (reservation: VenueReservation, timeZone?: string | null) => {
    const who = reservationPlayerName(reservation) ?? 'El jugador';
    confirmDestructive(
      {
        title: '¿Rechazar esta reserva?',
        message: `${describe(reservation, timeZone)}. ${who} la verá rechazada y el horario quedará libre.`,
        confirmText: 'Rechazar',
        cancelText: 'Volver',
      },
      () => void run(reservation, 'reject'),
    );
  };

  const closeSheet = () => setSheet(null);

  const runAgendaAction = async (reservation: VenueReservation, action: OwnerAgendaAction) => {
    closeSheet();
    setBusy({ id: reservation.id, action });
    try {
      if (action === 'complete') {
        await completeMutation.mutateAsync(reservation.id);
        feedback.success('Reserva completada');
      } else if (action === 'no_show') {
        await noShowMutation.mutateAsync(reservation.id);
        feedback.success('Marcada como "No asistió"');
      } else {
        await cancelMutation.mutateAsync({ reservationId: reservation.id });
        feedback.success('Reserva cancelada', 'El horario quedó libre.');
      }
    } catch (error) {
      feedback.error('No se pudo actualizar la reserva', humanizeError(error, 'manage'));
    } finally {
      setBusy(null);
    }
  };

  const askAgendaAction = (
    reservation: VenueReservation,
    action: OwnerAgendaAction,
    timeZone?: string | null,
  ) => {
    const slot = describe(reservation, timeZone);
    const who = reservationPlayerName(reservation) ?? 'el jugador';
    const onConfirm = () => void runAgendaAction(reservation, action);

    if (action === 'complete') {
      confirmAction(
        {
          title: '¿Marcar como completada?',
          message: `${slot}. Indica que el turno se jugó; después ya no se puede cancelar.`,
          confirmText: 'Completada',
          cancelText: 'Volver',
        },
        onConfirm,
      );
    } else if (action === 'no_show') {
      confirmDestructive(
        {
          title: '¿Marcar que no asistió?',
          message: `${slot}. Quedará registrado que ${who} no asistió. No se puede deshacer.`,
          confirmText: 'No asistió',
          cancelText: 'Volver',
        },
        onConfirm,
      );
    } else {
      if (reservation.paidMinor > 0) {
        // The server requires a refund decision for paid reservations; the mobile
        // form for it is not built yet, so it is done from the web app.
        feedback.error(
          'Esta reserva tiene dinero pagado',
          'Cancélala desde la web para registrar la devolución.',
        );
        return;
      }
      confirmDestructive(
        {
          title: '¿Cancelar esta reserva?',
          message: `${slot}. El horario quedará libre y no se puede deshacer.`,
          confirmText: 'Cancelar reserva',
          cancelText: 'Volver',
        },
        onConfirm,
      );
    }
  };

  /** Resolves to an inline error for the payment form, or null once saved. */
  const recordPayment = async (
    reservation: VenueReservation,
    input: RecordReservationPaymentInput,
  ): Promise<string | null> => {
    setBusy({ id: reservation.id, action: 'payment' });
    try {
      const updated = await paymentMutation.mutateAsync({ reservationId: reservation.id, input });
      closeSheet();
      const confirmed =
        reservation.status === 'pending_confirmation' && updated.status === 'confirmed';
      feedback.success(
        confirmed ? 'Pago registrado y reserva confirmada' : 'Pago registrado',
        formatMoney(input.amountMinor, reservation.currency) ?? undefined,
      );
      return null;
    } catch (error) {
      return humanizeError(error, 'payment');
    } finally {
      setBusy(null);
    }
  };

  return {
    askConfirm,
    askReject,
    askAgendaAction,
    recordPayment,
    sheet,
    openSheet: (reservation: VenueReservation, timeZone?: string | null) =>
      setSheet({ reservation, timeZone: timeZone ?? null }),
    closeSheet,
    busy,
    isPending:
      confirmMutation.isPending ||
      rejectMutation.isPending ||
      paymentMutation.isPending ||
      completeMutation.isPending ||
      noShowMutation.isPending ||
      cancelMutation.isPending,
  };
}

export type OwnerReservationActions = ReturnType<typeof useOwnerReservationActions>;
