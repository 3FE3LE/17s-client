import { describe, expect, it, vi, beforeEach } from 'vitest';

import {
  CareCircleSummarySchema,
  CreateConfirmationSchema,
  DailyTimelineSchema,
  MedicationBlockInstructionsSchema,
  MedicationBlockSummarySchema,
  SlotNameSchema,
  validateCareCircleSummary,
  validateCreateConfirmation,
  validateDailyTimeline,
  validateMedicationBlockInstructions,
  validateMedicationBlockSummary,
} from './index';
import { createBffNineCcDataSource } from './client';

describe('nine-care-companion zod schemas', () => {
  const baseSummary = {
    id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
    patientId: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
    patientDisplayName: 'Miriam',
    members: [
      {
        id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
        role: 'PRIMARY',
        caregiverId: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
        displayName: 'Sara',
      },
    ],
    blocksToday: 4,
    blocksPendingToday: 3,
    blocksConfirmedToday: 1,
    blocksMissedToday: 0,
  };

  it('round-trips a CareCircleSummary', () => {
    const parsed = CareCircleSummarySchema.parse(baseSummary);
    expect(parsed.patientDisplayName).toBe('Miriam');
    expect(validateCareCircleSummary(baseSummary).blocksToday).toBe(4);
  });

  it('rejects CareCircleSummary with negative counts', () => {
    expect(() =>
      CareCircleSummarySchema.parse({ ...baseSummary, blocksPendingToday: -1 }),
    ).toThrow();
  });

  it('round-trips a DailyTimeline', () => {
    const timeline = {
      patientId: baseSummary.patientId,
      date: '2026-07-01',
      blocks: [
        {
          id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
          scheduledAt: '2026-07-01T08:00:00.000Z',
          medicationName: 'Losartán',
          dosage: '50mg',
          critical: true,
          status: 'PENDING',
          confirmation: null,
        },
      ],
    };
    const parsed = DailyTimelineSchema.parse(timeline);
    expect(parsed.blocks).toHaveLength(1);
    expect(validateDailyTimeline(timeline).blocks[0]?.medicationName).toBe('Losartán');
  });

  it('rejects DailyTimeline with bad date format', () => {
    expect(() =>
      DailyTimelineSchema.parse({ ...baseSummary, date: '07-01-2026', blocks: [] }),
    ).toThrow();
  });

  it('round-trips a MedicationBlockSummary (voice-shaped)', () => {
    const summary = {
      id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
      scheduledAt: '2026-07-01T14:00:00.000Z',
      medicationName: 'Aspirina',
      dosage: '100mg',
      critical: false,
      status: 'CONFIRMED',
      voiceLine: 'Aspirina, 100mg',
    };
    expect(MedicationBlockSummarySchema.parse(summary).voiceLine).toBe('Aspirina, 100mg');
    expect(validateMedicationBlockSummary(summary).status).toBe('CONFIRMED');
  });

  it('round-trips a MedicationBlockInstructions DTO', () => {
    const dto = {
      blockId: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
      patientDisplayName: 'Miriam',
      slotLabelEs: 'la toma de la mañana',
      scheduledAt: '2026-07-01T08:00:00.000Z',
      status: 'PENDING',
      instructions: 'Losartán, 50mg.',
    };
    expect(MedicationBlockInstructionsSchema.parse(dto).slotLabelEs).toBe(
      'la toma de la mañana',
    );
    expect(validateMedicationBlockInstructions(dto).instructions).toBe('Losartán, 50mg.');
  });

  it('validates CreateConfirmation inputs', () => {
    expect(CreateConfirmationSchema.parse({ status: 'taken' }).status).toBe('taken');
    expect(
      CreateConfirmationSchema.parse({ status: 'skipped', notes: 'pospuesta' }).notes,
    ).toBe('pospuesta');
    expect(() => CreateConfirmationSchema.parse({ status: 'nope' })).toThrow();
    expect(() =>
      CreateConfirmationSchema.parse({ status: 'taken', notes: 'x'.repeat(501) }),
    ).toThrow();
    expect(validateCreateConfirmation({ status: 'unknown' }).status).toBe('unknown');
  });

  it('exposes the canonical slot vocabulary', () => {
    for (const slot of ['morning', 'afternoon', 'evening', 'night'] as const) {
      expect(SlotNameSchema.parse(slot)).toBe(slot);
    }
    expect(() => SlotNameSchema.parse('dawn')).toThrow();
  });
});

