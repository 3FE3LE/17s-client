/**
 * Maps server/SDK error messages to Spanish copy a player or owner can act on.
 * Unknown messages keep the raw text after the action-specific fallback, so
 * nothing is hidden when the server adds a new error.
 */
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

export function describeError(error: unknown, fallback: string): string {
  const raw = error instanceof Error ? error.message.trim() : '';
  if (!raw) return fallback;

  for (const entry of KNOWN_ERRORS) {
    const found = raw.match(entry.match);
    if (found) return entry.message(found);
  }

  return `${fallback} (${raw})`;
}

/** True when the failure means the slot list on screen is stale. */
export function isSlotConflict(error: unknown): boolean {
  const raw = error instanceof Error ? error.message : '';
  return /Timeslot is (unavailable|blocked)|Slot has already started|align with configured/i.test(
    raw,
  );
}
