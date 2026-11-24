import type { CatalogShape } from '../../types';
import type { common as en } from '../en/common';

export const common: CatalogShape<typeof en> = {
  language: {
    label: 'Idioma',
  },
  theme: {
    label: 'Tema',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
  },
  footer: {
    home: 'Ir al inicio',
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    rights: 'Todos los derechos reservados.',
    tagline: 'Un producto de {{suite}}',
  },
  actions: {
    save: 'Guardar',
    cancel: 'Cancelar',
    retry: 'Reintentar',
  },
};
