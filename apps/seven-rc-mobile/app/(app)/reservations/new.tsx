import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import {
  AppAlert,
  AppButton,
  AppInput,
  AppSelect,
  AppSkeleton,
  AppTypography,
  GapView,
  useAppToast,
  useAppTheme,
} from '@17suit/ui';
import {
  usePitchAvailabilityQuery,
  usePlayerVenuePitchesQuery,
  usePlayerVenuesQuery,
  useCreateReservationMutation,
} from '../../../lib/player-queries';
import { Pressable, Text, View } from 'react-native';
import { Screen } from '../../../components/screen';
import { humanizeError } from '../../../lib/error-messages';

const reservationSchema = z.object({
  pitchId: z.string().trim().min(1, 'Selecciona una cancha.'),
  slotCount: z.string().trim().min(1, 'Selecciona la cantidad de turnos.'),
  invitedCount: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

function toOptionalNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.max(0, Math.floor(parsed));
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(value);
}

function formatTime(value: Date) {
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** Wall-clock Date -> venue-local `YYYY-MM-DD` (the availability API's date key). */
function toDateKey(value: Date) {
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${day}`;
}

/** `HH:MM` on the wall-clock day `day` -> wall-clock Date. */
function wallTimeOn(day: Date, hhmm: string) {
  const [hours, minutes] = hhmm.split(':').map((part) => Number(part));
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours ?? 0, minutes ?? 0);
}

function formatPrice(minor: number, currency: string) {
  if (!minor) return null;
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(minor / 100);
  } catch {
    return null;
  }
}

const FALLBACK_TIMEZONE = 'America/Bogota';

function resolveTimeZone(timeZone?: string | null) {
  if (!timeZone) return FALLBACK_TIMEZONE;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(0);
    return timeZone;
  } catch {
    return FALLBACK_TIMEZONE;
  }
}

/**
 * Wall-clock fields of `instant` in `timeZone`, packed into a device-local Date
 * so the pickers and `toLocale*String` show the venue's local time.
 */
function toVenueWallClock(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? '0');
  return new Date(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') % 24,
    get('minute'),
    get('second'),
  );
}

/** Offset (ms) of `timeZone` from UTC at `instantMs`. */
function timeZoneOffsetMs(instantMs: number, timeZone: string) {
  const wall = toVenueWallClock(new Date(instantMs), timeZone);
  const wallAsUtc = Date.UTC(
    wall.getFullYear(),
    wall.getMonth(),
    wall.getDate(),
    wall.getHours(),
    wall.getMinutes(),
    wall.getSeconds(),
  );
  return wallAsUtc - Math.floor(instantMs / 1000) * 1000;
}

/** Combine a venue-local date and time (wall-clock Dates) into a real UTC instant. */
function buildVenueInstant(date: Date, time: Date, timeZone: string) {
  const wallAsUtc = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    0,
    0,
  );
  const firstGuess = wallAsUtc - timeZoneOffsetMs(wallAsUtc, timeZone);
  return new Date(wallAsUtc - timeZoneOffsetMs(firstGuess, timeZone));
}

/** Next slot boundary (multiples of `slotMinutes` from venue midnight) after `wallNow`. */
function nextSlotBoundary(wallNow: Date, slotMinutes: number) {
  const step = Math.max(1, slotMinutes);
  const minutesOfDay = wallNow.getHours() * 60 + wallNow.getMinutes();
  const next = Math.floor(minutesOfDay / step) * step + step;
  return new Date(wallNow.getFullYear(), wallNow.getMonth(), wallNow.getDate(), 0, next, 0, 0);
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function addMinutes(value: Date, minutes: number) {
  const next = new Date(value.getTime());
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

export default function NewReservationScreen() {
  const router = useRouter();
  const toast = useAppToast();
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<{
    venueId?: string | string[];
    pitchId?: string | string[];
  }>();
  const venueId = Array.isArray(params.venueId) ? params.venueId[0] : params.venueId;
  const pitchIdParam = Array.isArray(params.pitchId) ? params.pitchId[0] : params.pitchId;

  const pitchesQuery = usePlayerVenuePitchesQuery(venueId ?? null);
  // Same query key as the home venue list, so this is normally a cache hit.
  const venuesQuery = usePlayerVenuesQuery();
  const venue = venuesQuery.data?.find((item) => item.id === venueId);
  const venueTimeZone = resolveTimeZone(venue?.timezone);
  const createReservation = useCreateReservationMutation();
  // null = not picked yet; the default is derived from availability or "now" in the venue tz.
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [pickedStartTime, setPickedStartTime] = useState<Date | null>(null);
  const [pickerMode, setPickerMode] = useState<'date' | 'start' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pitchOptions = useMemo(
    () =>
      (pitchesQuery.data ?? []).map((pitch) => ({
        value: pitch.id,
        label: pitch.name,
      })),
    [pitchesQuery.data],
  );

  const { control, handleSubmit, formState, watch } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    mode: 'onChange',
    defaultValues: {
      pitchId: pitchIdParam ?? '',
      slotCount: '1',
      invitedCount: '0',
      notes: '',
    },
  });

  const selectedPitchId = watch('pitchId');
  const selectedSlotCount = watch('slotCount');
  const selectedPitch = useMemo(
    () => (pitchesQuery.data ?? []).find((pitch) => pitch.id === selectedPitchId),
    [pitchesQuery.data, selectedPitchId],
  );
  const slotDuration = selectedPitch?.slotDurationMinutes ?? 60;
  const slotCountValue = Number(selectedSlotCount || '1');

  const now = new Date();
  const venueToday = startOfDay(toVenueWallClock(now, venueTimeZone));
  const defaultStart = nextSlotBoundary(toVenueWallClock(now, venueTimeZone), slotDuration);
  const selectedDate = pickedDate ?? startOfDay(defaultStart);
  const dateKey = toDateKey(selectedDate);

  const availabilityQuery = usePitchAvailabilityQuery(selectedPitchId || null, dateKey);
  const slots = availabilityQuery.data?.slots ?? [];
  const availableSlots = slots.filter((slot) => slot.status === 'AVAILABLE');
  const firstAvailable = availableSlots[0];
  const currency = availabilityQuery.data?.currency ?? 'COP';

  const startTime =
    pickedStartTime ??
    (firstAvailable ? wallTimeOn(selectedDate, firstAvailable.localStartTime) : defaultStart);
  const startKey = formatTime(startTime);
  const startAtDate = buildVenueInstant(selectedDate, startTime, venueTimeZone);
  const endAtDate = addMinutes(startAtDate, Math.max(1, slotCountValue) * slotDuration);
  const estimatedEndWall = addMinutes(
    new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
    ),
    Math.max(1, slotCountValue) * slotDuration,
  );
  const isStartInPast = startAtDate.getTime() <= now.getTime();
  const hasAvailability = Boolean(availabilityQuery.data);
  const isNoSlotsDay = hasAvailability && availableSlots.length === 0;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!venueId) {
      setSubmitError('No encontramos el complejo. Vuelve al inicio y elígelo otra vez.');
      return;
    }
    if (startAtDate.getTime() <= Date.now()) return;
    if (endAtDate <= startAtDate) {
      setSubmitError('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    try {
      const created = await createReservation.mutateAsync({
        pitchId: values.pitchId,
        startAt: startAtDate.toISOString(),
        endAt: endAtDate.toISOString(),
        invitedCount: toOptionalNumber(values.invitedCount),
        notes: values.notes?.trim() || undefined,
      });
      if (created.status === 'pending_confirmation') {
        toast.success('Reserva enviada', 'El complejo debe confirmarla.');
      } else {
        toast.success('Reserva creada', 'Revisa los detalles de tu reserva.');
      }
      router.replace(`/reservations/${created.id}`);
    } catch (error) {
      setSubmitError(humanizeError(error, 'create'));
    }
  });

  const isSubmitting = formState.isSubmitting || createReservation.isPending;
  const chipLabelType = theme.typography.styles.button;

  return (
    <Screen
      title="Nueva reserva"
      {...(venue?.name ? { subtitle: venue.name } : {})}
      footer={
        <>
          {submitError ? (
            <Text
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              style={{ color: theme.colors.error, fontSize: 13, lineHeight: 18 }}
            >
              {submitError}
            </Text>
          ) : null}
          <AppButton
            onPress={onSubmit}
            disabled={!formState.isValid || isSubmitting || isStartInPast}
          >
            {isSubmitting
              ? 'Reservando…'
              : `Confirmar · ${formatTime(startTime)}–${formatTime(estimatedEndWall)}`}
          </AppButton>
        </>
      }
    >
      <GapView gap="md">
        <Controller
          control={control}
          name="pitchId"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={(value) => {
                  field.onChange(value);
                  setPickedStartTime(null);
                }}
                options={pitchOptions}
                label="Cancha"
                placeholder={pitchesQuery.isLoading ? 'Cargando canchas…' : 'Seleccionar cancha'}
                error={fieldState.invalid}
              />
              {fieldState.error ? (
                <Text
                  accessibilityLiveRegion="polite"
                  style={{ color: theme.colors.error, fontSize: 13, lineHeight: 18 }}
                >
                  {fieldState.error.message}
                </Text>
              ) : null}
            </>
          )}
        />

        <AppButton variant="neutral" onPress={() => setPickerMode('date')}>
          {`Fecha: ${formatDate(selectedDate)}`}
        </AppButton>

        <GapView gap="sm">
          <AppTypography variant="subtitle2">Hora de inicio</AppTypography>
          <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
            {`Hora del complejo (${venueTimeZone})`}
          </Text>

          {!selectedPitchId ? (
            <Text style={{ color: theme.colors.muted, fontSize: 14, lineHeight: 20 }}>
              Elige una cancha para ver los horarios libres.
            </Text>
          ) : null}

          {selectedPitchId && availabilityQuery.isLoading ? (
            <AppSkeleton height={44} rounded="md" />
          ) : null}

          {availabilityQuery.error ? (
            <AppAlert
              variant="warning"
              title="No pudimos cargar los horarios libres"
              description={`${humanizeError(availabilityQuery.error, 'load')} Puedes elegir la hora a mano.`}
              action={
                <AppButton
                  variant="warning"
                  onPress={() => {
                    void availabilityQuery.refetch();
                  }}
                >
                  Reintentar
                </AppButton>
              }
            />
          ) : null}

          {isNoSlotsDay ? (
            <Text style={{ color: theme.colors.muted, fontSize: 14, lineHeight: 20 }}>
              No quedan horarios libres este día. Prueba otra fecha.
            </Text>
          ) : null}

          {availableSlots.length > 0 ? (
            <View
              accessibilityRole="radiogroup"
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}
            >
              {availableSlots.map((slot) => {
                const isSelected = slot.localStartTime === startKey;
                const price = formatPrice(slot.priceMinor, currency);
                return (
                  <Pressable
                    key={slot.startAt}
                    onPress={() =>
                      setPickedStartTime(wallTimeOn(selectedDate, slot.localStartTime))
                    }
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={
                      price ? `${slot.localStartTime}, ${price}` : slot.localStartTime
                    }
                    style={({ pressed }) => ({
                      minHeight: 44,
                      minWidth: 76,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.xs,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: theme.borderRadius.md,
                      borderWidth: 1,
                      borderColor: isSelected ? theme.colors.brandPrimary : theme.grayscale[3],
                      backgroundColor: isSelected
                        ? theme.colors.brandPrimary
                        : theme.colors.surface,
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Text
                      style={{
                        color: isSelected ? theme.colors.brandDark : theme.colors.text,
                        fontFamily: chipLabelType.nativeFamily,
                        fontSize: chipLabelType.fontSize,
                        fontVariant: ['tabular-nums'],
                      }}
                    >
                      {slot.localStartTime}
                    </Text>
                    {price ? (
                      <Text
                        style={{
                          color: isSelected ? theme.colors.brandDark : theme.colors.muted,
                          fontSize: 12,
                          lineHeight: 16,
                          fontVariant: ['tabular-nums'],
                        }}
                      >
                        {price}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          {selectedPitchId ? (
            <AppButton variant="neutral" onPress={() => setPickerMode('start')}>
              {hasAvailability && availableSlots.length > 0
                ? 'Elegir otra hora'
                : `Inicio: ${formatTime(startTime)}`}
            </AppButton>
          ) : null}
        </GapView>

        <Controller
          control={control}
          name="slotCount"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={field.onChange}
                options={[
                  { value: '1', label: `1 turno (${slotDuration} min)` },
                  { value: '2', label: `2 turnos (${slotDuration * 2} min)` },
                  { value: '3', label: `3 turnos (${slotDuration * 3} min)` },
                  { value: '4', label: `4 turnos (${slotDuration * 4} min)` },
                ]}
                label="Duración"
                placeholder="Seleccionar turnos"
                error={fieldState.invalid}
              />
              {fieldState.error ? (
                <Text
                  accessibilityLiveRegion="polite"
                  style={{ color: theme.colors.error, fontSize: 13, lineHeight: 18 }}
                >
                  {fieldState.error.message}
                </Text>
              ) : null}
            </>
          )}
        />

        {isStartInPast ? (
          <Text
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={{ color: theme.colors.error, fontSize: 13, lineHeight: 18 }}
          >
            Ese horario ya pasó. Elige una hora de inicio posterior.
          </Text>
        ) : null}

        <Pressable
          onPress={() => setShowDetails((current) => !current)}
          accessibilityRole="button"
          accessibilityState={{ expanded: showDetails }}
          style={{
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <Feather name={showDetails ? 'chevron-up' : 'plus'} size={18} color={theme.colors.text} />
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: chipLabelType.nativeFamily,
              fontSize: chipLabelType.fontSize,
            }}
          >
            {showDetails ? 'Ocultar detalles' : 'Agregar detalles (invitados, notas)'}
          </Text>
        </Pressable>

        {showDetails ? (
          <GapView gap="md">
            <Controller
              control={control}
              name="invitedCount"
              render={({ field }) => (
                <AppInput
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  label="Invitados extra"
                  placeholder="0"
                  keyboardType="number-pad"
                />
              )}
            />
            <Controller
              control={control}
              name="notes"
              render={({ field, fieldState }) => (
                <>
                  <AppInput
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    label="Notas para el complejo"
                    placeholder="Ej. traemos balón propio"
                    error={fieldState.invalid}
                  />
                  {fieldState.error ? (
                    <Text
                      accessibilityLiveRegion="polite"
                      style={{ color: theme.colors.error, fontSize: 13, lineHeight: 18 }}
                    >
                      Máximo 500 caracteres.
                    </Text>
                  ) : null}
                </>
              )}
            />
          </GapView>
        ) : null}
      </GapView>

      {pickerMode ? (
        <DateTimePicker
          value={pickerMode === 'date' ? selectedDate : startTime}
          mode={pickerMode === 'date' ? 'date' : 'time'}
          {...(pickerMode === 'date' ? { minimumDate: venueToday } : {})}
          onChange={(_event, value) => {
            if (!value) {
              setPickerMode(null);
              return;
            }
            if (pickerMode === 'date') {
              setPickedDate(startOfDay(value));
              // New day: drop the old time so the first free slot is preselected.
              setPickedStartTime(null);
            } else if (pickerMode === 'start') {
              setPickedStartTime(value);
            }
            setPickerMode(null);
          }}
        />
      ) : null}
    </Screen>
  );
}
