// Client-only entry — anything that touches React Query, browser fetch, or
// React providers lives here so the SSR/server entry stays tree-shakeable.

import { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import {
  CareCircleSummarySchema,
  DailyTimelineSchema,
  type CareCircleSummary,
  type DailyTimeline,
} from './index';

export function createNineCcQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

// Day-1 surface: care circle summaries and daily timelines are server-owned.
// Clients fetch through the app's BFF route handlers (which proxy + authorise
// against the backend). The surface schema is shared from `./index`.
export type NineCcDataSource = {
  getMyCareCircle(): Promise<CareCircleSummary | null>;
  getDailyTimeline(patientId: string, dateIso?: string): Promise<DailyTimeline>;
};

export function createBffNineCcDataSource(baseUrl = ''): NineCcDataSource {
  return {
    async getMyCareCircle() {
      const res = await fetch(`${baseUrl}/api/nine-cc/care-circles/me`, {
        credentials: 'include',
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`getMyCareCircle failed: ${res.status}`);
      const body = (await res.json()) as unknown;
      return CareCircleSummarySchema.parse(body);
    },
    async getDailyTimeline(patientId, dateIso) {
      const params = dateIso ? `?date=${encodeURIComponent(dateIso)}` : '';
      const res = await fetch(
        `${baseUrl}/api/nine-cc/patients/${patientId}/daily-timeline${params}`,
        { credentials: 'include' },
      );
      if (!res.ok) throw new Error(`getDailyTimeline failed: ${res.status}`);
      const body = (await res.json()) as unknown;
      return DailyTimelineSchema.parse(body);
    },
  };
}

export interface NineCcClientProvidersProps {
  children: ReactNode;
}
