/**
 * Maps server/SDK errors to Spanish copy a player or owner can act on.
 * Known server messages win; otherwise the HTTP status (SevenRcApiError) picks a
 * generic message; otherwise the action-specific fallback. Raw server text is
 * never shown to users (it is English and often internal).
 */
import { describeApiError, resolveErrorKey, type Locale } from '@17suit/i18n';
import { SevenRcApiError } from '@17suit/module-seven-reservations-club';

const KNOWN_ERRORS: ReadonlyArray<{ match: RegExp; message: (found: RegExpMatchArray) => string }> =
  [
    {
      match: /^Timeslot is unavailable$/i,
      message: () => 'Otra persona acaba de reservar ese horario. Elige otro de la lista.',
    },
    {
      match: /^Timeslot is blocked$/i,
      message: () => 'El complejo bloqueó ese horario. Elige otro de la lista.',
    },
    {
      match: /^Block overlaps active reservations$/i,
      message: () =>
        'Ese bloqueo se cruza con reservas activas. Cancélalas primero o cambia el horario.',
    },
    {
      match: /^Slot has already started$/i,
      message: () => 'Ese horario ya empezó. Elige uno más tarde.',
    },
    {
      match: /^Date is outside the booking window$/i,
      message: () => 'Esa fecha está fuera del periodo en que el complejo recibe reservas.',
    },
    {
      match: /^Reservation must align with configured opening slots$/i,
      message: () =>
        'Ese horario ya no coincide con los turnos de la cancha. Vuelve a elegir un horario.',
    },
    {
      match: /^Reservations can only be cancelled up to (\d+)h before start$/i,
      message: (found) =>
        `Solo se puede cancelar hasta ${found[1]} h antes del inicio. Escribe al complejo si no puedes asistir.`,
    },
    {
      match: /^Only pending or confirmed reservations can be cancelled$/i,
      message: () => 'Esta reserva ya no se puede cancelar.',
    },
    {
      match: /^Only pending reservations can be (confirmed|rejected)$/i,
      message: () => 'Esta solicitud ya fue atendida. La lista se actualizó.',
    },
    {
      match: /^Only confirmed reservations can be (completed|marked as no-show)$/i,
      message: () => 'Solo una reserva confirmada se puede cerrar así. La lista se actualizó.',
    },
    {
      match: /^The reservation has not started yet$/i,
      message: () => 'El turno aún no empieza. Podrás marcarlo cuando haya pasado la hora.',
    },
    {
      match: /^Cannot record a payment on a \w+ reservation$/i,
      message: () =>
        'Esta reserva ya no admite pagos. Si devolviste dinero, regístralo como devolución.',
    },
    {
      match: /^Refund exceeds the amount paid$/i,
      message: () => 'La devolución supera lo que el jugador ha pagado.',
    },
    {
      match: /^endTime must be greater than startTime/i,
      message: () => 'Cada tarifa por horario debe terminar después de empezar.',
    },
    {
      match: /^closeTime must be greater than openTime/i,
      message: () => 'La hora de cierre debe ser posterior a la de apertura.',
    },
    {
      match: /^Invalid date range$/i,
      message: () => 'La fecha final debe ser igual o posterior a la inicial.',
    },
    {
      match: /^(Pitch|Venue|Reservation) not found$/i,
      message: (found) =>
        `${found[1] === 'Pitch' ? 'La cancha' : found[1] === 'Venue' ? 'El complejo' : 'La reserva'} ya no existe. Actualiza la página.`,
    },
    {
      match: /^Only venue owner/i,
      message: () => 'Esta acción solo la puede hacer el dueño del complejo.',
    },
    {
      match: /^No active session$/i,
      message: () =>
        'No hay una sesión activa en este navegador. Cierra sesión, vuelve a entrar e intenta de nuevo.',
    },
    {
      match: /^Unauthorized$|\(401\)$/i,
      message: () => 'Tu sesión expiró. Vuelve a iniciar sesión.',
    },
    {
      match: /\(403\)$/i,
      message: () => 'Tu cuenta no tiene permiso para esta acción.',
    },
    {
      match: /\(400\)$/i,
      message: () => 'Revisa los datos del formulario e intenta de nuevo.',
    },
    {
      match: /\(429\)$/i,
      message: () => 'Demasiados intentos seguidos. Espera un momento e intenta de nuevo.',
    },
    {
      match: /^Unable to reach API$|aborted|Failed to fetch|NetworkError|\(5\d\d\)$/i,
      message: () => 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
    },
  ];

export function describeError(error: unknown, fallback: string, locale: Locale = 'es'): string {
  // The server `errorKey` is the contract; the regexes below only cover older servers.
  if (error instanceof SevenRcApiError && error.errorKey) {
    const apiError = {
      errorKey: error.errorKey,
      ...(error.params ? { params: error.params } : {}),
    };
    if (resolveErrorKey(apiError) !== 'unknown') return describeApiError(apiError, locale);
  }

  const raw = error instanceof Error ? error.message.trim() : '';

  for (const entry of KNOWN_ERRORS) {
    const found = raw.match(entry.match);
    if (found) return entry.message(found);
  }

  if (error instanceof SevenRcApiError) {
    const byStatus = describeStatus(error.status);
    if (byStatus) return byStatus;
  }

  return fallback;
}

function describeStatus(status: number): string | null {
  if (status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
  if (status === 403) return 'Tu cuenta no tiene permiso para esta acción.';
  if (status === 404) return 'Lo que buscas ya no existe. Actualiza la página.';
  if (status === 409)
    return 'Alguien hizo un cambio al mismo tiempo. Actualiza y vuelve a intentar.';
  if (status === 400 || status === 422)
    return 'Revisa los datos del formulario e intenta de nuevo.';
  if (status === 429) return 'Demasiados intentos seguidos. Espera un momento e intenta de nuevo.';
  if (status >= 500) return 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.';
  return null;
}

const SLOT_CONFLICT_KEYS = new Set([
  'slotUnavailable',
  'slotBlocked',
  'slotAlreadyStarted',
  'slotNotAligned',
]);

/** True when the failure means the slot list on screen is stale. */
export function isSlotConflict(error: unknown): boolean {
  if (error instanceof SevenRcApiError && error.errorKey) {
    return SLOT_CONFLICT_KEYS.has(error.errorKey);
  }
  const raw = error instanceof Error ? error.message : '';
  return /Timeslot is (unavailable|blocked)|Slot has already started|align with configured/i.test(
    raw,
  );
}
