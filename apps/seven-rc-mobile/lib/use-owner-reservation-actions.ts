import { useTranslation } from '@17suit/i18n/react';
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

/** Catalog keys (`mobile` namespace) for the agenda action buttons. */
export const AGENDA_ACTION_LABEL_KEYS: Record<OwnerAgendaAction, string> = {
  complete: 'ownerActions.complete',
  no_show: 'ownerActions.noShow',
  cancel: 'ownerActions.cancelReservation',
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
  const { t } = useTranslation('mobile');
  const locale = t('intlLocale');
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
        feedback.success(t('ownerActions.confirmedTitle'), t('ownerActions.confirmedMessage'));
      } else {
        await rejectMutation.mutateAsync(input);
        feedback.success(t('ownerActions.rejectedTitle'), t('ownerActions.rejectedMessage'));
      }
    } catch (error) {
      feedback.error(
        action === 'confirm' ? t('ownerActions.confirmFailed') : t('ownerActions.rejectFailed'),
        humanizeError(error, t, action),
      );
    } finally {
      setBusy(null);
    }
  };

  const describe = (reservation: VenueReservation, timeZone?: string | null) =>
    `${reservation.pitch?.name ?? t('common.court')} · ${formatVenueRange(
      reservation.startAt,
      reservation.endAt,
      timeZone,
      locale,
    )}`;

  const askConfirm = (reservation: VenueReservation, timeZone?: string | null) => {
    const who = reservationPlayerName(reservation) ?? t('common.player');
    confirmAction(
      {
        title: t('ownerActions.askConfirmTitle'),
        message: t('ownerActions.askConfirmMessage', {
          slot: describe(reservation, timeZone),
          who,
        }),
        confirmText: t('ownerActions.confirm'),
        cancelText: t('common.back'),
      },
      () => void run(reservation, 'confirm'),
    );
  };

  const askReject = (reservation: VenueReservation, timeZone?: string | null) => {
    const who = reservationPlayerName(reservation) ?? t('common.player');
    confirmDestructive(
      {
        title: t('ownerActions.askRejectTitle'),
        message: t('ownerActions.askRejectMessage', {
          slot: describe(reservation, timeZone),
          who,
        }),
        confirmText: t('ownerActions.reject'),
        cancelText: t('common.back'),
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
        feedback.success(t('ownerActions.completedTitle'));
      } else if (action === 'no_show') {
        await noShowMutation.mutateAsync({ reservationId: reservation.id });
        feedback.success(t('ownerActions.noShowTitle'));
      } else {
        await cancelMutation.mutateAsync({ reservationId: reservation.id });
        feedback.success(t('ownerActions.cancelledTitle'), t('ownerActions.cancelledMessage'));
      }
    } catch (error) {
      feedback.error(t('ownerActions.updateFailed'), humanizeError(error, t, 'manage'));
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
    const who = reservationPlayerName(reservation) ?? t('common.playerLower');
    const onConfirm = () => void runAgendaAction(reservation, action);

    if (action === 'complete') {
      confirmAction(
        {
          title: t('ownerActions.askCompleteTitle'),
          message: t('ownerActions.askCompleteMessage', { slot }),
          confirmText: t('ownerActions.complete'),
          cancelText: t('common.back'),
        },
        onConfirm,
      );
    } else if (action === 'no_show') {
      confirmDestructive(
        {
          title: t('ownerActions.askNoShowTitle'),
          message: t('ownerActions.askNoShowMessage', { slot, who }),
          confirmText: t('ownerActions.noShow'),
          cancelText: t('common.back'),
        },
        onConfirm,
      );
    } else {
      if (reservation.paidMinor > 0) {
        // The server requires a refund decision for paid reservations; the mobile
        // form for it is not built yet, so it is done from the web app.
        feedback.error(t('ownerActions.paidTitle'), t('ownerActions.paidMessage'));
        return;
      }
      confirmDestructive(
        {
          title: t('ownerActions.askCancelTitle'),
          message: t('ownerActions.askCancelMessage', { slot }),
          confirmText: t('ownerActions.cancelReservation'),
          cancelText: t('common.back'),
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
        confirmed ? t('ownerActions.paymentConfirmedTitle') : t('ownerActions.paymentTitle'),
        formatMoney(input.amountMinor, reservation.currency, locale) ?? undefined,
      );
      return null;
    } catch (error) {
      return humanizeError(error, t, 'payment');
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
