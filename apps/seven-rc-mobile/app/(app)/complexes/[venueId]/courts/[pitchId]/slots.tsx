import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  AppButton,
  AppFrame,
  AppInput,
  AppSelect,
  GapView,
  useAppTheme,
  useAppToast,
} from '@17suit/ui';
import {
  useOwnerVenuePitchesQuery,
  useConfigurePitchSlotsMutation,
} from '../../../../../../lib/owner-queries';
import { Text, View } from 'react-native';

const dayOptions = [
  { value: '0', label: 'Domingo' },
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miercoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
  { value: '6', label: 'Sabado' },
] as const;

function formatTime24(value: Date) {
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function PitchSlotsScreen() {
  const router = useRouter();
  const toast = useAppToast();
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<{
    venueId?: string | string[];
    pitchId?: string | string[];
  }>();
  const venueId = Array.isArray(params.venueId) ? params.venueId[0] : params.venueId;
  const pitchId = Array.isArray(params.pitchId) ? params.pitchId[0] : params.pitchId;

  const pitchesQuery = useOwnerVenuePitchesQuery(venueId ?? null);
  const pitch = useMemo(
    () => (pitchesQuery.data ?? []).find((item) => item.id === pitchId),
    [pitchesQuery.data, pitchId],
  );
  const slotDurationDefault = String(pitch?.slotDurationMinutes ?? 60);

  const [slotDurationMinutes, setSlotDurationMinutes] = useState(slotDurationDefault);
  const [openingHours, setOpeningHours] = useState([
    { dayOfWeek: '1', openTime: '10:00', closeTime: '22:00' },
  ]);
  const [picker, setPicker] = useState<{ index: number; field: 'open' | 'close' } | null>(null);

  const configureMutation = useConfigurePitchSlotsMutation(pitchId ?? '', venueId ?? null);

  const handleSave = async () => {
    if (!pitchId) {
      toast.error('Error', 'Cancha invalida.');
      return;
    }

    const payload = openingHours.map((row) => ({
      dayOfWeek: Number(row.dayOfWeek),
      openTime: row.openTime,
      closeTime: row.closeTime,
    }));

    try {
      await configureMutation.mutateAsync({
        slotDurationMinutes: Number(slotDurationMinutes) || undefined,
        openingHours: payload,
      });
      toast.success('Horarios guardados', 'La cancha quedo configurada.');
      router.replace(`/complexes/${venueId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el horario.';
      toast.error('Error', message);
    }
  };

  return (
    <AppFrame appName="Horarios" subtitle="Configura horarios de apertura para la cancha.">
      <GapView gap="md">
        <AppInput
          value={slotDurationMinutes}
          onChangeText={setSlotDurationMinutes}
          keyboardType="numeric"
          placeholder="Duracion del turno (min)"
        />
        <GapView gap="sm">
          {openingHours.map((row, index) => (
            <View
              key={`${row.dayOfWeek}-${index}`}
              style={{
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: theme.grayscale[3],
                backgroundColor: theme.colors.surface,
                padding: theme.spacing.md,
                gap: theme.spacing.sm,
              }}
            >
              <AppSelect
                value={row.dayOfWeek}
                onChangeValue={(value) => {
                  setOpeningHours((prev) =>
                    prev.map((item, idx) => (idx === index ? { ...item, dayOfWeek: value } : item)),
                  );
                }}
                options={dayOptions as unknown as { value: string; label: string }[]}
                label="Dia"
                placeholder="Seleccionar dia"
              />
              <AppButton variant="neutral" onPress={() => setPicker({ index, field: 'open' })}>
                {`Apertura: ${row.openTime}`}
              </AppButton>
              <AppButton variant="neutral" onPress={() => setPicker({ index, field: 'close' })}>
                {`Cierre: ${row.closeTime}`}
              </AppButton>
              <AppButton
                variant="destructive"
                onPress={() => {
                  setOpeningHours((prev) => prev.filter((_, idx) => idx !== index));
                }}
              >
                Eliminar dia
              </AppButton>
            </View>
          ))}
        </GapView>
        <AppButton
          variant="neutral"
          onPress={() => {
            setOpeningHours((prev) => [
              ...prev,
              { dayOfWeek: '1', openTime: '10:00', closeTime: '22:00' },
            ]);
          }}
        >
          Agregar dia
        </AppButton>
        <AppButton onPress={handleSave} disabled={configureMutation.isPending}>
          {configureMutation.isPending ? 'Guardando...' : 'Guardar horarios'}
        </AppButton>
        <AppButton variant="neutral" onPress={() => router.back()}>
          Cancelar
        </AppButton>
      </GapView>

      {picker ? (
        <DateTimePicker
          value={new Date()}
          mode="time"
          onChange={(event, value) => {
            if (!value) {
              setPicker(null);
              return;
            }
            const formatted = formatTime24(value);
            setOpeningHours((prev) =>
              prev.map((item, idx) => {
                if (idx !== picker.index) return item;
                if (picker.field === 'open') return { ...item, openTime: formatted };
                return { ...item, closeTime: formatted };
              }),
            );
            setPicker(null);
          }}
        />
      ) : null}

      {pitchesQuery.isLoading ? (
        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Cargando cancha...</Text>
      ) : null}
      {!pitchesQuery.isLoading && !pitch ? (
        <Text style={{ color: theme.colors.error, fontSize: 12 }}>
          No se encontro la cancha seleccionada.
        </Text>
      ) : null}
    </AppFrame>
  );
}
