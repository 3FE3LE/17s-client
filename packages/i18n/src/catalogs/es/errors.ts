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
};
