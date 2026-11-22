/**
 * Map raw SDK / network errors to human Spanish copy.
 *
 * HTTP failures arrive as `SevenRcApiError`, which carries `.status`; that is
 * mapped first. Everything else is a non-HTTP failure: a plain `Error` /
 * `TypeError` from fetch (offline, DNS), an `AbortError` from the timeout, or
 * the SDK's own `Error('Unauthorized')` when no token is available. Those fall
 * back to message heuristics.
 */

import { SevenRcApiError } from '@17suit/module-seven-reservations-club/client';

type Context = 'load' | 'create' | 'cancel' | 'confirm' | 'reject' | 'save';

const NETWORK = 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
const SESSION = 'Tu sesión expiró. Vuelve a iniciar sesión.';
const FORBIDDEN = 'No tienes permiso para hacer esto con tu cuenta.';
const NOT_FOUND = 'No encontramos lo que buscabas. Puede que ya no exista.';
const RATE = 'Demasiados intentos seguidos. Espera un momento e inténtalo de nuevo.';
const SERVER = 'El servidor tuvo un problema. Inténtalo de nuevo en unos minutos.';

const CONFLICT: Record<Context, string> = {
  load: 'Los datos cambiaron mientras cargaban. Desliza para actualizar.',
  create: 'Ese horario ya no está disponible. Elige otra hora.',
  cancel: 'Esta reserva ya no se puede cancelar.',
  confirm: 'Esta reserva ya cambió de estado. Actualiza la lista.',
  reject: 'Esta reserva ya cambió de estado. Actualiza la lista.',
  save: 'Los datos chocan con otra configuración. Revisa e inténtalo de nuevo.',
};

const BAD_REQUEST: Record<Context, string> = {
  load: 'La consulta no es válida. Desliza para actualizar.',
  create: 'Revisa la cancha, la fecha y la hora e inténtalo de nuevo.',
  cancel: 'No se pudo cancelar esta reserva.',
  confirm: 'No se pudo confirmar esta reserva.',
  reject: 'No se pudo rechazar esta reserva.',
  save: 'Revisa los datos del formulario e inténtalo de nuevo.',
};

const FALLBACK: Record<Context, string> = {
  load: 'No pudimos cargar la información.',
  create: 'No pudimos crear la reserva.',
  cancel: 'No pudimos cancelar la reserva.',
  confirm: 'No pudimos confirmar la reserva.',
  reject: 'No pudimos rechazar la reserva.',
  save: 'No pudimos guardar los cambios.',
};

function statusFromMessage(message: string): number | null {
  const match = /\((\d{3})\)/.exec(message);
  return match ? Number(match[1]) : null;
}

function fromStatus(status: number, context: Context): string | null {
  if (status === 401) return SESSION;
  if (status === 403) return FORBIDDEN;
  if (status === 404) return NOT_FOUND;
  if (status === 409) return CONFLICT[context];
  if (status === 400 || status === 422) return BAD_REQUEST[context];
  if (status === 429) return RATE;
  if (status >= 500) return SERVER;
  return null;
}

export function humanizeError(error: unknown, context: Context = 'load'): string {
  if (error instanceof SevenRcApiError) {
    return fromStatus(error.status, context) ?? FALLBACK[context];
  }

  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : null;
  if (raw === null) return FALLBACK[context];
  const message = raw.trim();
  const lower = message.toLowerCase();
  const status = statusFromMessage(message);

  if (
    (error instanceof Error && error.name === 'AbortError') ||
    lower.includes('abort') ||
    lower.includes('network') ||
    lower.includes('failed to fetch') ||
    lower.includes('unable to reach') ||
    lower.includes('timeout')
  ) {
    return NETWORK;
  }
  if (lower === 'unauthorized' || status === 401) return SESSION;
  if (lower === 'forbidden' || status === 403) return FORBIDDEN;
  if (lower === 'not found' || status === 404) return NOT_FOUND;
  if (lower === 'conflict' || status === 409) return CONFLICT[context];
  if (
    lower === 'bad request' ||
    lower === 'unprocessable entity' ||
    status === 400 ||
    status === 422
  ) {
    return BAD_REQUEST[context];
  }
  if (lower === 'too many requests' || status === 429) return RATE;
  if (lower === 'internal server error' || (status !== null && status >= 500)) return SERVER;

  return FALLBACK[context];
}

/** Clerk errors carry `errors[].code`; map the common ones to Spanish. */
const CLERK_CODES: Record<string, string> = {
  form_identifier_not_found: 'No encontramos una cuenta con ese correo.',
  form_password_incorrect: 'La contraseña no es correcta.',
  form_password_pwned: 'Esa contraseña apareció en una filtración conocida. Elige una diferente.',
  form_password_length_too_short: 'La contraseña es muy corta. Usa al menos 8 caracteres.',
  form_password_validation_failed: 'La contraseña no cumple los requisitos.',
  form_identifier_exists: 'Ya existe una cuenta con ese correo. Inicia sesión.',
  form_param_format_invalid: 'Revisa el formato del correo.',
  form_code_incorrect: 'El código no es correcto.',
  verification_expired: 'El código expiró. Pide uno nuevo.',
  verification_failed: 'No pudimos verificar el código. Inténtalo de nuevo.',
  session_exists: 'Ya tienes una sesión activa.',
  too_many_requests: RATE,
};

export function humanizeClerkError(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const errors = (error as { errors?: Array<{ code?: string }> }).errors;
    const code = errors?.[0]?.code;
    if (code && CLERK_CODES[code]) return CLERK_CODES[code];
  }
  if (error instanceof Error && error.message.toLowerCase().includes('network')) return NETWORK;
  return fallback;
}
