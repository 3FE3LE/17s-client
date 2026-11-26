'use client';

import { useCustomerHistoryQuery } from '@/lib/owner-queries';

interface HistorySummary {
  total: number;
  completed: number;
  noShows: number;
  lateCancels: number;
}

/** One line a decision can lean on; `null` when there is nothing worth saying. */
export function describeHistory(history: HistorySummary): string | null {
  if (history.total <= 1 && history.noShows === 0 && history.lateCancels === 0) return null;
  const parts = [
    `${history.total} ${history.total === 1 ? 'reserva' : 'reservas'} en este complejo`,
    `${history.completed} ${history.completed === 1 ? 'jugada' : 'jugadas'}`,
    `${history.noShows} ${history.noShows === 1 ? 'inasistencia' : 'inasistencias'}`,
    `${history.lateCancels} ${history.lateCancels === 1 ? 'cancelación tardía' : 'cancelaciones tardías'}`,
  ];
  return parts.join(' · ');
}

/** Record of one customer (by phone) at this venue. Informative only; it never blocks. */
export function CustomerHistoryNote({
  venueId,
  phone,
}: {
  venueId: string | null | undefined;
  phone: string | null | undefined;
}) {
  const query = useCustomerHistoryQuery(venueId, phone);
  const line = query.data ? describeHistory(query.data) : null;
  if (!line) return null;
  const warn = (query.data?.noShows ?? 0) > 0 || (query.data?.lateCancels ?? 0) > 0;
  return (
    <p
      className={`m-0 text-sm leading-[18px] ${warn ? 'text-text' : 'text-muted'}`}
      aria-live="polite"
    >
      <span className="font-bold">Historial: </span>
      {line}.
    </p>
  );
}
