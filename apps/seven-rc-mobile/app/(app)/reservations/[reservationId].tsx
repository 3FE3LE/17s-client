import { Feather } from '@expo/vector-icons';
import { useTranslation } from '@17suit/i18n/react';
import {
  AppAlert,
  AppBadge,
  AppButton,
  AppEmpty,
  AppSkeleton,
  GapView,
  useAppTheme,
} from '@17suit/ui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Screen } from '../../../components/screen';
import { VenueLinks } from '../../../components/venue-links';
import { confirmDestructive } from '../../../lib/confirm';
import { humanizeError } from '../../../lib/error-messages';
import { feedback } from '../../../lib/feedback';
import { useNow } from '../../../lib/focus';
import { usePullRefresh } from '../../../lib/use-pull-refresh';
import { venueRouteParams } from '../../../lib/venue-params';
import { useCancelReservationMutation, useMyReservationsQuery } from '../../../lib/player-queries';
import {
  displayStatus,
  formatMoney,
  formatVenueLongDay,
  formatVenueTime,
  isReservationCancellable,
  isReservationUpcoming,
  reservationBadgeVariant,
  reservationStatusLabel,
} from '../../../lib/reservation-format';
import { venueTimeLabel } from '../../../lib/timezone-label';

const PENDING_POLL_MS = 30_000;

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: 'grid' | 'calendar' | 'clock' | 'users' | 'file-text' | 'credit-card';
  label: string;
  value: string;
}) {
  const { theme } = useAppTheme();
  const captionType = theme.typography.styles.caption;
  const bodyType = theme.typography.styles.body;

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'flex-start' }}
    >
      <Feather name={icon} size={18} color={theme.colors.muted} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            color: theme.colors.muted,
            fontFamily: captionType.nativeFamily,
            fontSize: captionType.fontSize,
            lineHeight: 18,
            letterSpacing: captionType.letterSpacingPx,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
            lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
            letterSpacing: bodyType.letterSpacingPx,
            fontVariant: ['tabular-nums'],
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ReservationDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const locale = t('intlLocale');
  const { theme } = useAppTheme();
  const now = useNow();
  const params = useLocalSearchParams<{ reservationId?: string | string[] }>();
  const reservationId = Array.isArray(params.reservationId)
    ? params.reservationId[0]
    : params.reservationId;
  // Refresh on return to the app, and poll while the venue has not answered yet.
  const reservationsQuery = useMyReservationsQuery({
    refetchOnWindowFocus: true,
    refetchInterval: (query) =>
      query.state.data?.find((item) => item.id === reservationId)?.status === 'pending_confirmation'
        ? PENDING_POLL_MS
        : false,
  });
  const pullRefresh = usePullRefresh(() => reservationsQuery.refetch());
  const cancelMutation = useCancelReservationMutation();
  const reservation = reservationsQuery.data?.find((item) => item.id === reservationId);

  // A just-created reservation arrives with the post-mutation refetch.
  if (reservationsQuery.isLoading || (!reservation && reservationsQuery.isFetching)) {
    return (
      <Screen title={t('common.reservation')}>
        <AppSkeleton height={220} rounded="lg" />
      </Screen>
    );
  }

  if (reservationsQuery.error && !reservation) {
    return (
      <Screen title={t('common.reservation')}>
        <AppAlert
          variant="warning"
          title={t('reservationDetail.loadError')}
          description={humanizeError(reservationsQuery.error, t, 'load')}
          action={
            <AppButton
              variant="warning"
              onPress={() => {
                void reservationsQuery.refetch();
              }}
            >
              {t('common.retry')}
            </AppButton>
          }
        />
      </Screen>
    );
  }

  if (!reservation) {
    return (
      <Screen title={t('common.reservation')}>
        <AppEmpty
          title={t('reservationDetail.notFoundTitle')}
          description={t('reservationDetail.notFoundDescription')}
          icon={<Feather name="search" size={20} color={theme.colors.brandPrimary} />}
          actionLabel={t('reservationDetail.goHome')}
          onAction={() => router.replace('/home')}
        />
      </Screen>
    );
  }

  const timeZone = reservation.venue?.timezone;
  const status = displayStatus(reservation, now);
  const cancelWindowHours = reservation.venue?.cancellationWindowHours ?? 0;
  const canCancel = isReservationCancellable(status, reservation.startAt, cancelWindowHours, now);
  const cancelWindowClosed = !canCancel && isReservationUpcoming(reservation, now);
  const totalLabel =
    formatMoney(reservation.priceMinor, reservation.currency, locale) ??
    t('reservationDetail.totalPending');
  const depositLabel = formatMoney(reservation.depositMinor, reservation.currency, locale);
  const note = {
    color: theme.colors.muted,
    fontFamily: theme.typography.styles.body.nativeFamily,
    fontSize: theme.typography.styles.body.fontSize,
    lineHeight: 22,
  };
  const isCancelling = cancelMutation.isPending;
  const timeRange = `${formatVenueTime(reservation.startAt, timeZone, locale)}–${formatVenueTime(
    reservation.endAt,
    timeZone,
    locale,
  )}`;

  const runCancel = async () => {
    try {
      await cancelMutation.mutateAsync(reservation.id);
      feedback.success(
        t('reservationDetail.cancelledTitle'),
        t('reservationDetail.cancelledMessage'),
      );
    } catch (error) {
      feedback.error(t('reservationDetail.cancelFailed'), humanizeError(error, t, 'cancel'));
    }
  };

  const bookAgain = () => {
    router.push({
      pathname: '/reservations/new',
      params: {
        ...(reservation.venue
          ? venueRouteParams(reservation.venue)
          : { venueId: reservation.venueId }),
        pitchId: reservation.pitchId,
      },
    });
  };

  const confirmCancel = () => {
    confirmDestructive(
      {
        title: t('reservationDetail.askCancelTitle'),
        message: t('reservationDetail.askCancelMessage', {
          court: reservation.pitch?.name ?? t('common.court'),
          day: formatVenueLongDay(reservation.startAt, timeZone, locale),
          time: timeRange,
        }),
        confirmText: t('common.cancelReservation'),
        cancelText: t('reservationDetail.keep'),
      },
      () => {
        void runCancel();
      },
    );
  };

  return (
    <Screen
      title={reservation.venue?.name ?? t('common.reservation')}
      onRefresh={pullRefresh.onRefresh}
      refreshing={pullRefresh.refreshing}
      footer={
        canCancel ? (
          <AppButton
            variant="destructive"
            onPress={confirmCancel}
            disabled={isCancelling}
            busy={isCancelling}
          >
            {isCancelling ? t('reservationDetail.cancelling') : t('common.cancelReservation')}
          </AppButton>
        ) : (
          <AppButton onPress={bookAgain} accessibilityHint={t('reservationDetail.bookAgainHint')}>
            {t('reservationDetail.bookAgain')}
          </AppButton>
        )
      }
    >
      <GapView gap="md">
        <View style={{ flexDirection: 'row' }}>
          <AppBadge variant={reservationBadgeVariant(status)}>
            {reservationStatusLabel(status, t)}
          </AppBadge>
        </View>

        {status === 'pending_confirmation' ? (
          <Text style={note}>{t('reservationDetail.pendingNote')}</Text>
        ) : null}
        {status === 'expired' ? (
          <Text style={note}>{t('reservationDetail.expiredNote')}</Text>
        ) : null}
        {cancelWindowClosed ? (
          <Text style={note}>
            {t('reservationDetail.windowClosedNote', { hours: cancelWindowHours })}
          </Text>
        ) : null}
        {canCancel && cancelWindowHours > 0 ? (
          <Text style={note}>
            {t('reservationDetail.windowOpenNote', { hours: cancelWindowHours })}
          </Text>
        ) : null}

        <View
          style={{
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.grayscale[3],
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            gap: theme.spacing.md,
          }}
        >
          <DetailRow
            icon="grid"
            label={t('common.court')}
            value={reservation.pitch?.name ?? t('common.court')}
          />
          <DetailRow
            icon="calendar"
            label={t('reservationDetail.date')}
            value={formatVenueLongDay(reservation.startAt, timeZone, locale)}
          />
          <DetailRow icon="clock" label={venueTimeLabel(timeZone, t)} value={timeRange} />
          <DetailRow icon="credit-card" label={t('reservationDetail.total')} value={totalLabel} />
          {depositLabel ? (
            <DetailRow
              icon="credit-card"
              label={t('reservationDetail.deposit')}
              value={depositLabel}
            />
          ) : null}
          <VenueLinks
            address={reservation.venue?.address}
            phone={reservation.venue?.contactPhone}
          />
          {reservation.invitedCount > 0 ? (
            <DetailRow
              icon="users"
              label={t('reservationDetail.guests')}
              value={String(reservation.invitedCount)}
            />
          ) : null}
          {reservation.notes ? (
            <DetailRow
              icon="file-text"
              label={t('reservationDetail.notes')}
              value={reservation.notes}
            />
          ) : null}
        </View>
      </GapView>
    </Screen>
  );
}
