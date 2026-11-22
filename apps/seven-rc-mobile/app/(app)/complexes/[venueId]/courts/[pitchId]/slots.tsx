import { useMemo, useState } from 'react';
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

/** Monday-first display order; `dayOfWeek` stays 0=Sunday per the API. */
const DAY_ORDER = ['1', '2', '3', '4', '5', '6', '0'] as const;
const WEEKDAYS = ['1', '2', '3', '4', '5'] as const;
type DayKey = (typeof DAY_ORDER)[number];

const DAY_LABELS: Record<DayKey, string> = {
  '1': 'Lunes',
  '2': 'Martes',
  '3': 'Miércoles',
  '4': 'Jueves',
  '5': 'Viernes',
  '6': 'Sábado',
  '0': 'Domingo',
};

/** Same options as court creation so both screens speak one vocabulary. */
const durationOptions = [
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '60 minutos' },
  { value: '75', label: '75 minutos' },
  { value: '90', label: '90 minutos' },
  { value: '120', label: '120 minutos' },
] as const;

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

function closeLabel(value: string) {
  return value === MIDNIGHT ? '00:00 (medianoche)' : value;
}

function hoursLabel(day: DayHours) {
  return day.open
    ? `${day.openTime}–${day.closeTime === MIDNIGHT ? '24:00' : day.closeTime}`
    : 'Cerrado';
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

function dayError(day: DayHours): string | null {
  if (!day.open) return null;
  const open = toMinutes(day.openTime, 'open');
  const close = toMinutes(day.closeTime, 'close');
  if (open === null || close === null) return 'Elige una hora de apertura y una de cierre.';
  if (close <= open) return 'El cierre debe ser después de la apertura.';
  return null;
}

/**
 * Times on a grid that lines up with the turn length: 30-minute steps for
 * durations that are multiples of 30, else 15. Off-grid saved values are kept.
 */
function timeOptions(step: number, field: 'open' | 'close', current: string) {
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
    label: field === 'close' ? closeLabel(value) : value,
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
  const { venueId, pitchId } = useRouteIds();
  const pitchesQuery = useOwnerVenuePitchesQuery(venueId);
  const pitch = useMemo(
    () => (pitchesQuery.data ?? []).find((item) => item.id === pitchId),
    [pitchesQuery.data, pitchId],
  );

  // The form mounts only once the pitch is loaded, so its initial state is the
  // pitch's real configuration. Saving a default week over a configured pitch
  // is impossible because Guardar does not exist until then.
  if (pitch && venueId) {
    return <PitchSlotsForm key={pitch.id} pitch={pitch} venueId={venueId} />;
  }

  const subtitle = 'Define qué días y a qué horas abre la cancha.';

  // A court created seconds ago arrives with the post-mutation refetch.
  if (pitchesQuery.isLoading || (!pitchesQuery.error && pitchesQuery.isFetching)) {
    return (
      <Screen title="Horarios" subtitle={subtitle}>
        <View accessibilityLabel="Cargando horarios de la cancha" accessible>
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
      <Screen title="Horarios" subtitle={subtitle}>
        <AppAlert
          variant="warning"
          title="No pudimos cargar los horarios"
          description={`${humanizeError(pitchesQuery.error, 'load')} No guardes cambios hasta ver la configuración actual.`}
          action={
            <AppButton
              variant="warning"
              disabled={pitchesQuery.isFetching}
              onPress={() => {
                void pitchesQuery.refetch();
              }}
            >
              {pitchesQuery.isFetching ? 'Reintentando…' : 'Reintentar'}
            </AppButton>
          }
        />
      </Screen>
    );
  }

  return (
    <Screen title="Horarios" subtitle={subtitle}>
      <GapView gap="md">
        <AppAlert
          variant="warning"
          title="No encontramos esta cancha"
          description="Puede que la hayan eliminado. Vuelve al complejo y elígela otra vez."
        />
        <AppButton
          variant="neutral"
          onPress={() => router.replace(venueId ? `/complexes/${venueId}` : '/home')}
        >
          Volver al complejo
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
      const message = dayError(week[day]);
      if (message) result[day] = message;
    }
    return result;
  }, [week]);
  const hasErrors = Object.keys(errors).length > 0;
  const openDays = DAY_ORDER.filter((day) => week[day].open);

  // Back gesture, Android Back and Cancelar all land here while there are edits.
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
      if (confirmFn?.('¿Salir sin guardar? Perderás los cambios en los horarios.')) discard();
      return;
    }
    Alert.alert('¿Salir sin guardar?', 'Perderás los cambios en los horarios.', [
      { text: 'Seguir editando', style: 'cancel' },
      { text: 'Descartar cambios', style: 'destructive', onPress: discard },
    ]);
  });

  // A legacy duration outside the preset list must still show as selected.
  const durationSelectOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [...durationOptions];
    if (!options.some((option) => option.value === slotDurationMinutes)) {
      options.push({ value: slotDurationMinutes, label: `${slotDurationMinutes} minutos` });
      options.sort((a, b) => Number(a.value) - Number(b.value));
    }
    return options;
  }, [slotDurationMinutes]);

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
      feedback.success('Horarios guardados', 'La cancha quedó configurada.');
      setLeaving(true);
      disablePrevention();
      // Back to the complex already on the stack, instead of a second copy of it.
      router.dismissTo(`/complexes/${venueId}`);
    } catch (error) {
      setSaveError(humanizeError(error, 'save'));
    }
  };

  const handleSave = () => {
    setSubmitted(true);
    setSaveError(null);
    if (hasErrors) {
      const firstWithError = DAY_ORDER.find((day) => errors[day]);
      if (firstWithError) setExpanded(firstWithError);
      setSaveError('Revisa los días en rojo: el cierre debe ser después de la apertura.');
      return;
    }

    const removedDays = DAY_ORDER.filter((day) => initialWeek[day].open && !week[day].open);

    if (openDays.length === 0) {
      confirmDestructive(
        {
          title: '¿Dejar la cancha sin horarios?',
          message: 'Nadie podrá reservar esta cancha hasta que abras al menos un día.',
          confirmText: 'Guardar sin horarios',
          cancelText: 'Seguir editando',
        },
        () => void save(),
      );
      return;
    }

    if (removedDays.length > 0) {
      confirmDestructive(
        {
          title: '¿Cerrar estos días?',
          message: `${removedDays.map((day) => DAY_LABELS[day]).join(', ')} ya no aceptarán reservas nuevas. Las reservas existentes se mantienen.`,
          confirmText: 'Cerrar y guardar',
          cancelText: 'Seguir editando',
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
      title="Horarios"
      subtitle={`${pitch.name}: toca un día para cambiar sus horas.`}
      footer={
        <GapView gap="sm">
          <FormError message={saveError} />
          <AppButton
            onPress={handleSave}
            disabled={configureMutation.isPending || !isDirty}
            busy={configureMutation.isPending}
          >
            {configureMutation.isPending
              ? 'Guardando…'
              : isDirty
                ? 'Guardar horarios'
                : 'Sin cambios'}
          </AppButton>
          <AppButton
            variant="neutral"
            onPress={() => router.back()}
            disabled={configureMutation.isPending}
          >
            Cancelar
          </AppButton>
        </GapView>
      }
    >
      <GapView gap="md">
        <AppSelect
          value={slotDurationMinutes}
          onChangeValue={setSlotDurationMinutes}
          options={durationSelectOptions}
          label="Duración por turno"
          placeholder="Seleccionar duración"
        />

        <GapView gap="sm">
          <AppTypography variant="subtitle2" accessibilityRole="header">
            Semana
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
                      accessibilityLabel={`${DAY_LABELS[day]}, ${hoursLabel(hours)}`}
                      accessibilityHint={
                        hours.open ? 'Muestra las horas de este día' : 'Abre este día'
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
                        {DAY_LABELS[day]}
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
                        {hoursLabel(hours)}
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
                      accessibilityLabel={`${DAY_LABELS[day]} abierto`}
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
                            options={timeOptions(step, 'open', hours.openTime)}
                            label="Abre"
                            placeholder="Hora"
                            searchPlaceholder="Buscar hora, ej. 08:00"
                            error={Boolean(error)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <AppSelect
                            value={hours.closeTime}
                            onChangeValue={(value) => updateDay(day, { closeTime: value })}
                            options={timeOptions(step, 'close', hours.closeTime)}
                            label="Cierra"
                            placeholder="Hora"
                            searchPlaceholder="Buscar hora, ej. 22:00"
                            error={Boolean(error)}
                          />
                        </View>
                      </View>
                      {error ? (
                        <FormError message={error} />
                      ) : (
                        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
                          {turns === 1
                            ? `1 turno de ${duration} min.`
                            : `${turns} turnos de ${duration} min.`}
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
              ? `Copiar ${presetHours.openTime}–${closeLabel(presetHours.closeTime)} (${DAY_LABELS[presetSource]}) a:`
              : `Abrir de ${DEFAULT_OPEN} a ${DEFAULT_CLOSE}:`}
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <View style={{ flex: 1 }}>
              <AppButton variant="neutral" onPress={() => applyPreset(WEEKDAYS)}>
                Lunes a viernes
              </AppButton>
            </View>
            <View style={{ flex: 1 }}>
              <AppButton variant="neutral" onPress={() => applyPreset(DAY_ORDER)}>
                Todos los días
              </AppButton>
            </View>
          </View>
        </GapView>
      </GapView>
    </Screen>
  );
}
