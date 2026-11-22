import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { AppAlert, AppSkeleton, GapView, useAppToast, useAppTheme } from '@17suit/ui';
import { AppButton, AppInput, AppScrollView, AppSelect, AppTypography } from '@17suit/ui-native';
import {
  usePitchAvailabilityQuery,
  usePlayerVenuePitchesQuery,
  usePlayerVenuesQuery,
  useCreateReservationMutation,
  type PitchAvailability,
} from '../../../lib/player-queries';
import { Pressable, Text, View } from 'react-native';
import { Screen } from '../../../components/screen';
import { ChoiceChip } from '../../../components/choice-chip';
import { humanizeError } from '../../../lib/error-messages';
import { formatMoney, formatVenueTime } from '../../../lib/reservation-format';
import { venueTimeLabel } from '../../../lib/timezone-label';

type AvailabilitySlot = PitchAvailability['slots'][number];

const reservationSchema = z.object({
  pitchId: z.string().trim().min(1, 'Selecciona una cancha.'),
  invitedCount: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const MAX_TURNS = 4;
const MAX_DAY_CHIPS = 30;
const FALLBACK_TIMEZONE = 'America/Bogota';

function toOptionalNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.max(0, Math.floor(parsed));
}

/** Wall-clock Date -> `YYYY-MM-DD` (the availability API's venue-local date key). */
function toDateKey(value: Date) {
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${day}`;
}

function resolveTimeZone(timeZone?: string | null) {
  if (!timeZone) return FALLBACK_TIMEZONE;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(0);
    return timeZone;
  } catch {
    return FALLBACK_TIMEZONE;
  }
}

/** Today's venue-local calendar date, packed into a device-local midnight Date. */
function venueToday(timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? '0');
  return new Date(get('year'), get('month') - 1, get('day'));
}

function addDays(value: Date, days: number) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate() + days);
}

function dayChipLabel(day: Date, index: number) {
  if (index === 0) return 'Hoy';
  if (index === 1) return 'Mañana';
  return new Intl.DateTimeFormat('es-CO', { weekday: 'short' }).format(day).replace('.', '');
}

function dayChipCaption(day: Date) {
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' })
    .format(day)
    .replace('.', '');
}

function longDay(day: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(day);
}

/**
 * The selected start slot plus the AVAILABLE slots that follow it back-to-back,
 * capped at {@link MAX_TURNS}. A gap or a taken slot ends the run.
 */
function contiguousRun(slots: AvailabilitySlot[], start: AvailabilitySlot | null) {
  if (!start) return [];
  const startIndex = slots.indexOf(start);
  const run: AvailabilitySlot[] = [];
  for (let index = startIndex; index < slots.length && run.length < MAX_TURNS; index += 1) {
    const slot = slots[index];
    if (!slot || slot.status !== 'AVAILABLE') break;
    const previous = run[run.length - 1];
    if (previous && new Date(previous.endAt).getTime() !== new Date(slot.startAt).getTime()) {
      break;
    }
    run.push(slot);
  }
  return run;
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
  const [pickedDayIndex, setPickedDayIndex] = useState(0);
  const [pickedStartAt, setPickedStartAt] = useState<string | null>(null);
  const [pickedTurns, setPickedTurns] = useState(1);
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
      invitedCount: '0',
      notes: '',
    },
  });

  const selectedPitchId = watch('pitchId');
  const pitchExists = pitchOptions.some((option) => option.value === selectedPitchId);

  const today = venueToday(venueTimeZone);
  const horizonDays = Math.min(MAX_DAY_CHIPS, Math.max(1, venue?.bookingHorizonDays ?? 14));
  const days = Array.from({ length: horizonDays }, (_unused, index) => addDays(today, index));
  const dayIndex = Math.min(pickedDayIndex, days.length - 1);
  const selectedDate = days[dayIndex] ?? today;
  const dateKey = toDateKey(selectedDate);

  const availabilityQuery = usePitchAvailabilityQuery(
    pitchExists ? selectedPitchId : null,
    dateKey,
  );
  const currency = availabilityQuery.data?.currency ?? venue?.currency ?? 'COP';
  const nowMs = Date.now();
  const slots = useMemo(
    () =>
      [...(availabilityQuery.data?.slots ?? [])].sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      ),
    [availabilityQuery.data],
  );
  const availableSlots = slots.filter(
    (slot) => slot.status === 'AVAILABLE' && new Date(slot.startAt).getTime() > nowMs,
  );
  const startSlot = availableSlots.find((slot) => slot.startAt === pickedStartAt) ?? null;
  const run = contiguousRun(slots, startSlot);
  const maxTurns = run.length;
  const turns = maxTurns === 0 ? 0 : Math.min(Math.max(1, pickedTurns), maxTurns);
  const chosenSlots = run.slice(0, turns);
  const firstChosen = chosenSlots[0] ?? null;
  const lastChosen = chosenSlots[chosenSlots.length - 1] ?? null;
  const totalMinor = chosenSlots.reduce((sum, slot) => sum + slot.priceMinor, 0);
  const totalLabel = formatMoney(totalMinor, currency);
  const slotMinutes =
    availabilityQuery.data?.slotDurationMinutes ??
    pitchesQuery.data?.find((pitch) => pitch.id === selectedPitchId)?.slotDurationMinutes ??
    60;
  const hasAvailability = Boolean(availabilityQuery.data);
  const isNoSlotsDay = hasAvailability && availableSlots.length === 0;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!venueId) {
      setSubmitError('No encontramos el complejo. Vuelve al inicio y elígelo otra vez.');
      return;
    }
    if (!firstChosen || !lastChosen) return;
    if (new Date(firstChosen.startAt).getTime() <= Date.now()) {
      setSubmitError('Ese horario ya pasó. Elige otro.');
      setPickedStartAt(null);
      return;
    }

    try {
      const created = await createReservation.mutateAsync({
        pitchId: values.pitchId,
        startAt: firstChosen.startAt,
        endAt: lastChosen.endAt,
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
      void availabilityQuery.refetch();
    }
  });

  const isSubmitting = formState.isSubmitting || createReservation.isPending;
  const chipLabelType = theme.typography.styles.button;
  const mutedSmall = { color: theme.colors.muted, fontSize: 14, lineHeight: 20 } as const;

  let ctaLabel: string;
  if (isSubmitting) {
    ctaLabel = 'Reservando…';
  } else if (!pitchExists) {
    ctaLabel = 'Elige una cancha';
  } else if (!firstChosen || !lastChosen) {
    ctaLabel = 'Elige un horario';
  } else {
    const range = `${formatVenueTime(firstChosen.startAt, venueTimeZone)}–${formatVenueTime(
      lastChosen.endAt,
      venueTimeZone,
    )}`;
    ctaLabel = totalLabel ? `Confirmar · ${range} · ${totalLabel}` : `Confirmar · ${range}`;
  }
  const canSubmit = pitchExists && Boolean(firstChosen) && !isSubmitting;

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
          <AppButton onPress={onSubmit} disabled={!canSubmit} busy={isSubmitting}>
            {ctaLabel}
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
                  setPickedStartAt(null);
                  setPickedTurns(1);
                }}
                options={pitchOptions}
                label="Cancha"
                placeholder={pitchesQuery.isLoading ? 'Cargando canchas…' : 'Seleccionar cancha'}
                disabled={pitchesQuery.isLoading}
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

        <GapView gap="sm">
          <AppTypography variant="subtitle2" accessibilityRole="header">
            Fecha
          </AppTypography>
          <AppScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.spacing.sm }}
          >
            <View
              accessibilityRole="radiogroup"
              style={{ flexDirection: 'row', gap: theme.spacing.sm }}
            >
              {days.map((day, index) => (
                <ChoiceChip
                  key={toDateKey(day)}
                  label={dayChipLabel(day, index)}
                  caption={dayChipCaption(day)}
                  accessibilityLabel={longDay(day)}
                  selected={index === dayIndex}
                  minWidth={64}
                  onPress={() => {
                    setPickedDayIndex(index);
                    setPickedStartAt(null);
                    setPickedTurns(1);
                  }}
                />
              ))}
            </View>
          </AppScrollView>
        </GapView>

        <GapView gap="sm">
          <AppTypography variant="subtitle2" accessibilityRole="header">
            Hora de inicio
          </AppTypography>
          <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
            {`${longDay(selectedDate)} · ${venueTimeLabel(venueTimeZone)}`}
          </Text>

          {!pitchExists && !pitchesQuery.isLoading ? (
            <Text style={mutedSmall}>Elige una cancha para ver los horarios libres.</Text>
          ) : null}

          {pitchExists && availabilityQuery.isLoading ? (
            <AppSkeleton height={44} rounded="md" />
          ) : null}

          {availabilityQuery.error ? (
            <AppAlert
              variant="warning"
              title="No pudimos cargar los horarios libres"
              description={humanizeError(availabilityQuery.error, 'load')}
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
            <Text style={mutedSmall}>No quedan horarios libres este día. Prueba otra fecha.</Text>
          ) : null}

          {availableSlots.length > 0 ? (
            <View
              accessibilityRole="radiogroup"
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}
            >
              {availableSlots.map((slot) => (
                <ChoiceChip
                  key={slot.startAt}
                  label={slot.localStartTime}
                  caption={formatMoney(slot.priceMinor, currency)}
                  selected={slot.startAt === startSlot?.startAt}
                  onPress={() => {
                    setPickedStartAt(slot.startAt);
                    setSubmitError(null);
                  }}
                />
              ))}
            </View>
          ) : null}
        </GapView>

        {maxTurns > 0 ? (
          <GapView gap="sm">
            <AppTypography variant="subtitle2" accessibilityRole="header">
              Duración
            </AppTypography>
            <View
              accessibilityRole="radiogroup"
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}
            >
              {Array.from({ length: maxTurns }, (_unused, index) => index + 1).map((count) => (
                <ChoiceChip
                  key={count}
                  label={count === 1 ? '1 turno' : `${count} turnos`}
                  caption={`${count * slotMinutes} min`}
                  selected={count === turns}
                  onPress={() => setPickedTurns(count)}
                />
              ))}
            </View>
            {maxTurns < MAX_TURNS ? (
              <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
                {maxTurns === 1
                  ? 'Desde esta hora solo hay 1 turno libre seguido.'
                  : `Desde esta hora hay ${maxTurns} turnos libres seguidos.`}
              </Text>
            ) : null}
          </GapView>
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
    </Screen>
  );
}
