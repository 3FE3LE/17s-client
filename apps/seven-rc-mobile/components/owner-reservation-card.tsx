import { useTranslation } from '@17suit/i18n/react';
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
  const { t } = useTranslation('mobile');
  const locale = t('intlLocale');
  const awaiting = isAwaitingOwner(reservation, now);
  const expired = isPendingExpired(reservation, now);
  const name = reservationPlayerName(reservation);
  const price = formatMoney(reservation.priceMinor, reservation.currency, locale);
  const paid = formatMoney(reservation.paidMinor, reservation.currency, locale);
  const hasMoreActions =
    paymentKindsFor(reservation, now).length > 0 || agendaActionsFor(reservation, now).length > 0;
  const details = [
    name ?? t('common.unnamedPlayer'),
    reservation.invitedCount > 0
      ? t('ownerCard.guests', { count: reservation.invitedCount })
      : null,
    price,
    paid ? t('ownerCard.paid', { amount: paid }) : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const isBusy = actions.busy?.id === reservation.id;
  const busyAction = isBusy ? actions.busy?.action : null;
  const pitchName = reservation.pitch?.name ?? t('common.court');
  const phone = hasDialablePhone(reservation.customerPhone) ? reservation.customerPhone : null;

  return (
    <AppCard
      title={venueName ? `${venueName} · ${pitchName}` : pitchName}
      subtitle={formatVenueRange(reservation.startAt, reservation.endAt, timeZone, locale)}
      tone={awaiting ? 'accent' : 'default'}
      footer={
        <GapView gap="sm">
          <AppBadge variant={expired ? 'neutral' : reservationBadgeVariant(reservation.status)}>
            {expired
              ? t('reservationStatus.expired')
              : reservationStatusLabel(reservation.status, t)}
          </AppBadge>
          {awaiting ? (
            <AppButtonGroup>
              <AppButton
                variant="success"
                disabled={actions.isPending}
                busy={busyAction === 'confirm'}
                onPress={() => actions.askConfirm(reservation, timeZone)}
                accessibilityLabel={t('ownerCard.confirmA11y', {
                  name: name ?? t('ownerCard.playerFallback'),
                  court: pitchName,
                })}
              >
                {busyAction === 'confirm' ? t('ownerCard.confirming') : t('ownerActions.confirm')}
              </AppButton>
              <AppButton
                variant="destructive"
                disabled={actions.isPending}
                busy={busyAction === 'reject'}
                onPress={() => actions.askReject(reservation, timeZone)}
                accessibilityLabel={t('ownerCard.rejectA11y', {
                  name: name ?? t('ownerCard.playerFallback'),
                  court: pitchName,
                })}
              >
                {busyAction === 'reject' ? t('ownerCard.rejecting') : t('ownerActions.reject')}
              </AppButton>
            </AppButtonGroup>
          ) : null}
          {hasMoreActions ? (
            <AppButton
              variant="neutral"
              disabled={actions.isPending}
              busy={isBusy && !awaiting}
              onPress={() => actions.openSheet(reservation, timeZone)}
              accessibilityLabel={t('ownerCard.actionsA11y', {
                name: name ?? t('ownerCard.playerFallback'),
                court: pitchName,
              })}
            >
              {isBusy && !awaiting ? t('ownerCard.saving') : t('ownerCard.actions')}
            </AppButton>
          ) : null}
          {phone ? (
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <View style={{ flex: 1 }}>
                <AppButton
                  variant="neutral"
                  onPress={() => void callPhone(phone, t)}
                  accessibilityLabel={t('ownerCard.callA11y', {
                    name: name ?? t('common.playerLower'),
                  })}
                >
                  {t('ownerCard.call')}
                </AppButton>
              </View>
              <View style={{ flex: 1 }}>
                <AppButton
                  variant="neutral"
                  onPress={() => void openWhatsApp(phone, t)}
                  accessibilityLabel={t('ownerCard.whatsappA11y', {
                    name: name ?? t('common.playerLower'),
                  })}
                >
                  {t('ownerCard.whatsapp')}
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
