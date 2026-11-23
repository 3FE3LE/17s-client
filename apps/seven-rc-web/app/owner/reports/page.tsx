'use client';

import {
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppFrame, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
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
  formatDuration,
  formatMoneyMinor,
  reservationStatus,
  safeTimeZone,
} from '@/lib/seven-rc-format';

export default function OwnerReportsPage() {
  const router = useRouter();
  const { role, isLoading } = useCurrentUserRoleQuery();
  useRoleGate({ required: 'OWNER', router });

  if (isLoading || role !== 'OWNER') {
    return (
      <AppFrame appName="Reportes" subtitle="Cargando tu cuenta…">
        <ListSkeleton rows={3} label="Cargando tu cuenta" />
      </AppFrame>
    );
  }
  return <ReportsWorkspace />;
}

const percent = new Intl.NumberFormat('es-CO', { style: 'percent', maximumFractionDigits: 0 });

function ReportsWorkspace() {
  const venuesQuery = useOwnerVenuesQuery();
  const venues = venuesQuery.data ?? [];
  const [explicitVenueId, setExplicitVenueId] = useState<string | null>(null);
  const venue = venues.find((item) => item.id === explicitVenueId) ?? venues[0] ?? null;
  const timeZone = safeTimeZone(venue?.timezone);
  const today = dateKeyInTimeZone(new Date(), timeZone);

  // Draft is what the inputs show; `applied` is what the queries run on (set on submit).
  const [draft, setDraft] = useState<{ from: string; to: string } | null>(null);
  const [applied, setApplied] = useState<{ from: string; to: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const defaults = { from: addDaysToDateKey(today, -29), to: today };
  const shown = draft ?? defaults;
  const period = applied ?? defaults;

  const venueId = venue?.id ?? null;
  const reportQuery = useOwnerVenueReportQuery(venueId, period.from, period.to);
  const reservationsQuery = useOwnerVenueReservationsQuery(venueId, period.from, period.to);
  const report = reportQuery.data ?? null;
  const currency = report?.currency ?? venue?.currency ?? 'COP';
  const money = (amountMinor: number) => formatMoneyMinor(amountMinor, currency);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validatePeriod(shown.from, shown.to);
    setFormError(message);
    if (!message) setApplied({ ...shown });
  }

  function preset(days: number) {
    const next = { from: addDaysToDateKey(today, -(days - 1)), to: today };
    setDraft(next);
    setFormError(null);
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
    ? describeError(reportQuery.error, 'No se pudo cargar el reporte.')
    : null;
  const listError = reservationsQuery.error
    ? describeError(reservationsQuery.error, 'No se pudieron cargar las reservas para exportar.')
    : null;
  const empty =
    report !== null && report.totals.reservationsByStatus
      ? Object.values(report.totals.reservationsByStatus).every((count) => count === 0)
      : false;

  return (
    <AppFrame
      appName="Reportes"
      subtitle={
        venue ? `${venue.name} · ingresos y ocupación en hora del complejo` : 'Sin complejo'
      }
    >
      <p className="m-0">
        <Link href="/owner" className="text-text underline">
          Volver a mi complejo
        </Link>
      </p>

      {venuesQuery.error ? (
        <InlineError
          message={describeError(venuesQuery.error, 'No se pudieron cargar tus complejos.')}
        />
      ) : null}

      {venues.length > 1 ? (
        <div className="max-w-[var(--container-form)]">
          <SelectField
            label="Complejo"
            name="complejo"
            value={venue?.id ?? ''}
            onChangeValue={setExplicitVenueId}
            options={venues.map((item) => ({ value: item.id, label: item.name }))}
          />
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        aria-labelledby="reporte-periodo"
        className="grid max-w-[var(--container-form)] gap-sm"
        noValidate
      >
        <SectionHeader id="reporte-periodo" title="Período" />
        <div className="grid gap-sm sm:grid-cols-2">
          <AppInput
            label="Desde"
            name="desde"
            type="date"
            value={shown.from}
            onChangeText={(value) => setDraft({ ...shown, from: value })}
          />
          <AppInput
            label="Hasta"
            name="hasta"
            type="date"
            value={shown.to}
            onChangeText={(value) => setDraft({ ...shown, to: value })}
          />
        </div>
        <InlineError message={formError} />
        <div className="flex flex-wrap gap-sm">
          <AppButton type="submit" fullWidth={false}>
            Ver reporte
          </AppButton>
          {[7, 30, 90].map((days) => (
            <AppButton key={days} variant="neutral" fullWidth={false} onPress={() => preset(days)}>
              Últimos {days} días
            </AppButton>
          ))}
        </div>
      </form>

      {loading ? <ListSkeleton rows={3} label="Cargando reporte" /> : null}

      {reportError ? (
        <div className="grid gap-sm">
          <InlineError message={reportError} />
          <AppButton variant="neutral" fullWidth={false} onPress={() => void reportQuery.refetch()}>
            Reintentar
          </AppButton>
        </div>
      ) : null}

      {report && !loading ? (
        <section aria-labelledby="reporte-resumen" className="grid gap-md">
          <SectionHeader
            id="reporte-resumen"
            title="Resumen"
            description={`${formatDateKey(report.dateFrom, { day: 'numeric', month: 'short', year: 'numeric' })} – ${formatDateKey(report.dateTo, { day: 'numeric', month: 'short', year: 'numeric' })}`}
            aside={
              <AppButton
                variant="neutral"
                fullWidth={false}
                onPress={downloadCsv}
                disabled={!reservationsQuery.data || reservationsQuery.data.length === 0}
              >
                Exportar CSV
              </AppButton>
            }
          />
          <InlineError message={listError} />

          {empty ? (
            <p role="status" className="m-0 text-md text-muted">
              No hay reservas en este período. Prueba con un rango más amplio.
            </p>
          ) : null}

          <dl className="m-0 grid gap-sm sm:grid-cols-3">
            <Metric label="Cobrado" value={money(report.totals.collectedMinor)} />
            <Metric label="Por cobrar" value={money(report.totals.pendingMinor)} />
            <Metric label="Ocupación" value={percent.format(report.totals.occupancyRate)} />
          </dl>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-md">
              <caption className="pb-xs text-left text-sm text-muted">
                Detalle por cancha del período seleccionado
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="py-xs pr-sm">
                    Cancha
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    Cobrado
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    Por cobrar
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    Ocupación
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    Horas reservadas
                  </th>
                  <th scope="col" className="py-xs pr-sm">
                    Reservas
                  </th>
                  <th scope="col" className="py-xs">
                    Horas pico
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
                    Total
                  </th>
                  <td className="py-xs pr-sm">{money(report.totals.collectedMinor)}</td>
                  <td className="py-xs pr-sm">{money(report.totals.pendingMinor)}</td>
                  <td className="py-xs pr-sm">{percent.format(report.totals.occupancyRate)}</td>
                  <td className="py-xs pr-sm">{formatDuration(report.totals.bookedMinutes)}</td>
                  <td className="py-xs pr-sm">
                    {statusSummary(report.totals.reservationsByStatus)}
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

function statusSummary(byStatus: Record<string, number>): string {
  const parts = Object.entries(byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${count} ${reservationStatus(status).label.toLowerCase()}`);
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
  return (
    <tr className="border-t border-border">
      <th scope="row" className="py-xs pr-sm font-medium">
        {pitch.name}
      </th>
      <td className="py-xs pr-sm">{money(pitch.collectedMinor)}</td>
      <td className="py-xs pr-sm">{money(pitch.pendingMinor)}</td>
      <td className="py-xs pr-sm">{percent.format(pitch.occupancyRate)}</td>
      <td className="py-xs pr-sm">{formatDuration(pitch.bookedMinutes)}</td>
      <td className="py-xs pr-sm">{statusSummary(pitch.reservationsByStatus)}</td>
      <td className="py-xs">{peakSummary(pitch.peakHours)}</td>
    </tr>
  );
}
