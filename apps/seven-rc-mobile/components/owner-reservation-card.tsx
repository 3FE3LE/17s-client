import {
  AppBadge,
  AppButton,
  AppButtonGroup,
  AppCard,
  AppTypography,
  GapView,
  useAppTheme,
} from '@17suit/ui-native';
import { View } from 'react-native';
import { callPhone, hasDialablePhone, openWhatsApp } from '../lib/links';
import type { VenueReservation } from '../lib/owner-queries';
import {
  formatMoney,
  formatVenueRange,
  isAwaitingOwner,
  isPendingExpired,
  reservationBadgeVariant,
  reservationStatusLabel,
} from '../lib/reservation-format';
import {
  agendaActionsFor,
  paymentKindsFor,
  reservationPlayerName,
  type OwnerReservationActions,
} from '../lib/use-owner-reservation-actions';

interface OwnerReservationCardProps {
  reservation: VenueReservation;
  timeZone?: string | null | undefined;
  /** Shown before the court name in the cross-venue inbox. */
  venueName?: string | undefined;
  now: number;
  actions: OwnerReservationActions;
}

/** One reservation as the owner sees it: who, when, price, and the next action. */
export function OwnerReservationCard({
  reservation,
  timeZone,
  venueName,
  now,
  actions,
}: OwnerReservationCardProps) {
  const { theme } = useAppTheme();
  const awaiting = isAwaitingOwner(reservation, now);
  const expired = isPendingExpired(reservation, now);
  const name = reservationPlayerName(reservation);
  const price = formatMoney(reservation.priceMinor, reservation.currency);
  const paid = formatMoney(reservation.paidMinor, reservation.currency);
  const hasMoreActions =
    paymentKindsFor(reservation, now).length > 0 || agendaActionsFor(reservation, now).length > 0;
  const details = [
    name ?? 'Jugador sin nombre',
    reservation.invitedCount > 0
      ? `${reservation.invitedCount} ${reservation.invitedCount === 1 ? 'invitado' : 'invitados'}`
      : null,
    price,
    paid ? `Pagado ${paid}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const isBusy = actions.busy?.id === reservation.id;
  const busyAction = isBusy ? actions.busy?.action : null;
  const pitchName = reservation.pitch?.name ?? 'Cancha';
  const phone = hasDialablePhone(reservation.customerPhone) ? reservation.customerPhone : null;

  return (
    <AppCard
      title={venueName ? `${venueName} · ${pitchName}` : pitchName}
      subtitle={formatVenueRange(reservation.startAt, reservation.endAt, timeZone)}
      tone={awaiting ? 'accent' : 'default'}
      footer={
        <GapView gap="sm">
          <AppBadge variant={expired ? 'neutral' : reservationBadgeVariant(reservation.status)}>
            {expired ? 'Vencida' : reservationStatusLabel(reservation.status)}
          </AppBadge>
          {awaiting ? (
            <AppButtonGroup>
              <AppButton
                variant="success"
                disabled={actions.isPending}
                busy={busyAction === 'confirm'}
                onPress={() => actions.askConfirm(reservation, timeZone)}
                accessibilityLabel={`Confirmar reserva de ${name ?? 'jugador'}, ${pitchName}`}
              >
                {busyAction === 'confirm' ? 'Confirmando…' : 'Confirmar'}
              </AppButton>
              <AppButton
                variant="destructive"
                disabled={actions.isPending}
                busy={busyAction === 'reject'}
                onPress={() => actions.askReject(reservation, timeZone)}
                accessibilityLabel={`Rechazar reserva de ${name ?? 'jugador'}, ${pitchName}`}
              >
                {busyAction === 'reject' ? 'Rechazando…' : 'Rechazar'}
              </AppButton>
            </AppButtonGroup>
          ) : null}
          {hasMoreActions ? (
            <AppButton
              variant="neutral"
              disabled={actions.isPending}
              busy={isBusy && !awaiting}
              onPress={() => actions.openSheet(reservation, timeZone)}
              accessibilityLabel={`Acciones de la reserva de ${name ?? 'jugador'}, ${pitchName}`}
            >
              {isBusy && !awaiting ? 'Guardando…' : 'Acciones'}
            </AppButton>
          ) : null}
          {phone ? (
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <View style={{ flex: 1 }}>
                <AppButton
                  variant="neutral"
                  onPress={() => void callPhone(phone)}
                  accessibilityLabel={`Llamar a ${name ?? 'el jugador'}`}
                >
                  Llamar
                </AppButton>
              </View>
              <View style={{ flex: 1 }}>
                <AppButton
                  variant="neutral"
                  onPress={() => void openWhatsApp(phone)}
                  accessibilityLabel={`Escribir por WhatsApp a ${name ?? 'el jugador'}`}
                >
                  WhatsApp
                </AppButton>
              </View>
            </View>
          ) : null}
        </GapView>
      }
    >
      <AppTypography variant="body">{details}</AppTypography>
      {reservation.notes ? (
        <AppTypography variant="body" color={theme.colors.muted}>
          {`“${reservation.notes}”`}
        </AppTypography>
      ) : null}
    </AppCard>
  );
}
