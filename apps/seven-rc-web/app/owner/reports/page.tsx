'use client';

import {
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import { useTranslation } from '@17suit/i18n/react';
import { AppButton, AppFrame, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { InlineError, ListSkeleton, SectionHeader, SelectField } from '@/components/seven-rc-ui';
import { describeError } from '@/lib/seven-rc-errors';
import {
  useOwnerVenueReportQuery,
  useOwnerVenueReservationsQuery,
  useOwnerVenuesQuery,
  type PitchReport,
} from '@/lib/owner-queries';
import { buildReservationsCsv, reportFileName, validatePeriod } from '@/lib/owner-report';
import {
  addDaysToDateKey,
  dateKeyInTimeZone,
  formatDateKey,
  intlLocale,
  type Translate,
  formatDuration,
  formatMoneyMinor,
  reservationStatus,
  safeTimeZone,
} from '@/lib/seven-rc-format';

export default function OwnerReportsPage() {
  const router = useRouter();
  const { t } = useTranslation('owner');
  const { role, isLoading } = useCurrentUserRoleQuery();
  useRoleGate({ required: 'OWNER', router });

  if (isLoading || role !== 'OWNER') {
    return (
      <AppFrame appName={t('reports.title')} subtitle={t('reports.loadingAccount')}>
        <ListSkeleton rows={3} label={t('reports.loadingAccountLabel')} />
      </AppFrame>
    );
  }
  return <ReportsWorkspace />;
}

const buildPeriodSchema = (t: Translate) =>
  z.object({ from: z.string(), to: z.string() }).superRefine((value, issues) => {
    const message = validatePeriod(value.from, value.to, t);
    if (message) issues.addIssue({ code: 'custom', path: ['to'], message });
  });
type PeriodValues = z.infer<ReturnType<typeof buildPeriodSchema>>;

const formatPercent = (value: number, locale: string) =>
  new Intl.NumberFormat(intlLocale(locale), { style: 'percent', maximumFractionDigits: 0 }).format(
    value,
  );

function ReportsWorkspace() {
  const { t, i18n } = useTranslation('owner');
  const locale = i18n.language;
  const venuesQuery = useOwnerVenuesQuery();
  const venues = venuesQuery.data ?? [];
  const [explicitVenueId, setExplicitVenueId] = useState<string | null>(null);
  const venue = venues.find((item) => item.id === explicitVenueId) ?? venues[0] ?? null;
  const timeZone = safeTimeZone(venue?.timezone);
  const today = dateKeyInTimeZone(new Date(), timeZone);

  // The form holds what the inputs show; `applied` is what the queries run on (set on submit).
  const [applied, setApplied] = useState<PeriodValues | null>(null);
  const defaults = { from: addDaysToDateKey(today, -29), to: today };
  const period = applied ?? defaults;
  const { control, handleSubmit, reset } = useForm<PeriodValues>({
    resolver: zodResolver(buildPeriodSchema(t)),
    values: defaults,
    resetOptions: { keepDirtyValues: true },
  });

  const venueId = venue?.id ?? null;
  const reportQuery = useOwnerVenueReportQuery(venueId, period.from, period.to);
  const reservationsQuery = useOwnerVenueReservationsQuery(venueId, period.from, period.to);
  const report = reportQuery.data ?? null;
  const currency = report?.currency ?? venue?.currency ?? 'COP';
  const money = (amountMinor: number) => formatMoneyMinor(amountMinor, currency, locale);

  const onSubmit = handleSubmit((values) => setApplied({ ...values }));

  function preset(days: number) {
    const next = { from: addDaysToDateKey(today, -(days - 1)), to: today };
    reset(next);
    setApplied(next);
  }

  function downloadCsv() {
    if (!venue || !reservationsQuery.data) return;
    const csv = buildReservationsCsv(reservationsQuery.data, timeZone);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = reportFileName(venue.slug ?? venue.name, period.from, period.to);
    link.click();
    URL.revokeObjectURL(url);
  }

  const loading = Boolean(venueId) && (reportQuery.isLoading || reservationsQuery.isLoading);
  const reportError = reportQuery.error
    ? describeError(reportQuery.error, t('reports.loadError'))
    : null;
  const listError = reservationsQuery.error
    ? describeError(reservationsQuery.error, t('reports.exportLoadError'))
    : null;
  const empty =
    report !== null && report.totals.reservationsByStatus
      ? Object.values(report.totals.reservationsByStatus).every((count) => count === 0)
      : false;

  return (
    <AppFrame
      appName={t('reports.title')}
      subtitle={venue ? t('reports.subtitle', { venue: venue.name }) : t('reports.noVenue')}
    >
      <p className="m-0">
        <Link href="/owner" className="text-text underline">
          {t('reports.backToVenue')}
        </Link>
      </p>

      {venuesQuery.error ? (
        <InlineError message={describeError(venuesQuery.error, t('reports.venuesLoadError'))} />
      ) : null}

      {venues.length > 1 ? (
        <div className="max-w-[var(--container-form)]">
          <SelectField
            label={t('reports.venue')}
            name="complejo"
            value={venue?.id ?? ''}
            onChangeValue={setExplicitVenueId}
            options={venues.map((item) => ({ value: item.id, label: item.name }))}
          />
        </div>
      ) : null}

      <form
        onSubmit={(event) => void onSubmit(event)}
        aria-labelledby="reporte-periodo"
        className="grid max-w-[var(--container-form)] gap-sm"
        noValidate
      >
        <SectionHeader id="reporte-periodo" title={t('reports.period.title')} />
        <div className="grid gap-sm sm:grid-cols-2">
          <Controller
            control={control}
            name="from"
            render={({ field }) => (
              <AppInput
                label={t('reports.period.from')}
                name="desde"
                type="date"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="to"
            render={({ field, fieldState }) => (
              <AppInput
                label={t('reports.period.to')}
                name="hasta"
                type="date"
                error={Boolean(fieldState.error)}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
        <Controller
          control={control}
          name="to"
          render={({ fieldState }) => <InlineError message={fieldState.error?.message ?? null} />}
        />
        <div className="flex flex-wrap gap-sm">
          <AppButton type="submit" fullWidth={false}>
            {t('reports.period.submit')}
          </AppButton>
          {[7, 30, 90].map((days) => (
            <AppButton key={days} variant="neutral" fullWidth={false} onPress={() => preset(days)}>
              {t('reports.period.lastDays', { count: days })}
            </AppButton>
          ))}
        </div>
      </form>

      {loading ? <ListSkeleton rows={3} label={t('reports.loading')} /> : null}

      {reportError ? (
        <div className="grid gap-sm">
          <InlineError message={reportError} />
          <AppButton variant="neutral" fullWidth={false} onPress={() => void reportQuery.refetch()}>
            {t('reports.retry')}
          </AppButton>
        </div>
      ) : null}

      {report && !loading ? (
        <section aria-labelledby="reporte-resumen" className="grid gap-md">
          <SectionHeader
            id="reporte-resumen"
            title={t('reports.summary.title')}
            description={`${formatDateKey(report.dateFrom, { day: 'numeric', month: 'short', year: 'numeric' }, locale)} – ${formatDateKey(report.dateTo, { day: 'numeric', month: 'short', year: 'numeric' }, locale)}`}
            aside={
              <AppButton
                variant="neutral"
                fullWidth={false}
                onPress={downloadCsv}
                disabled={!reservationsQuery.data || reservationsQuery.data.length === 0}
              >
                {t('reports.summary.exportCsv')}
              </AppButton>
            }
          />
          <InlineError message={listError} />

          {empty ? (
            <p role="status" className="m-0 text-md text-muted">
              {t('reports.summary.empty')}
            </p>
          ) : null}

          <dl className="m-0 grid gap-sm sm:grid-cols-3">
            <Metric
              label={t('reports.columns.collected')}
              value={money(report.totals.collectedMinor)}
            />
            <Metric
              label={t('reports.columns.pending')}
              value={money(report.totals.pendingMinor)}
            />
            <Metric
              label={t('reports.columns.occupancy')}
              value={formatPercent(report.totals.occupancyRate, locale)}
            />
          </dl>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-md">
              <caption className="pb-xs text-left text-sm text-muted">
                {t('reports.table.caption')}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="py-xs pr-sm">
                    {t('reports.table.pitch')}
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    {t('reports.columns.collected')}
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    {t('reports.columns.pending')}
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    {t('reports.columns.occupancy')}
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    {t('reports.table.bookedHours')}
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    {t('reports.table.reservations')}
                  </th>
                  <th scope="col" className="py-xs">
                    {t('reports.table.peakHours')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.pitches.map((pitch) => (
                  <PitchRow key={pitch.pitchId} pitch={pitch} money={money} />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className="py-xs pr-sm">
                    {t('reports.table.total')}
                  </th>
                  <td className="py-xs pr-sm">{money(report.totals.collectedMinor)}</td>
                  <td className="py-xs pr-sm">{money(report.totals.pendingMinor)}</td>
                  <td className="py-xs pr-sm">
                    {formatPercent(report.totals.occupancyRate, locale)}
                  </td>
                  <td className="py-xs pr-sm">{formatDuration(report.totals.bookedMinutes)}</td>
                  <td className="py-xs pr-sm">
                    {statusSummary(report.totals.reservationsByStatus, t)}
                  </td>
                  <td className="py-xs">{peakSummary(report.totals.peakHours)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      ) : null}
    </AppFrame>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-xs rounded-lg border border-border p-sm">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="m-0 font-arvo text-xl text-text">{value}</dd>
    </div>
  );
}

function statusSummary(byStatus: Record<string, number>, t: Translate): string {
  const parts = Object.entries(byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${count} ${reservationStatus(status, t).label.toLowerCase()}`);
  return parts.length > 0 ? parts.join(', ') : '—';
}

function peakSummary(peaks: ReadonlyArray<{ hour: string; reservations: number }>): string {
  return peaks.length > 0
    ? peaks.map((peak) => `${peak.hour} (${peak.reservations})`).join(', ')
    : '—';
}

function PitchRow({
  pitch,
  money,
}: {
  pitch: PitchReport;
  money: (amountMinor: number) => string;
}) {
  const { t, i18n } = useTranslation('owner');
  const locale = i18n.language;
  return (
    <tr className="border-t border-border">
      <th scope="row" className="py-xs pr-sm font-medium">
        {pitch.name}
      </th>
      <td className="py-xs pr-sm">{money(pitch.collectedMinor)}</td>
      <td className="py-xs pr-sm">{money(pitch.pendingMinor)}</td>
      <td className="py-xs pr-sm">{formatPercent(pitch.occupancyRate, locale)}</td>
      <td className="py-xs pr-sm">{formatDuration(pitch.bookedMinutes)}</td>
      <td className="py-xs pr-sm">{statusSummary(pitch.reservationsByStatus, t)}</td>
      <td className="py-xs">{peakSummary(pitch.peakHours)}</td>
    </tr>
  );
}
