import { describe, expect, it } from 'vitest';
import { buildIcs } from './reservation-ics';

const base = {
  uid: 'abc',
  startAt: '2026-10-10T01:00:00.000Z',
  endAt: '2026-10-10T02:00:00.000Z',
  summary: 'Cancha 1 · Cancha La 70',
  now: new Date('2026-10-05T15:00:00.000Z'),
};

describe('buildIcs', () => {
  it('emits UTC start/end so the calendar shows the venue hour', () => {
    const ics = buildIcs(base);
    expect(ics).toContain('DTSTART:20261010T010000Z\r\n');
    expect(ics).toContain('DTEND:20261010T020000Z\r\n');
    expect(ics).toContain('DTSTAMP:20261005T150000Z\r\n');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('escapes commas, semicolons, backslashes and newlines in text', () => {
    const ics = buildIcs({ ...base, location: 'Calle 1, Cali; Valle', description: 'a\nb\\c' });
    expect(ics).toContain('LOCATION:Calle 1\\, Cali\; Valle\r\n');
    expect(ics).toContain('DESCRIPTION:a\\nb\\\\c\r\n');
  });

  it('folds long lines at 75 octets', () => {
    const ics = buildIcs({ ...base, description: 'x'.repeat(200) });
    for (const line of ics.split('\r\n')) {
      expect(Buffer.byteLength(line)).toBeLessThanOrEqual(75);
    }
  });

  it('omits optional fields when absent', () => {
    const ics = buildIcs(base);
    expect(ics).not.toContain('LOCATION');
    expect(ics).not.toContain('DESCRIPTION');
  });
});
