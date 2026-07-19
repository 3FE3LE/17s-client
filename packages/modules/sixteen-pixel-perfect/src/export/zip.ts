import { crc32 } from './crc32';
import { encodeUtf8 } from './utf8';

/**
 * Minimal, dependency-free, deterministic ZIP writer (STORE / no compression).
 *
 * Fixed mod time/date (0) and stored method ⇒ identical inputs produce
 * byte-identical archives. Paths use forward slashes and are relative (no
 * leading slash), so the archive mirrors a directory tree when extracted.
 */
export interface ZipEntry {
  /** Relative path with forward slashes, e.g. `assets/ui/generated/panel/panel.png`. */
  path: string;
  bytes: Uint8Array;
}

function pushU16(out: number[], value: number): void {
  out.push(value & 0xff, (value >>> 8) & 0xff);
}

function pushU32(out: number[], value: number): void {
  out.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function pushBytes(out: number[], bytes: Uint8Array): void {
  for (let i = 0; i < bytes.length; i += 1) out.push(bytes[i]!);
}

export function encodeZip(entries: readonly ZipEntry[]): Uint8Array {
  const local: number[] = [];
  const central: number[] = [];
  const offsets: number[] = [];

  for (const entry of entries) {
    const nameBytes = encodeUtf8(entry.path);
    const crc = crc32(entry.bytes);
    const size = entry.bytes.length;
    offsets.push(local.length);

    // Local file header.
    pushU32(local, 0x04034b50);
    pushU16(local, 20); // version needed
    pushU16(local, 0); // flags
    pushU16(local, 0); // method: stored
    pushU16(local, 0); // mod time (fixed)
    pushU16(local, 0); // mod date (fixed)
    pushU32(local, crc);
    pushU32(local, size); // compressed size == size (stored)
    pushU32(local, size); // uncompressed size
    pushU16(local, nameBytes.length);
    pushU16(local, 0); // extra length
    pushBytes(local, nameBytes);
    pushBytes(local, entry.bytes);
  }

  const cdStart = local.length;
  entries.forEach((entry, i) => {
    const nameBytes = encodeUtf8(entry.path);
    const crc = crc32(entry.bytes);
    const size = entry.bytes.length;

    pushU32(central, 0x02014b50);
    pushU16(central, 20); // version made by
    pushU16(central, 20); // version needed
    pushU16(central, 0); // flags
    pushU16(central, 0); // method
    pushU16(central, 0); // mod time
    pushU16(central, 0); // mod date
    pushU32(central, crc);
    pushU32(central, size);
    pushU32(central, size);
    pushU16(central, nameBytes.length);
    pushU16(central, 0); // extra length
    pushU16(central, 0); // comment length
    pushU16(central, 0); // disk number start
    pushU16(central, 0); // internal attrs
    pushU32(central, 0); // external attrs
    pushU32(central, offsets[i]!); // local header offset
    pushBytes(central, nameBytes);
  });

  const cdSize = central.length;
  const end: number[] = [];
  pushU32(end, 0x06054b50);
  pushU16(end, 0); // disk number
  pushU16(end, 0); // cd start disk
  pushU16(end, entries.length); // entries on this disk
  pushU16(end, entries.length); // total entries
  pushU32(end, cdSize);
  pushU32(end, cdStart);
  pushU16(end, 0); // comment length

  return Uint8Array.from(local.concat(central, end));
}
