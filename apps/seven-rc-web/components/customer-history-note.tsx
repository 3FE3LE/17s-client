'use client';

import { useTranslation } from '@17suit/i18n/react';
import type { TranslateFn } from '@17suit/i18n';
import { useCustomerHistoryQuery } from '@/lib/owner-queries';

interface HistorySummary {
  total: number;
  completed: number;
  noShows: number;
  lateCancels: number;
}

/** One line a decision can lean on; `null` when there is nothing worth saying. */
export function describeHistory(history: HistorySummary, t: TranslateFn): string | null {
  if (history.total <= 1 && history.noShows === 0 && history.lateCancels === 0) return null;
  const parts = [
    t('customerHistory.reservations', { count: history.total }),
    t('customerHistory.completed', { count: history.completed }),
    t('customerHistory.noShows', { count: history.noShows }),
    t('customerHistory.lateCancels', { count: history.lateCancels }),
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
  const { t } = useTranslation('owner');
  const query = useCustomerHistoryQuery(venueId, phone);
  const line = query.data ? describeHistory(query.data, t) : null;
  if (!line) return null;
  const warn = (query.data?.noShows ?? 0) > 0 || (query.data?.lateCancels ?? 0) > 0;
  return (
    <p
      className={`m-0 text-sm leading-[18px] ${warn ? 'text-text' : 'text-muted'}`}
      aria-live="polite"
    >
      <span className="font-bold">{t('customerHistory.label')} </span>
      {line}.
    </p>
  );
}
