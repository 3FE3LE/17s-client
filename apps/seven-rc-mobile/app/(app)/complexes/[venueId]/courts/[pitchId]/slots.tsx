import { useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { Pitch } from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppButton,
  AppSelect,
  AppSkeleton,
  GapView,
  useAppTheme,
  useAppToast,
} from '@17suit/ui';
import {
  useOwnerVenuePitchesQuery,
  useConfigurePitchSlotsMutation,
} from '../../../../../../lib/owner-queries';
import { humanizeError } from '../../../../../../lib/error-messages';
import { confirmDestructive } from '../../../../../../lib/confirm';
import { Text, View } from 'react-native';
import { Screen } from '../../../../../../components/screen';

const dayOptions = [
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miércoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
  { value: '6', label: 'Sábado' },
  { value: '0', label: 'Domingo' },
] as const;

/** Monday-first display order; `dayOfWeek` stays 0=Sunday per the API. */
const DAY_ORDER = ['1', '2', '3', '4', '5', '6', '0'] as const;
const WEEKDAYS = ['1', '2', '3', '4', '5'] as const;

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

interface HoursRow {
  /** Stable client id so React keys survive reordering and removal. */
  id: number;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

type RowErrors = Record<number, string[]>;

function dayLabel(dayOfWeek: string) {
  return dayOptions.find((option) => option.value === dayOfWeek)?.label ?? dayOfWeek;
}

function dayRank(dayOfWeek: string) {
  const rank = DAY_ORDER.indexOf(dayOfWeek as (typeof DAY_ORDER)[number]);
  return rank === -1 ? DAY_ORDER.length : rank;
}

function formatTime24(value: Date) {
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** Picker seed at the row's own value, not at "now". */
function timeToDate(value: string) {
  const date = new Date();
  const match = TIME_PATTERN.exec(value);
  date.setHours(match ? Number(match[1]) : 10, match ? Number(match[2]) : 0, 0, 0);
  return date;
}

/** Minutes since midnight. A close of `00:00` means midnight (end of day), per the API. */
function toMinutes(value: string, field: 'open' | 'close') {
  const match = TIME_PATTERN.exec(value);
  if (!match) return null;
  const minutes = Number(match[1]) * 60 + Number(match[2]);
  return field === 'close' && minutes === 0 ? 24 * 60 : minutes;
}

function rowsFromPitch(pitch: Pitch): HoursRow[] {
  return Object.entries(pitch.openingHours ?? {})
    .filter(([, hours]) => Boolean(hours?.openTime && hours?.closeTime))
    .map(([dayOfWeek, hours]) => ({
      dayOfWeek,
      openTime: hours.openTime ?? DEFAULT_OPEN,
      closeTime: hours.closeTime ?? DEFAULT_CLOSE,
    }))
    .sort((a, b) => dayRank(a.dayOfWeek) - dayRank(b.dayOfWeek))
    .map((row, index) => ({ ...row, id: index }));
}

function validateRows(rows: HoursRow[]): RowErrors {
  const errors: RowErrors = {};
  const seen = new Set<string>();
  for (const row of rows) {
    const list: string[] = [];
    const open = toMinutes(row.openTime, 'open');
    const close = toMinutes(row.closeTime, 'close');
    if (open === null || close === null) {
      list.push('Elige una hora de apertura y una de cierre.');
    } else if (close <= open) {
      list.push('El cierre debe ser después de la apertura.');
    }
    if (seen.has(row.dayOfWeek)) {
      list.push(
        `${dayLabel(row.dayOfWeek)} ya está en la lista. Elige otro día o quita esta fila.`,
      );
    }
    seen.add(row.dayOfWeek);
    if (list.length > 0) errors[row.id] = list;
  }
  return errors;
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

  if (pitchesQuery.isLoading) {
    return (
      <Screen title="Horarios" subtitle={subtitle}>
        <GapView gap="md">
          <View accessibilityLabel="Cargando horarios de la cancha" accessible>
            <GapView gap="md">
              <AppSkeleton height={56} rounded="md" />
              <AppSkeleton height={168} rounded="md" />
              <AppSkeleton height={168} rounded="md" />
            </GapView>
          </View>
        </GapView>
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
  const toast = useAppToast();
  const { theme } = useAppTheme();

  const initialRows = useMemo(() => rowsFromPitch(pitch), [pitch]);
  const initialDays = useMemo(
    () => new Set(initialRows.map((row) => row.dayOfWeek)),
    [initialRows],
  );
  const nextId = useRef(initialRows.length);

  const [slotDurationMinutes, setSlotDurationMinutes] = useState(String(pitch.slotDurationMinutes));
  const [rows, setRows] = useState<HoursRow[]>(initialRows);
  const [picker, setPicker] = useState<{ id: number; field: 'open' | 'close' } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const configureMutation = useConfigurePitchSlotsMutation(pitch.id, venueId);

  const rowErrors = useMemo(() => validateRows(rows), [rows]);
  const hasErrors = Object.keys(rowErrors).length > 0;

  // A legacy duration outside the preset list must still show as selected.
  const durationSelectOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [...durationOptions];
    if (!options.some((option) => option.value === slotDurationMinutes)) {
      options.push({ value: slotDurationMinutes, label: `${slotDurationMinutes} minutos` });
      options.sort((a, b) => Number(a.value) - Number(b.value));
    }
    return options;
  }, [slotDurationMinutes]);

  const makeRow = (dayOfWeek: string, openTime: string, closeTime: string): HoursRow => {
    const id = nextId.current;
    nextId.current += 1;
    return { id, dayOfWeek, openTime, closeTime };
  };

  const updateRow = (id: number, patch: Partial<Omit<HoursRow, 'id'>>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    setRows((prev) => {
      const used = new Set(prev.map((row) => row.dayOfWeek));
      const nextDay = DAY_ORDER.find((day) => !used.has(day)) ?? '1';
      const template = prev[prev.length - 1];
      return [
        ...prev,
        makeRow(nextDay, template?.openTime ?? DEFAULT_OPEN, template?.closeTime ?? DEFAULT_CLOSE),
      ];
    });
  };

  /** Fill the given days with the first row's hours (or the default hours). */
  const applyPreset = (days: readonly string[]) => {
    setRows((prev) => {
      const source = prev[0];
      const openTime = source?.openTime ?? DEFAULT_OPEN;
      const closeTime = source?.closeTime ?? DEFAULT_CLOSE;
      return days.map((day) => makeRow(day, openTime, closeTime));
    });
  };

  const save = async () => {
    try {
      await configureMutation.mutateAsync({
        slotDurationMinutes: Number(slotDurationMinutes),
        openingHours: rows.map((row) => ({
          dayOfWeek: Number(row.dayOfWeek),
          openTime: row.openTime,
          closeTime: row.closeTime,
        })),
      });
      toast.success('Horarios guardados', 'La cancha quedó configurada.');
      router.replace(`/complexes/${venueId}`);
    } catch (error) {
      toast.error('No se pudieron guardar los horarios', humanizeError(error, 'save'));
    }
  };

  const handleSave = () => {
    setSubmitted(true);
    if (hasErrors) {
      toast.error('Revisa los horarios', 'Hay días con errores marcados en rojo.');
      return;
    }

    const currentDays = new Set(rows.map((row) => row.dayOfWeek));
    const removedDays = DAY_ORDER.filter((day) => initialDays.has(day) && !currentDays.has(day));

    if (rows.length === 0) {
      confirmDestructive(
        {
          title: '¿Dejar la cancha sin horarios?',
          message:
            'Nadie podrá reservar esta cancha hasta que vuelvas a agregar al menos un día.' +
            (removedDays.length > 0
              ? `\n\nSe quitarán: ${removedDays.map(dayLabel).join(', ')}.`
              : ''),
          confirmText: 'Dejar la cancha sin horarios',
          cancelText: 'Seguir editando',
        },
        () => void save(),
      );
      return;
    }

    if (removedDays.length > 0) {
      confirmDestructive(
        {
          title: '¿Quitar estos días?',
          message: `Se quitarán: ${removedDays.map(dayLabel).join(', ')}. Esos días ya no aceptarán reservas nuevas.`,
          confirmText: 'Quitar y guardar',
          cancelText: 'Seguir editando',
        },
        () => void save(),
      );
      return;
    }

    void save();
  };

  const pickerRow = picker ? rows.find((row) => row.id === picker.id) : undefined;
  const errorText = { color: theme.colors.error, fontSize: 12, lineHeight: 18 } as const;

  return (
    <Screen
      title="Horarios"
      subtitle={`${pitch.name}: define qué días y a qué horas abre la cancha.`}
      footer={
        <GapView gap="sm">
          <AppButton onPress={handleSave} disabled={configureMutation.isPending}>
            {configureMutation.isPending ? 'Guardando…' : 'Guardar horarios'}
          </AppButton>
          <AppButton variant="neutral" onPress={() => router.back()}>
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

        {rows.length === 0 ? (
          <Text style={{ color: theme.colors.muted, fontSize: 14, lineHeight: 20 }}>
            Esta cancha todavía no tiene horarios. Agrega un día o usa un atajo.
          </Text>
        ) : null}

        <GapView gap="sm">
          {rows.map((row) => {
            const errors = submitted ? rowErrors[row.id] : undefined;
            return (
              <View
                key={row.id}
                style={{
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: errors ? theme.colors.error : theme.grayscale[3],
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.md,
                  gap: theme.spacing.sm,
                }}
              >
                <AppSelect
                  value={row.dayOfWeek}
                  onChangeValue={(value) => updateRow(row.id, { dayOfWeek: value })}
                  options={dayOptions as unknown as { value: string; label: string }[]}
                  label="Día"
                  placeholder="Seleccionar día"
                  error={Boolean(errors)}
                />
                <AppButton
                  variant="neutral"
                  onPress={() => setPicker({ id: row.id, field: 'open' })}
                >
                  {`Apertura: ${row.openTime}`}
                </AppButton>
                <AppButton
                  variant="neutral"
                  onPress={() => setPicker({ id: row.id, field: 'close' })}
                >
                  {`Cierre: ${row.closeTime === '00:00' ? '00:00 (medianoche)' : row.closeTime}`}
                </AppButton>
                {errors ? (
                  <View accessibilityLiveRegion="polite" accessibilityRole="alert">
                    {errors.map((message) => (
                      <Text key={message} style={errorText}>
                        {message}
                      </Text>
                    ))}
                  </View>
                ) : null}
                <AppButton
                  variant="destructive"
                  onPress={() => setRows((prev) => prev.filter((item) => item.id !== row.id))}
                >
                  {`Quitar ${dayLabel(row.dayOfWeek)}`}
                </AppButton>
              </View>
            );
          })}
        </GapView>

        <AppButton variant="neutral" onPress={addRow} disabled={rows.length >= DAY_ORDER.length}>
          Agregar día
        </AppButton>
        <GapView gap="sm">
          <Text style={{ color: theme.colors.muted, fontSize: 12, lineHeight: 18 }}>
            {rows[0]
              ? `Atajos: copian ${rows[0].openTime}–${rows[0].closeTime} (primer día de la lista).`
              : `Atajos: usan ${DEFAULT_OPEN}–${DEFAULT_CLOSE}.`}
          </Text>
          <AppButton variant="neutral" onPress={() => applyPreset(WEEKDAYS)}>
            Lunes a viernes
          </AppButton>
          <AppButton variant="neutral" onPress={() => applyPreset(DAY_ORDER)}>
            Copiar a todos los días
          </AppButton>
        </GapView>
      </GapView>

      {picker && pickerRow ? (
        <DateTimePicker
          value={timeToDate(picker.field === 'open' ? pickerRow.openTime : pickerRow.closeTime)}
          mode="time"
          is24Hour
          onChange={(event, value) => {
            if (event.type === 'dismissed' || !value) {
              setPicker(null);
              return;
            }
            const formatted = formatTime24(value);
            updateRow(
              picker.id,
              picker.field === 'open' ? { openTime: formatted } : { closeTime: formatted },
            );
            setPicker(null);
          }}
        />
      ) : null}
    </Screen>
  );
}
