import { describe, expect, it } from 'vitest';
import { findSport, pitchSummary, SPORTS, sportIcon, sportLabel } from './sports';
import { tEn, tEs } from './__tests__/test-translate';

describe('findSport', () => {
  it('finds by slug, ignoring case, accents and separators', () => {
    expect(findSport('padel')?.value).toBe('padel');
    expect(findSport('  PADEL ')?.value).toBe('padel');
    expect(findSport('Fútbol 5')?.value).toBe('futbol-5');
    expect(findSport('futbol_7')?.value).toBe('futbol-7');
  });

  it('resolves legacy aliases', () => {
    expect(findSport('basquet')?.value).toBe('baloncesto');
  });

  it('returns undefined for empty, unknown or multi-sport slugs', () => {
    expect(findSport(null)).toBeUndefined();
    expect(findSport('')).toBeUndefined();
    expect(findSport('curling')).toBeUndefined();
    expect(findSport('multi-sport')).toBeUndefined();
  });
});

describe('sportLabel', () => {
  it('translates every known sport in both locales', () => {
    for (const sport of SPORTS) {
      expect(sportLabel(sport.value, tEn)).toBe(tEn(sport.labelKey));
      expect(sportLabel(sport.value, tEs)).toBe(tEs(sport.labelKey));
    }
  });

  it('uses the multi-sport label for empty and multi-sport slugs', () => {
    expect(sportLabel(null, tEn)).toBe('Multi-sport');
    expect(sportLabel('   ', tEn)).toBe('Multi-sport');
    expect(sportLabel('multi-sport', tEn)).toBe('Multi-sport');
    expect(sportLabel('multideporte', tEs)).toBe(tEs('sports.multiSport'));
  });

  it('humanizes unknown slugs', () => {
    expect(sportLabel('beach-volley', tEn)).toBe('Beach volley');
    expect(sportLabel('mini_golf', tEn)).toBe('Mini golf');
  });
});

describe('sportIcon', () => {
  it('uses the sport icon when known', () => {
    expect(sportIcon('padel')).toBe('racquetball');
    expect(sportIcon('tenis')).toBe('tennis');
    expect(sportIcon('basquet')).toBe('basketball');
  });

  it('guesses by family for unknown slugs', () => {
    expect(sportIcon('futbol-sala')).toBe('soccer');
    expect(sportIcon('indoor-soccer')).toBe('soccer');
    expect(sportIcon('padel-doble')).toBe('racquetball');
    expect(sportIcon('tennis-doubles')).toBe('tennis');
    expect(sportIcon('basket-3x3')).toBe('basketball');
    expect(sportIcon('basq-x')).toBe('basketball');
  });

  it('falls back to a field icon', () => {
    expect(sportIcon()).toBe('soccer-field');
    expect(sportIcon('curling')).toBe('soccer-field');
  });
});

describe('pitchSummary', () => {
  it('builds the summary with pluralization', () => {
    expect(pitchSummary({ sportType: 'padel', capacity: 4, slotDurationMinutes: 90 }, tEn)).toBe(
      `${tEn('sports.padel')} · 4 players · 90 min per slot`,
    );
    expect(
      pitchSummary({ sportType: 'padel', capacity: 1, slotDurationMinutes: 60 }, tEn),
    ).toContain('1 player ·');
    expect(pitchSummary({ sportType: null, capacity: 2, slotDurationMinutes: 30 }, tEs)).toContain(
      tEs('sports.multiSport'),
    );
  });
});
