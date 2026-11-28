import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MobileT } from './i18n';

type SportIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SportDefinition {
  value: string;
  /** Catalog key (`mobile` namespace) of the display name. */
  labelKey: string;
  /** Players on the court for a normal match; seeds the capacity field. */
  defaultCapacity: number;
  /** Typical booking length; pádel is played in 90-minute turns. */
  defaultDurationMinutes: number;
  icon: SportIconName;
}

export const SPORTS: readonly SportDefinition[] = [
  {
    value: 'futbol-5',
    labelKey: 'sports.futbol5',
    defaultCapacity: 10,
    defaultDurationMinutes: 60,
    icon: 'soccer',
  },
  {
    value: 'futbol-7',
    labelKey: 'sports.futbol7',
    defaultCapacity: 14,
    defaultDurationMinutes: 60,
    icon: 'soccer',
  },
  {
    value: 'futbol-8',
    labelKey: 'sports.futbol8',
    defaultCapacity: 16,
    defaultDurationMinutes: 60,
    icon: 'soccer',
  },
  {
    value: 'futbol-11',
    labelKey: 'sports.futbol11',
    defaultCapacity: 22,
    defaultDurationMinutes: 90,
    icon: 'soccer',
  },
  {
    value: 'padel',
    labelKey: 'sports.padel',
    defaultCapacity: 4,
    defaultDurationMinutes: 90,
    icon: 'racquetball',
  },
  {
    value: 'tenis',
    labelKey: 'sports.tenis',
    defaultCapacity: 4,
    defaultDurationMinutes: 60,
    icon: 'tennis',
  },
  {
    value: 'baloncesto',
    labelKey: 'sports.baloncesto',
    defaultCapacity: 10,
    defaultDurationMinutes: 60,
    icon: 'basketball',
  },
  {
    value: 'voleibol',
    labelKey: 'sports.voleibol',
    defaultCapacity: 12,
    defaultDurationMinutes: 60,
    icon: 'volleyball',
  },
] as const;

/** Slugs older app versions saved; new courts use the same slugs as the web app. */
const SLUG_ALIASES: Record<string, string> = {
  basquet: 'baloncesto',
  'multi-sport': 'multideporte',
};

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s_]+/g, '-');
}

export function findSport(slug?: string | null): SportDefinition | undefined {
  if (!slug) return undefined;
  const normalized = normalize(slug);
  const key = SLUG_ALIASES[normalized] ?? normalized;
  return SPORTS.find((sport) => sport.value === key);
}

/** "futbol-5" -> "Fútbol 5". Unknown slugs are humanized instead of shown raw. */
export function sportLabel(slug: string | null | undefined, t: MobileT): string {
  const known = findSport(slug);
  if (known) return t(known.labelKey);
  if (!slug?.trim() || SLUG_ALIASES[normalize(slug)] === 'multideporte') {
    return t('sports.multiSport');
  }
  const words = slug.trim().replace(/[-_]+/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** One glyph per sport family: ball for fútbol, racket for pádel/tenis. */
export function sportIcon(slug?: string | null): SportIconName {
  const known = findSport(slug);
  if (known) return known.icon;
  const key = slug ? normalize(slug) : '';
  if (key.includes('futbol') || key.includes('soccer')) return 'soccer';
  if (key.includes('padel')) return 'racquetball';
  if (key.includes('tenis') || key.includes('tennis')) return 'tennis';
  if (key.includes('basq') || key.includes('basket')) return 'basketball';
  return 'soccer-field';
}

/** "Fútbol 5 · 10 jugadores · 60 min por turno" (per locale). */
export function pitchSummary(
  pitch: {
    sportType?: string | null;
    capacity: number;
    slotDurationMinutes: number;
  },
  t: MobileT,
): string {
  return t('sports.pitchSummary', {
    sport: sportLabel(pitch.sportType, t),
    count: pitch.capacity,
    minutes: pitch.slotDurationMinutes,
  });
}
