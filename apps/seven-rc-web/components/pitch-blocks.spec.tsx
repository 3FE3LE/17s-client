// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createBlock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  usePitchBlocksQuery: () => ({ data: [], isLoading: false, error: null, refetch: vi.fn() }),
  useCreatePitchBlockMutation: () => ({ mutateAsync: createBlock, isPending: false }),
  useDeletePitchBlockMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

import { PitchBlocksSection } from './pitch-blocks';
import type { PitchWithPricing } from '@/lib/owner-queries';

const pitch = { id: 'p1', name: 'Cancha 1', sportType: 'football' } as unknown as PitchWithPricing;

function renderSection() {
  render(<PitchBlocksSection pitches={[pitch]} timeZone="America/Bogota" todayKey="2099-01-10" />);
}

async function setTime(label: string, value: string) {
  const input = screen.getByLabelText(label);
  await userEvent.clear(input);
  await userEvent.type(input, value);
}

beforeEach(() => {
  createBlock.mockReset();
  createBlock.mockResolvedValue({
    startAt: '2099-01-10T15:00:00.000Z',
    endAt: '2099-01-10T16:00:00.000Z',
  });
});

describe('PitchBlocksSection form', () => {
  it('asks for both times inline and never calls the server', async () => {
    renderSection();
    await userEvent.click(screen.getByRole('button', { name: 'Bloquear horario' }));

    expect(await screen.findByText('Elige la hora de inicio.')).toBeTruthy();
    expect(screen.getByText('Elige la hora de fin.')).toBeTruthy();
    expect(createBlock).not.toHaveBeenCalled();
  });

  it('rejects an end time that is not after the start', async () => {
    renderSection();
    await setTime('Desde', '10:00');
    await setTime('Hasta', '09:00');
    await userEvent.click(screen.getByRole('button', { name: 'Bloquear horario' }));

    expect(
      await screen.findByText('La hora de fin debe ser posterior a la de inicio.'),
    ).toBeTruthy();
    expect(createBlock).not.toHaveBeenCalled();
  });

  it('creates the block with ISO instants in the venue zone', async () => {
    renderSection();
    await setTime('Desde', '10:00');
    await setTime('Hasta', '11:00');
    await userEvent.click(screen.getByRole('button', { name: 'Bloquear horario' }));

    expect(await screen.findByText(/Cancha 1 bloqueada/)).toBeTruthy();
    expect(createBlock).toHaveBeenCalledWith({
      startAt: '2099-01-10T15:00:00.000Z',
      endAt: '2099-01-10T16:00:00.000Z',
    });
  });
});
