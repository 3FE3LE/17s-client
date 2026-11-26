import { describe, expect, it } from 'vitest';
import { describeHistory } from './customer-history-note';

describe('describeHistory', () => {
  it('says nothing for a first-time customer', () => {
    expect(describeHistory({ total: 1, completed: 0, noShows: 0, lateCancels: 0 })).toBeNull();
  });

  it('summarizes counts with singular and plural', () => {
    expect(describeHistory({ total: 4, completed: 1, noShows: 1, lateCancels: 2 })).toBe(
      '4 reservas en este complejo · 1 jugada · 1 inasistencia · 2 cancelaciones tardías',
    );
  });

  it('speaks up for a single reservation that already went wrong', () => {
    expect(describeHistory({ total: 1, completed: 0, noShows: 1, lateCancels: 0 })).toContain(
      '1 inasistencia',
    );
  });
});