describe('createBffNineCcDataSource', () => {
  const summaryJson = {
    id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
    patientId: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
    patientDisplayName: 'Miriam',
    members: [],
    blocksToday: 0,
    blocksPendingToday: 0,
    blocksConfirmedToday: 0,
    blocksMissedToday: 0,
  };

  const timelineJson = {
    patientId: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
    date: '2026-07-01',
    blocks: [],
  };

  const summaryNext = {
    id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
    scheduledAt: '2026-07-01T14:00:00.000Z',
    medicationName: 'Aspirina',
    dosage: '100mg',
    critical: false,
    status: 'CONFIRMED',
    voiceLine: 'Aspirina, 100mg',
  };

  const instructionsJson = {
    blockId: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaab',
    patientDisplayName: 'Miriam',
    slotLabelEs: 'la toma de la mañana',
    scheduledAt: '2026-07-01T08:00:00.000Z',
    status: 'PENDING',
    instructions: 'Losartán, 50mg.',
  };

  function mockFetchOnce(status: number, body: unknown): ReturnType<typeof vi.fn> {
    return vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
    );
  }

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null on 404 for getMyCareCircle', async () => {
    globalThis.fetch = mockFetchOnce(404, { error: 'no circle' }) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    const result = await ds.getMyCareCircle();
    expect(result).toBeNull();
  });

  it('parses a CareCircleSummary on 200', async () => {
    globalThis.fetch = mockFetchOnce(200, summaryJson) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    const result = await ds.getMyCareCircle();
    expect(result?.patientDisplayName).toBe('Miriam');
  });

  it('throws on non-2xx for getDailyTimeline', async () => {
    globalThis.fetch = mockFetchOnce(500, { error: 'oops' }) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    await expect(ds.getDailyTimeline('p-1')).rejects.toThrow(/500/);
  });

  it('parses a DailyTimeline', async () => {
    globalThis.fetch = mockFetchOnce(200, timelineJson) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    const result = await ds.getDailyTimeline('p-1');
    expect(result.date).toBe('2026-07-01');
  });

  it('getNextMedicationBlock returns null on 404', async () => {
    globalThis.fetch = mockFetchOnce(404, {}) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    const result = await ds.getNextMedicationBlock('p-1');
    expect(result).toBeNull();
  });

  it('getNextMedicationBlock parses the summary', async () => {
    globalThis.fetch = mockFetchOnce(200, summaryNext) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    const result = await ds.getNextMedicationBlock('p-1');
    expect(result?.voiceLine).toBe('Aspirina, 100mg');
  });

  it('getMedicationInstructions parses the DTO', async () => {
    globalThis.fetch = mockFetchOnce(200, instructionsJson) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    const result = await ds.getMedicationInstructions('b-1');
    expect(result.slotLabelEs).toBe('la toma de la mañana');
  });

  it('recordConfirmation POSTs and parses', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(summaryNext), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      ) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    const result = await ds.recordConfirmation('b-1', { status: 'taken' });
    expect(result.id).toBe(summaryNext.id);
    const call = (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[0]).toBe('/api/nine-cc/medication-blocks/b-1/confirmations');
    expect((call?.[1] as RequestInit).method).toBe('POST');
  });

  it('recordConfirmationBySlot validates the slot', async () => {
    const ds = createBffNineCcDataSource();
    await expect(
      ds.recordConfirmationBySlot('p-1', 'dawn', { status: 'taken' }),
    ).rejects.toThrow();
  });

  it('rejects malformed server payloads', async () => {
    globalThis.fetch = mockFetchOnce(200, { id: 'not-a-uuid' }) as unknown as typeof fetch;
    const ds = createBffNineCcDataSource();
    await expect(ds.getMyCareCircle()).rejects.toThrow();
  });
});
