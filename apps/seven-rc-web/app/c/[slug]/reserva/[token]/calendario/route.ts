import { fetchPublicReservation } from '@/lib/public-venue-api';
import { buildIcs } from '@/lib/reservation-ics';
import { getServerT } from '@/lib/i18n-server';
import { sportLabel } from '@/lib/seven-rc-format';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * `.ics` of a guest reservation. The token is a bearer secret, so an unknown or
 * malformed one is a bare 404 and the response is never cached or indexed.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; token: string }> },
) {
  const { token } = await params;
  if (!UUID.test(token)) return new Response('Not found', { status: 404 });
  const reservation = await fetchPublicReservation(token);
  if (!reservation) return new Response('Not found', { status: 404 });

  const { t } = await getServerT('play');
  const body = buildIcs({
    uid: token,
    startAt: reservation.startAt,
    endAt: reservation.endAt,
    summary: `${reservation.pitch.name} (${sportLabel(reservation.pitch.sportType, t)}) · ${reservation.venue.name}`,
    location: [reservation.venue.name, reservation.venue.address].filter(Boolean).join(', '),
  });
  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="reserva.ics"',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
