'use client';

import { applyServerFieldErrors } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@17suit/i18n/react';
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
      date: z.string().min(1, 'dateRequired'),
      startTime: z.string().regex(TIME_PATTERN, 'startRequired'),
      endTime: z.string().regex(TIME_PATTERN, 'endRequired'),
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
          message: 'endBeforeStart',
        });
        return;
      }
      const endAt = zonedTimeToInstant(values.date, values.endTime, timeZone);
      if (endAt.getTime() <= Date.now()) {
        issues.addIssue({
          code: 'custom',
          path: ['endTime'],
          message: 'endPassed',
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
  const { t } = useTranslation('owner');
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
          <InlineError
            message={
              fieldState.error?.message
                ? fieldState.error.message.includes(':')
                  ? t(fieldState.error.message)
                  : t(`pitchBlocks.errors.${fieldState.error.message}`)
                : null
            }
          />
        </div>
      )}
    />
  );
}

/** Server DTO property to form field. The reason has no inline error. */
const SERVER_FIELD_MAP = { startAt: 'startTime', endAt: 'endTime' } as const;

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
  const { t } = useTranslation('owner');
  const [explicitPitchId, setExplicitPitchId] = useState<string | null>(null);
  const pitch = pitches.find((item) => item.id === explicitPitchId) ?? pitches[0] ?? null;

  return (
    <section aria-labelledby={HEADING_ID} className="mt-lg grid gap-md">
      <SectionHeader
        id={HEADING_ID}
        title={t('pitchBlocks.title')}
        description={t('pitchBlocks.description')}
      />
      {!pitch ? (
        <p className="m-0 text-md leading-[1.5] text-muted">{t('pitchBlocks.noPitch')}</p>
      ) : (
        <>
          {pitches.length > 1 ? (
            <div className="max-w-[var(--container-form)]">
              <SelectField
                label={t('pitchBlocks.pitch')}
                name="blockPitch"
                value={pitch.id}
                onChangeValue={setExplicitPitchId}
                options={pitches.map((item) => ({
                  value: item.id,
                  label: `${item.name} · ${sportLabel(item.sportType, t)}`,
                }))}
              />
            </div>
          ) : (
            <p className="m-0 text-md font-bold leading-[1.5] text-text">
              {pitch.name} · {sportLabel(pitch.sportType, t)}
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
  const { t, i18n } = useTranslation('owner');
  const locale = i18n.language;
  // Fixed per mount: it is part of the request, not of the query key.
  const [from] = useState(() => new Date().toISOString());
  const blocksQuery = usePitchBlocksQuery(pitch.id, from);
  const createMutation = useCreatePitchBlockMutation(pitch.id);
  const deleteMutation = useDeletePitchBlockMutation(pitch.id);

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    setError: setFieldError,
  } = useForm<BlockValues>({
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
        t('pitchBlocks.blocked', {
          pitch: pitch.name,
          when: formatSlotWhen(created.startAt, created.endAt, timeZone, locale),
        }),
      );
      reset({ ...getValues(), startTime: '', endTime: '', reason: '' });
    } catch (caught) {
      if (caught instanceof SevenRcApiError && caught.status === 409) {
        setConflicts(caught.conflicts);
      }
      if (!applyServerFieldErrors(caught, setFieldError, SERVER_FIELD_MAP)) {
        setError(describeError(caught, t('pitchBlocks.createError')));
      }
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
        t('pitchBlocks.removed', {
          when: formatSlotWhen(block.startAt, block.endAt, timeZone, locale),
        }),
      );
    } catch (caught) {
      setError(describeError(caught, t('pitchBlocks.removeError')));
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
          {t('pitchBlocks.new')}
        </h3>
        <div className="grid max-w-[var(--container-form)] gap-sm sm:grid-cols-3">
          <BlockTextField
            control={control}
            name="date"
            label={t('pitchBlocks.date')}
            type="date"
            min={todayKey}
          />
          <BlockTextField
            control={control}
            name="startTime"
            label={t('pitchBlocks.from')}
            type="time"
          />
          <BlockTextField
            control={control}
            name="endTime"
            label={t('pitchBlocks.to')}
            type="time"
          />
        </div>
        <div className="max-w-[var(--container-form)]">
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <HintedInput
                type="text"
                name="blockReason"
                label={t('pitchBlocks.reason')}
                maxLength={REASON_MAX}
                autoComplete="off"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                hint={t('pitchBlocks.reasonHint')}
              />
            )}
          />
        </div>
        <div className="grid gap-sm sm:max-w-[280px]">
          <AppButton type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? t('pitchBlocks.blocking') : t('pitchBlocks.block')}
          </AppButton>
        </div>
        <InlineError message={error} />
        {conflicts.length > 0 ? (
          <div className="grid gap-xs" role="alert">
            <p className="m-0 text-sm leading-[18px] text-text">{t('pitchBlocks.conflicts')}</p>
            <ul className="m-0 grid list-none gap-xs p-0">
              {conflicts.map((reservation) => (
                <li
                  key={reservation.id}
                  className="rounded-[var(--radius-lg)] border border-border-default bg-background px-md py-sm text-sm leading-[18px] text-text"
                >
                  <span className="first-letter:uppercase">
                    {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone, locale)}
                  </span>{' '}
                  · {reservation.customerName ?? t('pitchBlocks.unnamedPlayer')} ·{' '}
                  {reservationStatus(reservation.status, t).label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <InlineStatus message={notice} />
      </form>

      <div className="grid gap-sm">
        <h3 className="m-0 font-arvo text-md text-text">{t('pitchBlocks.current')}</h3>
        {blocksQuery.isLoading ? (
          <ListSkeleton rows={1} label={t('pitchBlocks.loading')} />
        ) : blocksQuery.error && !blocksQuery.data ? (
          <div className="grid gap-sm">
            <InlineError message={describeError(blocksQuery.error, t('pitchBlocks.loadError'))} />
            <AppButton
              variant="neutral"
              fullWidth={false}
              onPress={() => void blocksQuery.refetch()}
            >
              {t('pitchBlocks.retry')}
            </AppButton>
          </div>
        ) : blocks.length === 0 ? (
          <p className="m-0 text-md leading-[1.5] text-muted">
            {t('pitchBlocks.none', { pitch: pitch.name })}
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
                    {formatSlotWhen(block.startAt, block.endAt, timeZone, locale)}
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
                  aria-label={t('pitchBlocks.removeLabel', {
                    when: formatSlotWhen(block.startAt, block.endAt, timeZone, locale),
                  })}
                >
                  {removingId === block.id ? t('pitchBlocks.removing') : t('pitchBlocks.remove')}
                </AppButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
