import type { CatalogShape } from '../../types';
import type { errors as en } from '../en/errors';

export const errors: CatalogShape<typeof en> = {
  unknown: 'Algo salió mal. Inténtalo de nuevo.',
  network: 'No se pudo contactar al servidor. Revisa tu conexión.',
  unauthorized: 'Tu sesión expiró. Inicia sesión de nuevo.',
  badRequest: 'La solicitud no es válida.',
  validation: 'Algunos campos no son válidos. Revísalos e inténtalo de nuevo.',
  forbidden: 'No tienes permiso para hacer eso.',
  notFound: 'No encontramos lo que pediste.',
  conflict: 'Esa acción choca con el estado actual. Actualiza e inténtalo de nuevo.',
  rateLimited: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
  slugRequired: 'Elige un enlace público antes de publicar.',
  slugTaken: 'Ese enlace ya está en uso. Prueba con otro.',
  venueNotReady: 'Completa la configuración del complejo antes de publicarlo.',
  venueNotFound: 'Ese complejo ya no existe. Actualiza la página.',
  pitchNotFound: 'Esa cancha ya no existe. Actualiza la página.',
  reservationNotFound: 'Esa reserva ya no existe. Actualiza la página.',
  seriesNotFound: 'Esa reserva recurrente ya no existe.',
  blockNotFound: 'Ese bloqueo ya no existe. Actualiza la página.',
  notVenueOwner: 'Solo el dueño del complejo puede hacer esto.',
  notReservationOwner: 'Solo quien hizo la reserva puede hacer esto.',
  reservationAccessDenied: 'No puedes ver esta reserva.',
  invalidField: 'Revisa este campo.',
  duplicateOpeningDay: 'Cada día de la semana solo puede aparecer una vez en el horario.',
  invalidTimeRange: 'La hora final debe ser posterior a la inicial.',
  outsideBookingWindow: 'Esa fecha está fuera del periodo en que el complejo recibe reservas.',
  reservationNotPending: 'Esta solicitud ya fue atendida. La lista se actualizó.',
  reservationNotConfirmed:
    'Solo una reserva confirmada se puede cerrar así. La lista se actualizó.',
  reservationNotCancellable: 'Esta reserva ya no se puede cancelar.',
  paymentNotAllowed:
    'Esta reserva ya no admite pagos. Si devolviste dinero, regístralo como devolución.',
  refundExceedsPaid: 'La devolución supera lo que se ha pagado.',
  reservationNotStarted: 'El turno aún no empieza. Podrás marcarlo cuando haya pasado la hora.',
  noOccurrenceBooked: 'No se pudo reservar ninguna de las fechas. Elige otras fechas u horarios.',
  invalidDateRange: 'La fecha final debe ser igual o posterior a la inicial.',
  dateRangeTooLong: 'El rango de fechas no puede superar {{maxDays}} días.',
  cancellationWindowPassed:
    'Solo se puede cancelar hasta {{hours}} h antes del inicio. Escribe al complejo si no puedes asistir.',
  slotNotAligned:
    'Ese horario ya no coincide con los turnos de la cancha. Vuelve a elegir un horario.',
  slotAlreadyStarted: 'Ese horario ya empezó. Elige uno más tarde.',
  slotBlocked: 'El complejo bloqueó ese horario. Elige otro de la lista.',
  slotUnavailable: 'Otra persona acaba de reservar ese horario. Elige otro de la lista.',
  occurrencesAmbiguous: 'Elige un número de semanas o una fecha final, no ambos.',
  tooManySlots: 'Una reserva puede incluir hasta {{max}} turnos seguidos.',
  tooManyOccurrences: 'Una reserva recurrente puede tener como máximo {{max}} fechas.',
  untilBeforeFirst: 'La fecha final es anterior a la primera fecha de la reserva.',
  blockOverlapsReservations:
    'Ese bloqueo se cruza con reservas activas. Cancélalas primero o cambia el horario.',
  policyChanged:
    'El complejo cambió sus condiciones mientras reservabas. Revísalas e inténtalo de nuevo.',
  depositOutcomeRequired: 'Elige qué pasa con el anticipo.',
  refundDecisionRequired: 'Elige si se devuelve el dinero ya pagado.',
};
