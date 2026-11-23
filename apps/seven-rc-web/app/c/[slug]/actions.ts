'use server';

import { redirect } from 'next/navigation';
import { createPublicReservation, fetchPublicVenue } from '@/lib/public-venue-api';
import { E164_PATTERN, normalizePhone } from '@/lib/phone';

export interface BookingFormState {
  fieldErrors: { name?: string; phone?: string };
  formError: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
}

function failure(
  fieldErrors: BookingFormState['fieldErrors'],
  formError: string | null,
): BookingFormState {
  return { fieldErrors, formError };
}

export async function reserveAction(
  slug: string,
  _previous: BookingFormState,
  data: FormData,
): Promise<BookingFormState> {
  const values = {
    name: text(data, 'customerName').trim(),
    phone: text(data, 'customerPhone').trim(),
    notes: text(data, 'notes').trim(),
  };
  const pitchId = text(data, 'pitchId');
  const startAt = text(data, 'startAt');
  const date = text(data, 'fecha');
  const back = `/c/${encodeURIComponent(slug)}${DATE_KEY.test(date) ? `?fecha=${date}` : ''}`;

  const venue = await fetchPublicVenue(slug);
  if (!venue) redirect(`/c/${encodeURIComponent(slug)}`);

  const fieldErrors: BookingFormState['fieldErrors'] = {};
  if (values.name.length < 2) fieldErrors.name = 'Escribe tu nombre.';
  const phone = normalizePhone(values.phone, venue.countryCode);
  if (!phone || !E164_PATTERN.test(phone)) {
    fieldErrors.phone = 'Escribe el número con indicativo, p. ej. +57 300 123 4567.';
  }
  if (!UUID.test(pitchId) || Number.isNaN(Date.parse(startAt))) {
    return failure(fieldErrors, 'Ese horario no es válido. Elige uno de la lista.');
  }
  if (fieldErrors.name || fieldErrors.phone || !phone) {
    return failure(fieldErrors, 'Revisa los campos marcados.');
  }

  let result;
  try {
    result = await createPublicReservation(slug, {
      pitchId,
      startAt,
      customerName: values.name,
      customerPhone: phone,
      ...(values.notes ? { notes: values.notes } : {}),
    });
  } catch {
    return failure(
      {},
      'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
    );
  }

  if (result.ok) {
    redirect(`/c/${encodeURIComponent(slug)}/reserva/${result.reservation.token}`);
  }
  if (result.status === 409) {
    // Availability is re-fetched by the redirect, so the taken slot disappears from the list.
    redirect(`${back}${back.includes('?') ? '&' : '?'}conflicto=1`);
  }
  if (result.status === 429) {
    return failure({}, 'Demasiados intentos seguidos. Espera un minuto e intenta de nuevo.');
  }
  if (result.status === 404) redirect(`/c/${encodeURIComponent(slug)}`);
  if (result.status === 400) {
    return failure({}, 'Revisa los datos e intenta de nuevo. Si el horario ya pasó, elige otro.');
  }
  return failure({}, 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.');
}
