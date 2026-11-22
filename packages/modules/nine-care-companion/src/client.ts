// Client-only entry — anything that touches React Query, browser fetch, or
// React providers lives here so the SSR/server entry stays tree-shakeable.

import { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import {
  CareCircleSummarySchema,
  CreateConfirmationSchema,
  DailyTimelineSchema,
  MedicationBlockInstructionsSchema,
  MedicationBlockSummarySchema,
  SlotNameSchema,
  type CareCircleSummary,
  type CreateConfirmationInput,
  type DailyTimeline,
  type MedicationBlockInstructions,
  type MedicationBlockSummary,
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

// Surface consumed by the web app + (future) mobile app. BFF route handlers
// proxy auth + body shaping; the client only sees JSON conforming to the
// zod schemas in ./index.
export type NineCcDataSource = {
  getMyCareCircle(): Promise<CareCircleSummary | null>;
  getDailyTimeline(patientId: string, dateIso?: string): Promise<DailyTimeline>;

  // Voice-shaped (alexa-mirror + caregiver dashboard) reads.
  getNextMedicationBlock(patientId: string): Promise<MedicationBlockSummary | null>;
  getMedicationBlockBySlot(
    patientId: string,
    slot: string,
    dateIso?: string,
  ): Promise<MedicationBlockSummary | null>;
  getMedicationInstructions(blockId: string): Promise<MedicationBlockInstructions>;

  // Writes.
  recordConfirmation(
    blockId: string,
    input: CreateConfirmationInput,
  ): Promise<MedicationBlockSummary>;
  recordConfirmationBySlot(
    patientId: string,
    slot: string,
    input: CreateConfirmationInput,
    dateIso?: string,
  ): Promise<MedicationBlockSummary>;
};

function jsonOrThrow<T>(schema: { parse: (raw: unknown) => T }, raw: unknown): T {
  return schema.parse(raw);
}

export function createBffNineCcDataSource(baseUrl = ''): NineCcDataSource {
  const url = (path: string): string => `${baseUrl}${path}`;

  async function get<T>(
    path: string,
    schema: { parse: (raw: unknown) => T },
    options: { allowNull?: boolean } = {},
  ): Promise<T | null> {
    const res = await fetch(url(path), { credentials: 'include' });
    if (options.allowNull && res.status === 404) return null;
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    const body = (await res.json()) as unknown;
    return jsonOrThrow(schema, body);
  }

  async function post<TReq, TRes>(
    path: string,
    body: TReq,
    schema: { parse: (raw: unknown) => TRes },
  ): Promise<TRes> {
    const res = await fetch(url(path), {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    const raw = (await res.json()) as unknown;
    return jsonOrThrow(schema, raw);
  }

  return {
    async getMyCareCircle() {
      return (
        (await get('/api/nine-cc/care-circles/me', CareCircleSummarySchema, {
          allowNull: true,
        }))
      );
    },
    async getDailyTimeline(patientId, dateIso) {
      const qs = dateIso ? `?date=${encodeURIComponent(dateIso)}` : '';
      return (
        (await get(
          `/api/nine-cc/patients/${patientId}/daily-timeline${qs}`,
          DailyTimelineSchema,
        )) as DailyTimeline
      );
    },
    async getNextMedicationBlock(patientId) {
      return (
        (await get(
          `/api/nine-cc/patients/${patientId}/medication-blocks/next`,
          MedicationBlockSummarySchema,
          { allowNull: true },
        ))
      );
    },
    async getMedicationBlockBySlot(patientId, slot, dateIso) {
      SlotNameSchema.parse(slot); // throws on bad slot
      const qs = dateIso ? `&date=${encodeURIComponent(dateIso)}` : '';
      return (
        (await get(
          `/api/nine-cc/patients/${patientId}/medication-blocks/by-slot?slot=${encodeURIComponent(slot)}${qs}`,
          MedicationBlockSummarySchema,
          { allowNull: true },
        ))
      );
    },
    async getMedicationInstructions(blockId) {
      return (await get(
        `/api/nine-cc/medication-blocks/${blockId}/instructions`,
        MedicationBlockInstructionsSchema,
      )) as MedicationBlockInstructions;
    },
    async recordConfirmation(blockId, input) {
      const body = CreateConfirmationSchema.parse(input);
      return post(
        `/api/nine-cc/medication-blocks/${blockId}/confirmations`,
        body,
        MedicationBlockSummarySchema,
      );
    },
    async recordConfirmationBySlot(patientId, slot, input, dateIso) {
      SlotNameSchema.parse(slot);
      const body = CreateConfirmationSchema.parse(input);
      const dateQ = dateIso ? `?date=${encodeURIComponent(dateIso)}` : '';
      return post(
        `/api/nine-cc/patients/${patientId}/medication-blocks/by-slot/${encodeURIComponent(slot)}/confirmations${dateQ}`,
        body,
        MedicationBlockSummarySchema,
      );
    },
  };
}

export interface NineCcClientProvidersProps {
  children: ReactNode;
}
