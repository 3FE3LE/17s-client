'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import { z } from 'zod';
import { SevenRcApiError } from '@17suit/module-seven-reservations-club';
import { AppButton, AppInput } from '@17suit/ui';
import {
  HintedInput,
  InlineError,
  InlineStatus,
  ListSkeleton,
  SectionHeader,
  SelectField,
} from '@/components/seven-rc-ui';
import {
  useCreatePitchBlockMutation,
  useDeletePitchBlockMutation,
  usePitchBlocksQuery,
  type PitchBlock,
  type PitchWithPricing,
  type ReservationBase,
} from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import {
  formatSlotWhen,
  reservationStatus,
  sportLabel,
  zonedTimeToInstant,
} from '@/lib/seven-rc-format';

const HEADING_ID = 'bloqueos-title';
const REASON_MAX = 200;

const TIME_PATTERN = /^\d{2}:\d{2}$/;

function buildBlockSchema(timeZone: string) {
  return z
    .object({
      date: z.string().min(1, 'Elige la fecha del bloqueo.'),
      startTime: z.string().regex(TIME_PATTERN, 'Elige la hora de inicio.'),
      endTime: z.string().regex(TIME_PATTERN, 'Elige la hora de fin.'),
      reason: z.string().max(REASON_MAX),
    })
    .superRefine((values, issues) => {
      if (
        !values.date ||
        !TIME_PATTERN.test(values.startTime) ||
        !TIME_PATTERN.test(values.endTime)
      ) {
        return;
      }
      if (values.endTime <= values.startTime) {
        issues.addIssue({
          code: 'custom',
          path: ['endTime'],
          message: 'La hora de fin debe ser posterior a la de inicio.',
        });
        return;
      }
      const endAt = zonedTimeToInstant(values.date, values.endTime, timeZone);
      if (endAt.getTime() <= Date.now()) {
        issues.addIssue({
          code: 'custom',
          path: ['endTime'],
          message: 'Ese horario ya pasó. Elige uno más tarde.',
        });
      }
    });
}
type BlockValues = z.infer<ReturnType<typeof buildBlockSchema>>;

function BlockTextField({
  control,
  name,
  label,
  type,
  min,
}: {
  control: Control<BlockValues>;
  name: 'date' | 'startTime' | 'endTime';
  label: string;
  type: 'date' | 'time';
  min?: string;
}) {
  const field = {
    date: 'blockDate',
    startTime: 'blockStart',
    endTime: 'blockEnd',
  }[name];
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: input, fieldState }) => (
        <div className="grid content-start gap-xs">
          <AppInput
            type={type}
            name={field}
            label={label}
            {...(min ? { min } : {})}
            error={Boolean(fieldState.error)}
            value={input.value}
            onChangeText={input.onChange}
            onBlur={input.onBlur}
          />
          <InlineError message={fieldState.error?.message ?? null} />
        </div>
      )}
    />
  );
}

export interface PitchBlocksSectionProps {
  pitches: PitchWithPricing[];
  timeZone: string;
  /** Venue-local `YYYY-MM-DD` of today. */
  todayKey: string;
}

/**
 * Owner-side time blocks (maintenance, private events, bookings taken elsewhere).
 * Blocks are per pitch; the server rejects one that overlaps active reservations and
 * returns them, so the owner can resolve those first.
 */
export function PitchBlocksSection({ pitches, timeZone, todayKey }: PitchBlocksSectionProps) {
  const [explicitPitchId, setExplicitPitchId] = useState<string | null>(null);
  const pitch = pitches.find((item) => item.id === explicitPitchId) ?? pitches[0] ?? null;

  return (
    <section aria-labelledby={HEADING_ID} className="mt-lg grid gap-md">
      <SectionHeader
        id={HEADING_ID}
        title="Bloqueos de horario"
        description="Cierra una cancha por mantenimiento, un evento privado o una reserva que tomaste por otro medio. Ese horario deja de ofrecerse a los jugadores."
      />
      {!pitch ? (
        <p className="m-0 text-md leading-[1.5] text-muted">
          Agrega una cancha para poder bloquear sus horarios.
        </p>
      ) : (
        <>
          {pitches.length > 1 ? (
            <div className="max-w-[var(--container-form)]">
              <SelectField
                label="Cancha"
                name="blockPitch"
                value={pitch.id}
                onChangeValue={setExplicitPitchId}
                options={pitches.map((item) => ({
                  value: item.id,
                  label: `${item.name} · ${sportLabel(item.sportType)}`,
                }))}
              />
            </div>
          ) : (
            <p className="m-0 text-md font-bold leading-[1.5] text-text">
              {pitch.name} · {sportLabel(pitch.sportType)}
            </p>
          )}
          <PitchBlocksPanel key={pitch.id} pitch={pitch} timeZone={timeZone} todayKey={todayKey} />
        </>
      )}
    </section>
  );
}

