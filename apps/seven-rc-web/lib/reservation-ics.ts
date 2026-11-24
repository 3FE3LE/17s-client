export interface IcsEventInput {
  /** Stable unique id, e.g. the public reservation token. */
  uid: string;
  startAt: string;
  endAt: string;
  summary: string;
  location?: string | null;
  description?: string | null;
  /** Injected for tests; defaults to now. */
  now?: Date;
}

/** `20261010T010000Z`: UTC, so the event lands at the venue's local hour in any calendar. */
function icsInstant(value: string | Date): string {
  const iso = (value instanceof Date ? value : new Date(value)).toISOString();
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

/** RFC 5545 TEXT escaping. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Folds lines over 75 octets with CRLF + space, as the RFC requires. */
function fold(line: string): string {
  const parts: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest) > 75) {
    let cut = 75;
    while (Buffer.byteLength(rest.slice(0, cut)) > 75) cut -= 1;
    parts.push(rest.slice(0, cut));
    rest = ` ${rest.slice(cut)}`;
  }
  parts.push(rest);
  return parts.join('\r\n');
}

export function buildIcs(input: IcsEventInput): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//17Suit//Seven Reservations Club//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeText(input.uid)}@17suit`,
    `DTSTAMP:${icsInstant(input.now ?? new Date())}`,
    `DTSTART:${icsInstant(input.startAt)}`,
    `DTEND:${icsInstant(input.endAt)}`,
    `SUMMARY:${escapeText(input.summary)}`,
  ];
  if (input.location) lines.push(`LOCATION:${escapeText(input.location)}`);
  if (input.description) lines.push(`DESCRIPTION:${escapeText(input.description)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
