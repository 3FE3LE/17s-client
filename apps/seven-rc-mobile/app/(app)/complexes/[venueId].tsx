import { useTranslation } from '@17suit/i18n/react';
import {
  sevenRcQueryKeys,
  useCurrentUserRoleQuery,
} from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppButton,
  AppCard,
  AppEmpty,
  AppSeparator,
  AppSkeleton,
  AppTypography,
  GapView,
  useAppTheme,
} from '@17suit/ui-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../../components/screen';
import { OwnerActionSheet } from '../../../components/owner-action-sheet';
import { OwnerReservationCard } from '../../../components/owner-reservation-card';
import { humanizeError } from '../../../lib/error-messages';
import { formatUpdatedAgo, useNow, useScreenFocus } from '../../../lib/focus';
import { isAwaitingOwner, venueDateKey } from '../../../lib/reservation-format';
import {
  ownerReservationsRange,
  useOwnerVenuePitchesQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
} from '../../../lib/owner-queries';
import { pitchSummary, sportIcon } from '../../../lib/sports';
import { usePullRefresh } from '../../../lib/use-pull-refresh';
import { useOwnerReservationActions } from '../../../lib/use-owner-reservation-actions';
import type { VenueReservation } from '../../../lib/seven-rc-api';

const PENDING_POLL_MS = 45_000;

function byStart(a: VenueReservation, b: VenueReservation) {
  return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
}

/**
 * Role gate. Owner-only queries mount in `OwnerVenueDetail`, so a player (or a
 * role still loading) never fires them and never sees a "not allowed" flash.
 */
export default function VenueDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const { user } = useUser();
  const { role, isLoading } = useCurrentUserRoleQuery({
    userId: user?.id ?? null,
    enabled: Boolean(user?.id),
  });

  if (isLoading || !user) {
    return (
      <Screen title={t('common.venue')}>
        <GapView gap="sm">
          <AppSkeleton height={44} rounded="md" />
          <AppSkeleton height={120} rounded="lg" />
          <AppSkeleton height={120} rounded="lg" />
        </GapView>
      </Screen>
    );
  }

  if (role !== 'OWNER' || !venueId) {
    return (
      <Screen title={t('common.venue')} subtitle={t('venueOwner.ownersOnly')}>
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>{t('common.backHome')}</AppButton>
        </GapView>
      </Screen>
    );
  }

  return <OwnerVenueDetail venueId={venueId} />;
}

