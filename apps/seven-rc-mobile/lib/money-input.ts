/**
 * Typed amount to minor units. Accepts "30000", "30.000", "30,000", "12,50" and
 * "12.50": a separator followed by exactly three digits groups thousands,
 * followed by one or two it is the decimal mark. Anything else is null.
 */
export function parseMoneyMinor(value: string): number | null {
  const text = value.replace(/[\s$]/g, '');
  if (/^[1-9]\d{0,2}([.,])\d{3}(\1\d{3})*$/.test(text)) {
    return Number(text.replace(/[.,]/g, '')) * 100;
  }
  const match = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(text);
  if (!match) return null;
  return Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
}