function PitchBlocksPanel({
  pitch,
  timeZone,
  todayKey,
}: {
  pitch: PitchWithPricing;
  timeZone: string;
  todayKey: string;
}) {
  // Fixed per mount: it is part of the request, not of the query key.
  const [from] = useState(() => new Date().toISOString());
  const blocksQuery = usePitchBlocksQuery(pitch.id, from);
  const createMutation = useCreatePitchBlockMutation(pitch.id);
  const deleteMutation = useDeletePitchBlockMutation(pitch.id);

  const { control, handleSubmit, getValues, reset } = useForm<BlockValues>({
    resolver: zodResolver(buildBlockSchema(timeZone)),
    defaultValues: { date: todayKey, startTime: '', endTime: '', reason: '' },
  });
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<ReservationBase[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setConflicts([]);
    setNotice(null);
    const startAt = zonedTimeToInstant(values.date, values.startTime, timeZone);
    const endAt = zonedTimeToInstant(values.date, values.endTime, timeZone);
    const reason = values.reason.trim();

    try {
      const created = await createMutation.mutateAsync({
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        ...(reason ? { reason } : {}),
      });
      setNotice(
        `${pitch.name} bloqueada: ${formatSlotWhen(created.startAt, created.endAt, timeZone)}.`,
      );
      reset({ ...getValues(), startTime: '', endTime: '', reason: '' });
    } catch (caught) {
      if (caught instanceof SevenRcApiError && caught.status === 409) {
        setConflicts(caught.conflicts);
      }
      setError(describeError(caught, 'No se pudo crear el bloqueo.'));
    }
  });

  async function onRemove(block: PitchBlock) {
    setError(null);
    setConflicts([]);
    setNotice(null);
    setRemovingId(block.id);
    try {
      await deleteMutation.mutateAsync(block.id);
      setNotice(
        `Bloqueo quitado: ${formatSlotWhen(block.startAt, block.endAt, timeZone)}. Ese horario vuelve a estar disponible.`,
      );
    } catch (caught) {
      setError(describeError(caught, 'No se pudo quitar el bloqueo.'));
    } finally {
      setRemovingId(null);
    }
  }

  const blocks = blocksQuery.data ?? [];

  return (
    <div className="grid gap-md">
      <form
        onSubmit={(event) => void onSubmit(event)}
        aria-labelledby={`${HEADING_ID}-nuevo`}
        className="grid gap-sm"
        noValidate
      >
        <h3 id={`${HEADING_ID}-nuevo`} className="m-0 font-arvo text-md text-text">
          Nuevo bloqueo
        </h3>
        <div className="grid max-w-[var(--container-form)] gap-sm sm:grid-cols-3">
          <BlockTextField control={control} name="date" label="Fecha" type="date" min={todayKey} />
          <BlockTextField control={control} name="startTime" label="Desde" type="time" />
          <BlockTextField control={control} name="endTime" label="Hasta" type="time" />
        </div>
        <div className="max-w-[var(--container-form)]">
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <HintedInput
                type="text"
                name="blockReason"
                label="Motivo (opcional)"
                maxLength={REASON_MAX}
                autoComplete="off"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                hint="Solo lo ves tú. Ej.: Mantenimiento del césped."
              />
            )}
          />
        </div>
        <div className="grid gap-sm sm:max-w-[280px]">
          <AppButton type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Bloqueando…' : 'Bloquear horario'}
          </AppButton>
        </div>
        <InlineError message={error} />
        {conflicts.length > 0 ? (
          <div className="grid gap-xs" role="alert">
            <p className="m-0 text-sm leading-[18px] text-text">
              Estas reservas activas se cruzan con el bloqueo:
            </p>
            <ul className="m-0 grid list-none gap-xs p-0">
              {conflicts.map((reservation) => (
                <li
                  key={reservation.id}
                  className="rounded-[var(--radius-lg)] border border-border-default bg-background px-md py-sm text-sm leading-[18px] text-text"
                >
                  <span className="first-letter:uppercase">
                    {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)}
                  </span>{' '}
                  · {reservation.customerName ?? 'Jugador sin nombre'} ·{' '}
                  {reservationStatus(reservation.status).label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <InlineStatus message={notice} />
      </form>

      <div className="grid gap-sm">
        <h3 className="m-0 font-arvo text-md text-text">Bloqueos vigentes</h3>
        {blocksQuery.isLoading ? (
          <ListSkeleton rows={1} label="Cargando bloqueos" />
        ) : blocksQuery.error && !blocksQuery.data ? (
          <div className="grid gap-sm">
            <InlineError
              message={describeError(blocksQuery.error, 'No se pudieron cargar los bloqueos.')}
            />
            <AppButton
              variant="neutral"
              fullWidth={false}
              onPress={() => void blocksQuery.refetch()}
            >
              Reintentar
            </AppButton>
          </div>
        ) : blocks.length === 0 ? (
          <p className="m-0 text-md leading-[1.5] text-muted">
            {pitch.name} no tiene bloqueos próximos.
          </p>
        ) : (
          <ul className="m-0 grid list-none gap-sm p-0">
            {blocks.map((block) => (
              <li
                key={block.id}
                className="grid gap-sm rounded-[var(--radius-lg)] border border-border-default bg-background p-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="grid gap-xs">
                  <p className="m-0 text-md font-bold leading-[1.4] text-text first-letter:uppercase">
                    {formatSlotWhen(block.startAt, block.endAt, timeZone)}
                  </p>
                  {block.reason ? (
                    <p className="m-0 text-sm leading-[18px] text-muted">{block.reason}</p>
                  ) : null}
                </div>
                <AppButton
                  variant="neutral"
                  fullWidth={false}
                  disabled={removingId === block.id}
                  onPress={() => void onRemove(block)}
                  aria-label={`Quitar bloqueo de ${formatSlotWhen(block.startAt, block.endAt, timeZone)}`}
                >
                  {removingId === block.id ? 'Quitando…' : 'Quitar'}
                </AppButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
