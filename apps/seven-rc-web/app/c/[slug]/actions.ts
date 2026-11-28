'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  cancelPublicReservation,
  createPublicReservation,
  fetchPublicVenue,
} from '@/lib/public-venue-api';
import { describeApiError, resolveErrorKey } from '@17suit/i18n';
import { getProductLocale } from '@17suit/i18n/next';
import { isSlotConflictErrorKey } from '@/lib/slot-conflict';
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
  const seenPolicy = Number.parseInt(text(data, 'policyVersion'), 10);
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
      ...(seenPolicy > 0 ? { policyVersion: seenPolicy } : {}),
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
  if (result.status === 409 && result.code === 'POLICY_CHANGED') {
    // The cached venue still holds the old terms: drop it so the redirect shows the new ones.
    revalidatePath(`/c/${encodeURIComponent(slug)}`);
    redirect(`${back}${back.includes('?') ? '&' : '?'}condiciones=1`);
  }
  if (isSlotConflictErrorKey(result.errorKey)) {
    // Availability is never cached; the redirect refetches it and shows the specific reason.
    revalidatePath(`/c/${encodeURIComponent(slug)}`);
    redirect(`${back}${back.includes('?') ? '&' : '?'}conflicto=${result.errorKey}`);
  }
  if (result.status === 409) {
    // Availability is re-fetched by the redirect, so the taken slot disappears from the list.
    redirect(`${back}${back.includes('?') ? '&' : '?'}conflicto=1`);
  }
  if (result.status === 429) {
    return failure({}, 'Demasiados intentos seguidos. Espera un minuto e intenta de nuevo.');
  }
  if (result.status === 404) redirect(`/c/${encodeURIComponent(slug)}`);
  if (result.status === 400 || result.status === 409) {
    const apiError = { errorKey: result.errorKey, params: result.params };
    if (resolveErrorKey(apiError) !== 'unknown') {
      return failure({}, describeApiError(apiError, await getProductLocale()));
    }
  }
  if (result.status === 400) {
    return failure({}, 'Revisa los datos e intenta de nuevo. Si el horario ya pasó, elige otro.');
  }
  return failure({}, 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.');
}

export interface CancelFormState {
  error: string | null;
}

export async function cancelReservationAction(
  slug: string,
  token: string,
): Promise<CancelFormState> {
  if (!UUID.test(token)) return { error: 'Este enlace no es válido.' };
  let result;
  try {
    result = await cancelPublicReservation(token);
  } catch {
    return { error: 'No pudimos conectar con el servidor. Intenta de nuevo.' };
  }
  if (result.ok) {
    revalidatePath(`/c/${encodeURIComponent(slug)}/reserva/${token}`);
    return { error: null };
  }
  if (result.status === 400) {
    return {
      error: 'Ya no se puede cancelar en línea. Comunícate con el complejo.',
    };
  }
  if (result.status === 404) return { error: 'No encontramos esta reserva.' };
  if (result.status === 429) return { error: 'Demasiados intentos. Espera un minuto.' };
  return { error: 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.' };
}
