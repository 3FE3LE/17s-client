import { describe, expect, it } from 'vitest';
import { timeZoneCity, venueTimeLabel } from './timezone-label';
import { tEn, tEs } from './__tests__/test-translate';

describe('timeZoneCity', () => {
  it('uses the catalog name for known zones', () => {
    expect(timeZoneCity('America/Bogota', tEn)).toBe('Bogotá');
    expect(timeZoneCity('America/Mexico_City', tEn)).toBe('Mexico City');
  });

  it('humanizes the last segment of unknown zones', () => {
    expect(timeZoneCity('America/Port_of_Spain', tEn)).toBe('Port of Spain');
    expect(timeZoneCity('Nowhere', tEn)).toBe('Nowhere');
  });
});

describe('venueTimeLabel', () => {
  it('uses the generic label without a zone', () => {
    expect(venueTimeLabel(null, tEn)).toBe('Venue time');
    expect(venueTimeLabel(undefined, tEs)).toBe(tEs('timeLabel.venue'));
  });

  it('uses the UTC label for UTC aliases', () => {
    expect(venueTimeLabel('UTC', tEn)).toBe('UTC time');
    expect(venueTimeLabel('Etc/UTC', tEn)).toBe('UTC time');
  });

  it('includes the city otherwise, per locale', () => {
    expect(venueTimeLabel('America/Bogota', tEn)).toBe('Bogotá time');
    expect(venueTimeLabel('America/Bogota', tEs)).toBe(tEs('timeLabel.city', { city: 'Bogotá' }));
    expect(venueTimeLabel('America/Bogota', tEs)).not.toBe('Bogotá time');
  });
});
