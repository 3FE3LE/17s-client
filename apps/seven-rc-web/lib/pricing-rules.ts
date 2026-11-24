/** Mirrors `resolveSlotPrice` in 17s-server `domain/slots.ts`: keep both in sync. */

export interface PriceRuleInput {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  priceMinor: number;
}

export const MAX_PRICE_RULES = 20;

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export function toMinutes(hhmm: string): number {
  const [hours = 0, minutes = 0] = hhmm.split(':').map(Number);
  return hours * 60 + minutes;
}

/** End-of-range minute; 00:00 means midnight (end of day). */
export function toEndMinutes(hhmm: string): number {
  const minutes = toMinutes(hhmm);
  return minutes === 0 ? 24 * 60 : minutes;
}

/** First rule covering the slot start wins; otherwise the base price. */
export function resolveSlotPrice(
  basePriceMinor: number,
  rules: readonly PriceRuleInput[],
  dayOfWeek: number,
  startMinutes: number,
): number {
  const rule = rules.find(
    (candidate) =>
      candidate.daysOfWeek.includes(dayOfWeek) &&
      startMinutes >= toMinutes(candidate.startTime) &&
      startMinutes < toEndMinutes(candidate.endTime),
  );
  return rule ? rule.priceMinor : basePriceMinor;
}

/** Spanish message for a single invalid rule, or null. */
export function validateRule(rule: PriceRuleInput): string | null {
  if (rule.daysOfWeek.length === 0) return 'Elige al menos un día.';
  if (!HHMM.test(rule.startTime) || !HHMM.test(rule.endTime)) {
    return 'Elige hora de inicio y de fin.';
  }
  if (toEndMinutes(rule.endTime) <= toMinutes(rule.startTime)) {
    return 'La hora de fin debe ser posterior a la de inicio.';
  }
  if (!Number.isInteger(rule.priceMinor) || rule.priceMinor < 0) return 'Escribe un precio válido.';
  return null;
}

function overlaps(a: PriceRuleInput, b: PriceRuleInput): boolean {
  const sharesDay = a.daysOfWeek.some((day) => b.daysOfWeek.includes(day));
  return (
    sharesDay &&
    toMinutes(a.startTime) < toEndMinutes(b.endTime) &&
    toMinutes(b.startTime) < toEndMinutes(a.endTime)
  );
}

/** Index pairs `[i, j]` (i < j) of rules that cover the same day and time. */
export function findOverlaps(rules: readonly PriceRuleInput[]): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  rules.forEach((rule, i) => {
    for (let j = i + 1; j < rules.length; j += 1) {
      const other = rules[j];
      if (other && overlaps(rule, other)) pairs.push([i, j]);
    }
  });
  return pairs;
}

export interface PriceBand {
  from: string;
  to: string;
  priceMinor: number;
}

function formatMinutes(minutes: number): string {
  const wrapped = minutes % (24 * 60);
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
}

/**
 * Effective price per slot for one day, merged into bands of equal consecutive price.
 * Slots start at `openTime` and step by `slotMinutes` while they still fit before close.
 */
export function effectiveBands(input: {
  basePriceMinor: number;
  rules: readonly PriceRuleInput[];
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  slotMinutes: number;
}): PriceBand[] {
  const { basePriceMinor, rules, dayOfWeek, openTime, closeTime, slotMinutes } = input;
  if (slotMinutes <= 0) return [];
  const open = toMinutes(openTime);
  const close = toEndMinutes(closeTime);
  const bands: PriceBand[] = [];
  for (let start = open; start + slotMinutes <= close; start += slotMinutes) {
    const priceMinor = resolveSlotPrice(basePriceMinor, rules, dayOfWeek, start);
    const last = bands[bands.length - 1];
    const end = formatMinutes(start + slotMinutes);
    if (last && last.priceMinor === priceMinor) last.to = end;
    else bands.push({ from: formatMinutes(start), to: end, priceMinor });
  }
  return bands;
}
