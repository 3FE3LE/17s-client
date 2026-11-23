/** E.164: "+" then 8 to 15 digits, first digit not zero. */
export const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

/** Accepts "+57 300 123 4567" or a local Colombian mobile ("300 123 4567"). */
export function normalizePhone(value: string, countryCode: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const compact = trimmed.replace(/[\s().-]/g, '');
  if (compact.startsWith('+')) return compact;
  if (countryCode === 'CO' && /^3\d{9}$/.test(compact)) return `+57${compact}`;
  return compact;
}
