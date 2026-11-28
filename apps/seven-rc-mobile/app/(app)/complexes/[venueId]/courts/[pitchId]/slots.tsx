import { useMemo, useState } from 'react';
import { useTranslation } from '@17suit/i18n/react';
import { useLocalSearchParams, usePreventRemove, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import type { Pitch } from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppButton,
  AppSelect,
  AppSkeleton,
  AppTypography,
  GapView,
  useAppTheme,
} from '@17suit/ui-native';
import { Alert, Platform, Pressable, Switch, Text, View } from 'react-native';
import {
  useOwnerVenuePitchesQuery,
  useConfigurePitchSlotsMutation,
} from '../../../../../../lib/owner-queries';
import { humanizeError } from '../../../../../../lib/error-messages';
import { feedback } from '../../../../../../lib/feedback';
import { confirmDestructive } from '../../../../../../lib/confirm';
import { Screen } from '../../../../../../components/screen';
import { FormError } from '../../../../../../components/form-field';
import type { MobileT } from '../../../../../../lib/i18n';

/** Monday-first display order; `dayOfWeek` stays 0=Sunday per the API. */
const DAY_ORDER = ['1', '2', '3', '4', '5', '6', '0'] as const;
const WEEKDAYS = ['1', '2', '3', '4', '5'] as const;
type DayKey = (typeof DAY_ORDER)[number];

const dayLabel = (day: DayKey, t: MobileT) => t(`slots.days.${day}`);

/** Same options as court creation so both screens speak one vocabulary. */
const DURATION_VALUES = ['30', '45', '60', '75', '90', '120'] as const;

const DEFAULT_OPEN = '10:00';
const DEFAULT_CLOSE = '22:00';
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MIDNIGHT = '00:00';

interface DayHours {
  open: boolean;
  openTime: string;
  closeTime: string;
}

type Week = Record<DayKey, DayHours>;

/** Minutes since midnight. A close of `00:00` means midnight (end of day), per the API. */
function toMinutes(value: string, field: 'open' | 'close') {
  const match = TIME_PATTERN.exec(value);
  if (!match) return null;
  const minutes = Number(match[1]) * 60 + Number(match[2]);
  return field === 'close' && minutes === 0 ? 24 * 60 : minutes;
}

