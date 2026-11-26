'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput, cx } from '@17suit/ui';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import { weekPayload } from '@/lib/opening-hours';
import { useConfigurePitchSlotsMutation, type PitchWithPricing } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import { formatDuration, WEEKDAYS } from '@/lib/seven-rc-format';

const hoursSchema = z
  .object({
    days: z.array(z.number()).min(1, 'Elige al menos un día.'),
    mode: z.enum(['open', 'closed']),
    openTime: z.string(),
    closeTime: z.string(),
  })
  .superRefine((values, issues) => {
    if (
      values.mode === 'open' &&
      values.closeTime <= values.openTime &&
      values.closeTime !== '00:00'
    ) {
      issues.addIssue({
        code: 'custom',
        path: ['closeTime'],
        message: 'La hora de cierre debe ser posterior a la de apertura.',
      });
    }
  });
type HoursValues = z.infer<typeof hoursSchema>;

const CHOICE_CLASS =
  'flex min-h-11 cursor-pointer items-center gap-xs rounded-[var(--radius-md)] border border-border-strong px-3 text-md text-text has-[:checked]:border-action-primary has-[:checked]:bg-action-primary-soft';
const LINK_BUTTON_CLASS =
  'min-h-11 cursor-pointer border-0 bg-transparent px-0 text-sm text-text underline underline-offset-4';

