import { z } from 'zod';

/** Integer typed as text (HTML and RN inputs give strings) within an inclusive range. */
export function intInRange(min: number, max: number, message: string) {
  return z.string().refine((value) => {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) return false;
    const parsed = Number(trimmed);
    return parsed >= min && parsed <= max;
  }, message);
}

/** Same as {@link intInRange} but an empty string is accepted (optional field). */
export function optionalIntInRange(min: number, max: number, message: string) {
  return z.string().refine((value) => {
    const trimmed = value.trim();
    if (trimmed === '') return true;
    if (!/^-?\d+$/.test(trimmed)) return false;
    const parsed = Number(trimmed);
    return parsed >= min && parsed <= max;
  }, message);
}