function fromMinutes(total: number) {
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function closeLabel(value: string, t: MobileT) {
  return value === MIDNIGHT ? t('slots.midnight') : value;
}

function hoursLabel(day: DayHours, t: MobileT) {
  return day.open
    ? `${day.openTime}–${day.closeTime === MIDNIGHT ? '24:00' : day.closeTime}`
    : t('slots.closed');
}

function weekFromPitch(pitch: Pitch): Week {
  const hours = pitch.openingHours ?? {};
  const week = {} as Week;
  for (const day of DAY_ORDER) {
    const entry = hours[day];
    const configured = Boolean(entry?.openTime && entry?.closeTime);
    week[day] = {
      open: configured,
      openTime: configured ? (entry?.openTime ?? DEFAULT_OPEN) : DEFAULT_OPEN,
      closeTime: configured ? (entry?.closeTime ?? DEFAULT_CLOSE) : DEFAULT_CLOSE,
    };
  }
  return week;
}

/** Stable comparison key: only open days count, so toggling closed->open->closed is clean. */
function serialize(week: Week, duration: string) {
  return JSON.stringify({
    duration,
    days: DAY_ORDER.filter((day) => week[day].open).map((day) => [
      day,
      week[day].openTime,
      week[day].closeTime,
    ]),
  });
}

function dayError(day: DayHours, t: MobileT): string | null {
  if (!day.open) return null;
  const open = toMinutes(day.openTime, 'open');
  const close = toMinutes(day.closeTime, 'close');
  if (open === null || close === null) return t('slots.errorPickTimes');
  if (close <= open) return t('slots.errorCloseAfterOpen');
  return null;
}

/**
 * Times on a grid that lines up with the turn length: 30-minute steps for
 * durations that are multiples of 30, else 15. Off-grid saved values are kept.
 */
function timeOptions(step: number, field: 'open' | 'close', current: string, t: MobileT) {
  const values: string[] = [];
  const startAt = field === 'open' ? 0 : step;
  const endAt = field === 'open' ? 24 * 60 - step : 24 * 60;
  for (let minutes = startAt; minutes <= endAt; minutes += step) {
    values.push(fromMinutes(minutes));
  }
  if (!values.includes(current) && TIME_PATTERN.test(current)) {
    values.push(current);
    values.sort((a, b) => (toMinutes(a, field) ?? 0) - (toMinutes(b, field) ?? 0));
  }
  return values.map((value) => ({
    value,
    label: field === 'close' ? closeLabel(value, t) : value,
  }));
}

function useRouteIds() {
  const params = useLocalSearchParams<{
    venueId?: string | string[];
    pitchId?: string | string[];
  }>();
  const venueId = Array.isArray(params.venueId) ? params.venueId[0] : params.venueId;
  const pitchId = Array.isArray(params.pitchId) ? params.pitchId[0] : params.pitchId;
  return { venueId: venueId ?? null, pitchId: pitchId ?? null };
}

export default function PitchSlotsScreen() {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const { venueId, pitchId } = useRouteIds();
  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
  const pitch = useMemo(
    () => (pitchesQuery.data ?? []).find((item) => item.id === pitchId),
    [pitchesQuery.data, pitchId],
  );

  // The form mounts only once the pitch is loaded, so its initial state is the
  // pitch's real configuration. Saving a default week over a configured pitch
  // is impossible because Save does not exist until then.
  if (pitch && venueId) {
    return <PitchSlotsForm key={pitch.id} pitch={pitch} venueId={venueId} />;
  }

  const subtitle = t('slots.subtitle');

  // A court created seconds ago arrives with the post-mutation refetch.
  if (pitchesQuery.isLoading || (!pitchesQuery.error && pitchesQuery.isFetching)) {
    return (
      <Screen title={t('slots.title')} subtitle={subtitle}>
        <View accessibilityLabel={t('slots.loadingA11y')} accessible>
          <GapView gap="md">
            <AppSkeleton height={56} rounded="md" />
            <AppSkeleton height={336} rounded="md" />
          </GapView>
        </View>
      </Screen>
    );
  }

  if (pitchesQuery.error) {
    return (
      <Screen title={t('slots.title')} subtitle={subtitle}>
        <AppAlert
          variant="warning"
          title={t('slots.loadError')}
          description={t('slots.loadErrorDescription', {
            error: humanizeError(pitchesQuery.error, t, 'load'),
          })}
          action={
            <AppButton
              variant="warning"
              disabled={pitchesQuery.isFetching}
              onPress={() => {
                void pitchesQuery.refetch();
              }}
            >
              {pitchesQuery.isFetching ? t('slots.retrying') : t('common.retry')}
            </AppButton>
          }
        />
      </Screen>
    );
  }

  return (
    <Screen title={t('slots.title')} subtitle={subtitle}>
      <GapView gap="md">
        <AppAlert
          variant="warning"
          title={t('slots.notFoundTitle')}
          description={t('slots.notFoundDescription')}
        />
        <AppButton
          variant="neutral"
          onPress={() => router.replace(venueId ? `/complexes/${venueId}` : '/home')}
        >
          {t('slots.backToVenue')}
        </AppButton>
      </GapView>
    </Screen>
  );
}

interface PitchSlotsFormProps {
  pitch: Pitch;
  venueId: string;
}

function PitchSlotsForm({ pitch, venueId }: PitchSlotsFormProps) {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const { theme } = useAppTheme();

  // Captured on mount: a background refetch must not move the "unsaved changes" baseline.
  const [initialWeek] = useState(() => weekFromPitch(pitch));
  const [initialDuration] = useState(() => String(pitch.slotDurationMinutes));
  const [initialKey] = useState(() => serialize(initialWeek, initialDuration));
  const [saveError, setSaveError] = useState<string | null>(null);

  const [slotDurationMinutes, setSlotDurationMinutes] = useState(initialDuration);
  const [week, setWeek] = useState<Week>(initialWeek);
  const [expanded, setExpanded] = useState<DayKey | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const configureMutation = useConfigurePitchSlotsMutation(pitch.id, venueId);

  const isDirty = serialize(week, slotDurationMinutes) !== initialKey;
  const duration = Number(slotDurationMinutes) || 60;
  const step = duration % 30 === 0 ? 30 : 15;
  const errors = useMemo(() => {
    const result: Partial<Record<DayKey, string>> = {};
    for (const day of DAY_ORDER) {
      const message = dayError(week[day], t);
      if (message) result[day] = message;
    }
    return result;
  }, [week, t]);
  const hasErrors = Object.keys(errors).length > 0;
  const openDays = DAY_ORDER.filter((day) => week[day].open);

  // Back gesture, Android Back and Cancel all land here while there are edits.
  const isSaving = configureMutation.isPending;
  const disablePrevention = usePreventRemove((isDirty || isSaving) && !leaving, ({ repeat }) => {
    // The request is already sent, so "discard" would be a lie. Stay until it settles.
    if (isSaving) return;
    const discard = () => {
      setLeaving(true);
      repeat();
    };
    if (Platform.OS === 'web') {
      const confirmFn = (globalThis as { confirm?: (text: string) => boolean }).confirm;
      if (confirmFn?.(`${t('slots.leaveTitle')} ${t('slots.leaveMessage')}`)) discard();
      return;
    }
    Alert.alert(t('slots.leaveTitle'), t('slots.leaveMessage'), [
      { text: t('slots.keepEditing'), style: 'cancel' },
      { text: t('slots.discard'), style: 'destructive', onPress: discard },
    ]);
  });

  // A legacy duration outside the preset list must still show as selected.
  const durationSelectOptions = useMemo(() => {
    const values: string[] = [...DURATION_VALUES];
    if (!values.includes(slotDurationMinutes)) {
      values.push(slotDurationMinutes);
      values.sort((a, b) => Number(a) - Number(b));
    }
    return values.map((value) => ({ value, label: t('common.minutes', { minutes: value }) }));
  }, [slotDurationMinutes, t]);

  const updateDay = (day: DayKey, patch: Partial<DayHours>) => {
    setSaveError(null);
    setWeek((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  };

  const toggleDay = (day: DayKey, open: boolean) => {
    updateDay(day, { open });
    setExpanded(open ? day : expanded === day ? null : expanded);
  };

  // Presets copy the day being edited (or the first open day).
  const presetSource: DayKey | null =
    expanded && week[expanded].open ? expanded : (openDays[0] ?? null);
  const presetHours = presetSource
    ? { openTime: week[presetSource].openTime, closeTime: week[presetSource].closeTime }
    : { openTime: DEFAULT_OPEN, closeTime: DEFAULT_CLOSE };

  const applyPreset = (days: readonly DayKey[]) => {
    setSaveError(null);
    setWeek((prev) => {
      const next = { ...prev };
      for (const day of days) next[day] = { open: true, ...presetHours };
      return next;
    });
  };

  const save = async () => {
    setSaveError(null);
    try {
      await configureMutation.mutateAsync({
        slotDurationMinutes: duration,
        openingHours: openDays.map((day) => ({
          dayOfWeek: Number(day),
          openTime: week[day].openTime,
          closeTime: week[day].closeTime,
        })),
      });
      feedback.success(t('slots.savedTitle'), t('slots.savedMessage'));
      setLeaving(true);
      disablePrevention();
      // Back to the complex already on the stack, instead of a second copy of it.
      router.dismissTo(`/complexes/${venueId}`);
    } catch (error) {
      setSaveError(humanizeError(error, t, 'save'));
    }
  };

  const handleSave = () => {
    setSubmitted(true);
    setSaveError(null);
    if (hasErrors) {
      const firstWithError = DAY_ORDER.find((day) => errors[day]);
      if (firstWithError) setExpanded(firstWithError);
      setSaveError(t('slots.reviewDays'));
      return;
    }

    const removedDays = DAY_ORDER.filter((day) => initialWeek[day].open && !week[day].open);

    if (openDays.length === 0) {
      confirmDestructive(
        {
          title: t('slots.noHoursTitle'),
          message: t('slots.noHoursMessage'),
          confirmText: t('slots.saveNoHours'),
          cancelText: t('slots.keepEditing'),
        },
        () => void save(),
      );
      return;
    }

    if (removedDays.length > 0) {
      confirmDestructive(
        {
          title: t('slots.closeDaysTitle'),
          message: t('slots.closeDaysMessage', {
            days: removedDays.map((day) => dayLabel(day, t)).join(', '),
          }),
          confirmText: t('slots.closeAndSave'),
          cancelText: t('slots.keepEditing'),
        },
        () => void save(),
      );
      return;
    }

    void save();
  };

  const bodyType = theme.typography.styles.body;
  const labelType = theme.typography.styles.subtitle2;

  return (
    <Screen
      title={t('slots.title')}
      subtitle={t('slots.formSubtitle', { name: pitch.name })}
      footer={
        <GapView gap="sm">
          <FormError message={saveError} />
          <AppButton
            onPress={handleSave}
            disabled={configureMutation.isPending || !isDirty}
            busy={configureMutation.isPending}
          >
            {configureMutation.isPending
              ? t('slots.saving')
              : isDirty
                ? t('slots.save')
                : t('slots.noChanges')}
          </AppButton>
          <AppButton
            variant="neutral"
            onPress={() => router.back()}
            disabled={configureMutation.isPending}
          >
            {t('common.cancel')}
          </AppButton>
        </GapView>
      }
    >
      <GapView gap="md">
        <AppSelect
          value={slotDurationMinutes}
          onChangeValue={setSlotDurationMinutes}
          options={durationSelectOptions}
          label={t('slots.durationLabel')}
          placeholder={t('slots.durationPlaceholder')}
        />

        <GapView gap="sm">
          <AppTypography variant="subtitle2" accessibilityRole="header">
            {t('slots.week')}
          </AppTypography>
          <View
            style={{
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.grayscale[3],
              backgroundColor: theme.colors.surface,
              overflow: 'hidden',
            }}
          >
            {DAY_ORDER.map((day, index) => {
              const hours = week[day];
              const isExpanded = expanded === day && hours.open;
              const error = submitted || isExpanded ? errors[day] : undefined;
              const open = toMinutes(hours.openTime, 'open');
              const close = toMinutes(hours.closeTime, 'close');
              const turns =
                open !== null && close !== null && close > open
                  ? Math.floor((close - open) / duration)
                  : 0;
              return (
                <View
                  key={day}
                  style={{
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: theme.grayscale[3],
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingRight: theme.spacing.md,
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        if (!hours.open) {
                          toggleDay(day, true);
                          return;
                        }
                        setExpanded(isExpanded ? null : day);
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: isExpanded }}
                      accessibilityLabel={`${dayLabel(day, t)}, ${hoursLabel(hours, t)}`}
                      accessibilityHint={
                        hours.open ? t('slots.dayShowHint') : t('slots.dayOpenHint')
                      }
                      style={({ pressed }) => ({
                        flex: 1,
                        minHeight: 56,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: theme.spacing.sm,
                        paddingLeft: theme.spacing.md,
                        paddingVertical: theme.spacing.sm,
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Text
                        style={{
                          width: 96,
                          color: hours.open ? theme.colors.text : theme.colors.muted,
                          fontFamily: labelType.nativeFamily,
                          fontSize: bodyType.fontSize,
                        }}
                      >
                        {dayLabel(day, t)}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          color: error
                            ? theme.colors.error
                            : hours.open
                              ? theme.colors.text
                              : theme.colors.muted,
                          fontFamily: bodyType.nativeFamily,
                          fontSize: bodyType.fontSize,
                          fontVariant: ['tabular-nums'],
                        }}
                      >
                        {hoursLabel(hours, t)}
                      </Text>
                      {hours.open ? (
                        <Feather
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={theme.colors.muted}
                        />
                      ) : null}
                    </Pressable>
                    <Switch
                      value={hours.open}
                      onValueChange={(value) => toggleDay(day, value)}
                      accessibilityLabel={t('slots.dayOpenA11y', { day: dayLabel(day, t) })}
                      trackColor={{ true: theme.colors.brandPrimary, false: theme.grayscale[3] }}
                      style={{ marginLeft: theme.spacing.sm }}
                    />
                  </View>

                  {isExpanded ? (
                    <View
                      style={{
                        paddingHorizontal: theme.spacing.md,
                        paddingBottom: theme.spacing.md,
                        gap: theme.spacing.sm,
                      }}
                    >
                      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                        <View style={{ flex: 1 }}>
                          <AppSelect
                            value={hours.openTime}
                            onChangeValue={(value) => updateDay(day, { openTime: value })}
                            options={timeOptions(step, 'open', hours.openTime, t)}
                            label={t('slots.opens')}
                            placeholder={t('slots.timePlaceholder')}
                            searchPlaceholder={t('slots.searchOpen')}
                            error={Boolean(error)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <AppSelect
                            value={hours.closeTime}
                            onChangeValue={(value) => updateDay(day, { closeTime: value })}
                            options={timeOptions(step, 'close', hours.closeTime, t)}
                            label={t('slots.closes')}
                            placeholder={t('slots.timePlaceholder')}
                            searchPlaceholder={t('slots.searchClose')}
                            error={Boolean(error)}
                          />
                        </View>
                      </View>
                      {error ? (
                        <FormError message={error} />
                      ) : (
                        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
                          {t('slots.turns', { count: turns, minutes: duration })}
                        </Text>
                      )}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </GapView>

        <GapView gap="sm">
          <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
            {presetSource
              ? t('slots.copyHours', {
                  hours: `${presetHours.openTime}–${closeLabel(presetHours.closeTime, t)}`,
                  day: dayLabel(presetSource, t),
                })
              : t('slots.openFromTo', { open: DEFAULT_OPEN, close: DEFAULT_CLOSE })}
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <View style={{ flex: 1 }}>
              <AppButton variant="neutral" onPress={() => applyPreset(WEEKDAYS)}>
                {t('slots.weekdays')}
              </AppButton>
            </View>
            <View style={{ flex: 1 }}>
              <AppButton variant="neutral" onPress={() => applyPreset(DAY_ORDER)}>
                {t('slots.everyDay')}
              </AppButton>
            </View>
          </View>
        </GapView>
      </GapView>
    </Screen>
  );
}
