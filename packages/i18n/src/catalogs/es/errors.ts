import type { CatalogShape } from '../../types';
import type { errors as en } from '../en/errors';

export const errors: CatalogShape<typeof en> = {
  unknown: 'Algo salió mal. Inténtalo de nuevo.',
  network: 'No se pudo contactar al servidor. Revisa tu conexión.',
  unauthorized: 'Tu sesión expiró. Inicia sesión de nuevo.',
};