function OwnerVenueDetail({ venueId }: { venueId: string }) {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();
  const iconColor = theme.colors.brandPrimary;
  const venuesQuery = useOwnerVenuesQuery();
  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
  const [range] = useState(() => ownerReservationsRange());
  const refreshVenue = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId) }),
        queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenueReservationsBase(venueId),
        }),
      ]),
    [queryClient, venueId],
  );
  const pullRefresh = usePullRefresh(() => Promise.all([venuesQuery.refetch(), refreshVenue()]));
  const focused = useScreenFocus(refreshVenue);
  const now = useNow(30_000);
  const reservationsQuery = useOwnerVenueReservationsQuery(venueId, range.from, range.to, {
    refetchOnWindowFocus: true,
    refetchInterval: focused ? PENDING_POLL_MS : false,
    refetchIntervalInBackground: false,
  });
  const actions = useOwnerReservationActions();

  const venue = (venuesQuery.data ?? []).find((item) => item.id === venueId);
  const timeZone = venue?.timezone;
  // Times and day buckets need the venue's zone; never fall back to the phone's.
  const resolvingVenue = !timeZone && venuesQuery.isFetching;
  const loadingAgenda = reservationsQuery.isLoading || resolvingVenue;
  const pitches = pitchesQuery.data ?? [];

  // Day buckets use the venue's calendar, not the phone's. Expired requests
  // fall out of "Por confirmar" into their day, marked "Vencida".
  const sections = useMemo(() => {
    const all = [...(reservationsQuery.data ?? [])].sort(byStart);
    const today = venueDateKey(new Date(now), timeZone);
    const pending = all.filter((item) => isAwaitingOwner(item, now));
    const rest = all.filter((item) => !isAwaitingOwner(item, now));
    const keyOf = (item: VenueReservation) => venueDateKey(item.startAt, timeZone);
    return {
      pending,
      today: rest.filter((item) => today !== null && keyOf(item) === today),
      upcoming: rest.filter((item) => {
        const key = keyOf(item);
        return today !== null && key !== null && key > today;
      }),
      history: rest
        .filter((item) => {
          const key = keyOf(item);
          return today !== null && key !== null && key < today;
        })
        .reverse(),
    };
  }, [reservationsQuery.data, timeZone, now]);

  const hasAnyReservation =
    sections.pending.length +
      sections.today.length +
      sections.upcoming.length +
      sections.history.length >
    0;
  const updatedLabel = formatUpdatedAgo(reservationsQuery.dataUpdatedAt, now, t);

  function renderReservation(reservation: VenueReservation) {
    return (
      <OwnerReservationCard
        key={reservation.id}
        reservation={reservation}
        timeZone={timeZone}
        now={now}
        actions={actions}
      />
    );
  }

  function renderSection(title: string, items: VenueReservation[]) {
    if (items.length === 0) return null;
    return (
      <GapView gap="sm">
        <AppTypography variant="subtitle2" accessibilityRole="header">
          {`${title} (${items.length})`}
        </AppTypography>
        {items.map(renderReservation)}
      </GapView>
    );
  }

  return (
    <Screen
      title={venue?.name ?? t('common.venue')}
      subtitle={updatedLabel ?? t('venueOwner.subtitle')}
      onRefresh={pullRefresh.onRefresh}
      refreshing={pullRefresh.refreshing}
    >
      <GapView gap="md">
        <OwnerActionSheet actions={actions} />
        {!timeZone && !venuesQuery.isFetching ? (
          <AppAlert
            variant="warning"
            title={t('venueOwner.loadError')}
            description={
              venuesQuery.error
                ? humanizeError(venuesQuery.error, t, 'load')
                : t('venueOwner.notFound')
            }
            action={
              <AppButton variant="warning" onPress={() => void venuesQuery.refetch()}>
                {t('common.retry')}
              </AppButton>
            }
          />
        ) : null}

        {loadingAgenda ? (
          <GapView gap="sm">
            <AppSkeleton height={100} rounded="lg" />
            <AppSkeleton height={100} rounded="lg" />
          </GapView>
        ) : null}

        {reservationsQuery.error ? (
          <AppAlert
            variant="warning"
            title={t('venueOwner.reservationsError')}
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
        ) : null}

        {timeZone && !loadingAgenda && !reservationsQuery.error ? (
          hasAnyReservation ? (
            <GapView gap="lg">
              {renderSection(t('venueOwner.sectionPending'), sections.pending)}
              {renderSection(t('venueOwner.sectionToday'), sections.today)}
              {renderSection(t('venueOwner.sectionUpcoming'), sections.upcoming)}
              {renderSection(t('venueOwner.sectionHistory'), sections.history)}
            </GapView>
          ) : (
            <AppEmpty
              title={t('venueOwner.noReservationsTitle')}
              description={t('venueOwner.noReservationsDescription')}
              icon={<Feather name="calendar" size={20} color={iconColor} />}
            />
          )
        ) : null}

        <AppSeparator />
        <AppTypography variant="subtitle2" accessibilityRole="header">
          {pitches.length > 0
            ? t('venueOwner.courtsCount', { count: pitches.length })
            : t('venueOwner.courts')}
        </AppTypography>

        {pitchesQuery.isLoading ? (
          <GapView gap="sm">
            <AppSkeleton height={90} rounded="lg" />
            <AppSkeleton height={90} rounded="lg" />
          </GapView>
        ) : null}

        {pitchesQuery.error ? (
          <AppAlert
            variant="warning"
            title={t('venueOwner.courtsError')}
            description={humanizeError(pitchesQuery.error, t, 'load')}
            action={
              <AppButton
                variant="warning"
                onPress={() => {
                  void pitchesQuery.refetch();
                }}
              >
                {t('common.retry')}
              </AppButton>
            }
          />
        ) : null}

        {!pitchesQuery.isLoading && !pitchesQuery.error && pitches.length === 0 ? (
          <AppEmpty
            title={t('venueOwner.noCourtsTitle')}
            description={t('venueOwner.noCourtsDescription')}
            icon={<Feather name="plus" size={20} color={iconColor} />}
            actionLabel={t('venueOwner.createCourt')}
            onAction={() => router.push(`/complexes/${venueId}/courts/new`)}
          />
        ) : null}

        {pitches.map((pitch) => (
          <AppCard
            key={pitch.id}
            title={pitch.name}
            footer={
              <AppButton
                variant="info"
                onPress={() => router.push(`/complexes/${venueId}/courts/${pitch.id}/slots`)}
              >
                {t('venueOwner.configureSlots')}
              </AppButton>
            }
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
              <MaterialCommunityIcons
                name={sportIcon(pitch.sportType)}
                size={22}
                color={theme.colors.muted}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
              <AppTypography variant="body" color={theme.colors.muted} style={{ flex: 1 }}>
                {pitchSummary(pitch, t)}
              </AppTypography>
            </View>
          </AppCard>
        ))}

        {pitches.length > 0 ? (
          <AppButton
            variant="neutral"
            onPress={() => router.push(`/complexes/${venueId}/courts/new`)}
          >
            {t('venueOwner.createCourt')}
          </AppButton>
        ) : null}
      </GapView>
    </Screen>
  );
}
