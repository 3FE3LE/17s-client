// Minimal in-memory stand-in for the 17s-server public venue API (`/api/7rc/public/*`).
// The Next server fetches this API server-side, so the browser cannot intercept it:
// E2E points `API_BASE_URL` here instead. Response bodies are typed with the generated
// OpenAPI contract (`api-schema.ts`), so a DTO change that breaks the stub fails `typecheck`.
// Runs directly on Node (type stripping): keep to erasable TypeScript syntax.
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import type { ApiSchema } from '@17suit/core/api-types';

type Venue = ApiSchema<'PublicVenueResponseDto'>;
type Availability = ApiSchema<'PublicVenueAvailabilityResponseDto'>;
type ReservationDto = ApiSchema<'PublicReservationResponseDto'>;
type CreateInput = ApiSchema<'CreatePublicReservationDto'>;

interface Stored {
  token: string;
  status: ReservationDto['status'];
  startAt: string;
  customerName: string | null;
}
type FailRoute = 'reserve' | 'cancel';

export const STUB_PORT = Number(process.env.E2E_STUB_PORT ?? 4010);
export const VENUE_SLUG = 'complejo-e2e';

const TIME_ZONE = 'America/Bogota';
const UTC_OFFSET_HOURS = 5; // Bogota has no DST.
const PITCH = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Cancha Uno',
  sportType: 'football',
  capacity: 14,
  slotDurationMinutes: 60,
  basePriceMinor: 12000000,
};
const SLOT_HOURS = [16, 17, 18, 19, 20, 21];

const reservations = new Map<string, Stored>();
const taken = new Set<string>();
/** Forced error statuses, consumed one per request: `POST /__e2e/fail-next`. */
const failNext: { [route in FailRoute]: number[] } = { reserve: [], cancel: [] };

function venueToday() {
  const local = new Date(Date.now() - UTC_OFFSET_HOURS * 3_600_000);
  return local.toISOString().slice(0, 10);
}

function slotStart(date: string, hour: number) {
  return new Date(Date.parse(`${date}T00:00:00.000Z`) + (hour + UTC_OFFSET_HOURS) * 3_600_000);
}

function venueDto(): Venue {
  return {
    id: '22222222-2222-4222-8222-222222222222',
    slug: VENUE_SLUG,
    name: 'Complejo E2E',
    address: 'Calle 1 # 2-3, Bogotá',
    timezone: TIME_ZONE,
    countryCode: 'CO',
    currency: 'COP',
    contactPhone: '+573001234567',
    depositPercent: 30,
    holdMinutes: 60,
    cancellationWindowHours: 24,
    policyVersion: 1,
    bookingHorizonDays: 14,
    today: venueToday(),
    pitches: [PITCH],
  };
}

function availabilityDto(date: string): Availability {
  return {
    venueId: '22222222-2222-4222-8222-222222222222',
    date,
    timezone: TIME_ZONE,
    currency: 'COP',
    pitches: [
      {
        pitchId: PITCH.id,
        date,
        timezone: TIME_ZONE,
        currency: 'COP',
        slotDurationMinutes: PITCH.slotDurationMinutes,
        pitchName: PITCH.name,
        sportType: PITCH.sportType,
        slots: SLOT_HOURS.map((hour) => {
          const start = slotStart(date, hour);
          const startAt = start.toISOString();
          return {
            startAt,
            endAt: new Date(start.getTime() + 3_600_000).toISOString(),
            localStartTime: `${String(hour).padStart(2, '0')}:00`,
            priceMinor: PITCH.basePriceMinor,
            status: taken.has(startAt) ? 'RESERVED' : 'AVAILABLE',
          };
        }),
      },
    ],
  };
}

function reservationDto(record: Stored): ReservationDto {
  return {
    token: record.token,
    status: record.status,
    startAt: record.startAt,
    endAt: new Date(Date.parse(record.startAt) + 3_600_000).toISOString(),
    customerName: record.customerName,
    priceMinor: PITCH.basePriceMinor,
    depositMinor: Math.ceil(PITCH.basePriceMinor * 0.3),
    paidMinor: 0,
    currency: 'COP',
    paymentStatus: 'unpaid',
    holdExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    cancellableUntil: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    venue: {
      name: 'Complejo E2E',
      slug: VENUE_SLUG,
      address: 'Calle 1 # 2-3, Bogotá',
      timezone: TIME_ZONE,
      contactPhone: '+573001234567',
      paymentInstructions: 'Transfiere el anticipo a la cuenta del complejo.',
    },
    pitch: { name: PITCH.name, sportType: PITCH.sportType },
  };
}

function send(res: ServerResponse, status: number, body?: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<Partial<CreateInput> | null> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk);
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

const PREFIX = '/api/7rc/public/';

export const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://stub');
  const method = req.method ?? 'GET';

  if (url.pathname === '/health') return send(res, 200, { ok: true });
  if (url.pathname === '/__e2e/reset' && method === 'POST') {
    reservations.clear();
    taken.clear();
    failNext.reserve = [];
    failNext.cancel = [];
    return send(res, 204);
  }
  if (url.pathname === '/__e2e/fail-next' && method === 'POST') {
    const body = (await readJson(req)) as { route?: FailRoute; status?: number } | null;
    if (!body?.route || !(body.route in failNext) || typeof body.status !== 'number') {
      return send(res, 400, { message: 'Expected { route: "reserve" | "cancel", status }' });
    }
    failNext[body.route].push(body.status);
    return send(res, 204);
  }
  if (!url.pathname.startsWith(PREFIX)) return send(res, 404, { message: 'Not found' });

  const parts = url.pathname.slice(PREFIX.length).split('/').map(decodeURIComponent);

  if (parts[0] === 'venues' && parts[1] === VENUE_SLUG) {
    if (method === 'GET' && parts.length === 2) return send(res, 200, venueDto());
    if (method === 'GET' && parts[2] === 'availability') {
      const date = url.searchParams.get('date') ?? venueToday();
      return send(res, 200, availabilityDto(date));
    }
    if (method === 'POST' && parts[2] === 'reservations') {
      const forced = failNext.reserve.shift();
      if (forced) return send(res, forced, { message: `Forced ${forced}` });
      const body = await readJson(req);
      if (!body || typeof body.startAt !== 'string' || body.pitchId !== PITCH.id) {
        return send(res, 400, { message: 'Invalid reservation' });
      }
      const startAt = new Date(body.startAt).toISOString();
      if (taken.has(startAt)) return send(res, 409, { message: 'Slot taken' });
      taken.add(startAt);
      const created: Stored = {
        token: randomUUID(),
        status: 'pending_confirmation',
        startAt,
        customerName: body.customerName ?? null,
      };
      reservations.set(created.token, created);
      return send(res, 201, reservationDto(created));
    }
  }

  if (parts[0] === 'reservations') {
    const record = reservations.get(parts[1] ?? '');
    if (!record) return send(res, 404, { message: 'Not found' });
    if (method === 'GET' && parts.length === 2) return send(res, 200, reservationDto(record));
    if (method === 'POST' && parts[2] === 'cancel') {
      const forced = failNext.cancel.shift();
      if (forced) return send(res, forced, { message: `Forced ${forced}` });
      record.status = 'cancelled';
      taken.delete(record.startAt);
      return send(res, 200, reservationDto(record));
    }
  }

  return send(res, 404, { message: 'Not found' });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(STUB_PORT, '127.0.0.1', () => {
    console.log(`e2e stub api listening on http://127.0.0.1:${STUB_PORT}`);
  });
}