export function OpeningHoursForm({ venueId, pitch }: { venueId: string; pitch: PitchWithPricing }) {
  const configureMutation = useConfigurePitchSlotsMutation(pitch.id, venueId);
  const closeDialogRef = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, getValues, setValue, watch, reset, formState } =
    useForm<HoursValues>({
      resolver: zodResolver(hoursSchema),
      defaultValues: { days: [], mode: 'open', openTime: '08:00', closeTime: '22:00' },
    });

  const currentHours = pitch.openingHours ?? {};
  const days = watch('days');
  const mode = watch('mode');

  const dayNames = (values: number[]) =>
    WEEKDAYS.filter((day) => values.includes(day.value))
      .map((day) => day.label.toLowerCase())
      .join(', ');
  // Days in the selection that are open today and would become closed.
  const closingDays = days.filter((day) => {
    const hours = currentHours[String(day)];
    return Boolean(hours?.openTime && hours.closeTime);
  });

  async function save(values: HoursValues) {
    // The endpoint replaces the whole week, so carry over days not being edited.
    // Days marked "Cerrado" are simply left out of the payload.
    const keptDays = weekPayload(currentHours).filter(
      (item) => !values.days.includes(item.dayOfWeek),
    );
    const editedDays =
      values.mode === 'open'
        ? values.days.map((dayOfWeek) => ({
            dayOfWeek,
            openTime: values.openTime,
            closeTime: values.closeTime,
          }))
        : [];

    try {
      // Slot length has its own form; omitted, the server keeps the stored value.
      await configureMutation.mutateAsync({ openingHours: [...keptDays, ...editedDays] });
      const names = dayNames(values.days);
      setNotice(
        values.mode === 'open'
          ? `Guardaste ${values.openTime}–${values.closeTime} para ${names} en ${pitch.name}.`
          : `Días cerrados en ${pitch.name}: ${names}. Los jugadores ya no verán turnos esos días.`,
      );
      reset({ ...values, days: [] });
      closeDialogRef.current?.close();
    } catch (caught) {
      setError(describeError(caught, 'No se pudieron guardar los horarios.'));
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setNotice(null);
    if (values.mode === 'closed') {
      if (closingDays.length === 0) {
        setNotice(
          values.days.length === 1
            ? `El ${dayNames(values.days)} ya estaba cerrado. No hubo cambios.`
            : `Esos días ya estaban cerrados. No hubo cambios.`,
        );
        return;
      }
      closeDialogRef.current?.showModal();
      return;
    }
    await save(values);
  });
  const saving = configureMutation.isPending || formState.isSubmitting;
  const fieldError = formState.errors.days?.message ?? formState.errors.closeTime?.message ?? null;

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="horarios-title"
      className="grid gap-md"
      noValidate
    >
      <h3 id="horarios-title" className="m-0 font-arvo text-md text-text">
        Horarios de apertura
      </h3>
      <div className="grid gap-md md:grid-cols-2">
        <div>
          <p className="m-0 mb-xs text-sm leading-[1.5] text-muted">Semana actual</p>
          <ul className="m-0 grid list-none gap-1 p-0 text-sm leading-[1.5]">
            {WEEKDAYS.map((day) => {
              const hours = currentHours[String(day.value)];
              return (
                <li key={day.value} className="flex justify-between gap-sm">
                  <span className="text-text">{day.label}</span>
                  <span className="tabular-nums text-muted">
                    {hours?.openTime && hours.closeTime
                      ? `${hours.openTime}–${hours.closeTime}`
                      : 'Cerrado'}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="m-0 mt-xs text-sm leading-[18px] text-muted">
            Turnos de {formatDuration(pitch.slotDurationMinutes)}.
          </p>
        </div>

        <div className="grid content-start gap-sm">
          <fieldset className="m-0 grid gap-sm border-0 p-0">
            <legend className="mb-xs p-0 text-sm leading-[1.5] text-muted">
              Días a los que aplicar el horario
            </legend>
            <div className="flex flex-wrap gap-sm">
              {WEEKDAYS.map((day) => (
                <label key={day.value} className={CHOICE_CLASS}>
                  <input
                    type="checkbox"
                    name="days"
                    value={day.value}
                    checked={days.includes(day.value)}
                    onChange={(event) =>
                      setValue(
                        'days',
                        event.target.checked
                          ? [...new Set([...days, day.value])]
                          : days.filter((value) => value !== day.value),
                        { shouldValidate: formState.isSubmitted },
                      )
                    }
                    className="h-4 w-4 accent-[var(--color-action-primary)]"
                  />
                  {day.label}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-md">
              <button
                type="button"
                className={LINK_BUTTON_CLASS}
                onClick={() => setValue('days', [1, 2, 3, 4, 5])}
              >
                Lunes a viernes
              </button>
              <button
                type="button"
                className={LINK_BUTTON_CLASS}
                onClick={() => setValue('days', [0, 1, 2, 3, 4, 5, 6])}
              >
                Toda la semana
              </button>
            </div>
          </fieldset>
          <fieldset className="m-0 grid gap-sm border-0 p-0">
            <legend className="mb-xs p-0 text-sm leading-[1.5] text-muted">
              Cada día elegido queda
            </legend>
            <div className="flex flex-wrap gap-sm">
              {(
                [
                  ['open', 'Abierto'],
                  ['closed', 'Cerrado'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className={CHOICE_CLASS}>
                  <input
                    type="radio"
                    name="hoursMode"
                    value={value}
                    checked={mode === value}
                    onChange={() => setValue('mode', value)}
                    className="h-4 w-4 accent-[var(--color-action-primary)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className={cx('grid grid-cols-2 gap-sm', mode === 'closed' && 'hidden')}>
            <Controller
              control={control}
              name="openTime"
              render={({ field }) => (
                <AppInput
                  type="time"
                  name="openTime"
                  label="Abre"
                  step={900}
                  required
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name="closeTime"
              render={({ field, fieldState }) => (
                <AppInput
                  type="time"
                  name="closeTime"
                  label="Cierra"
                  step={900}
                  required
                  error={Boolean(fieldState.error)}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>
          <AppButton type="submit" disabled={saving}>
            {saving ? 'Guardando…' : mode === 'closed' ? 'Marcar como cerrado' : 'Guardar horarios'}
          </AppButton>
          <InlineError message={fieldError ?? error} />
          <InlineStatus message={notice} />
        </div>
      </div>
      <ConfirmDialog
        dialogRef={closeDialogRef}
        title="¿Cerrar estos días?"
        confirmLabel="Sí, cerrar"
        pendingLabel="Guardando…"
        dismissLabel="Volver"
        isPending={configureMutation.isPending}
        error={error}
        onConfirm={() => {
          setError(null);
          void save(getValues());
        }}
        onClosed={() => undefined}
      >
        <p className="m-0 text-text">
          {pitch.name} dejará de abrir {dayNames(closingDays)}.
        </p>
        <p className="m-0">
          Los jugadores ya no podrán reservar esos días. Las reservas ya hechas no se cancelan.
        </p>
      </ConfirmDialog>
    </form>
  );
}
