// Console sections. Only `overview` is built; the rest are honest placeholders
// until 17s-server exposes the admin endpoints they need.

export type SectionKey = 'overview' | 'tenants' | 'feature-flags' | 'billing' | 'analytics';

export interface ConsoleSection {
  key: SectionKey;
  href: string;
  label: string;
  title: string;
  /** What the section will do once it exists. */
  purpose: string;
  /** What is missing today. Empty for built sections. */
  dependency?: string;
}

export const consoleSections: ConsoleSection[] = [
  {
    key: 'overview',
    href: '/',
    label: 'Resumen',
    title: 'Resumen de la suite',
    purpose: 'Productos registrados, su estado y accesos directos.',
  },
  {
    key: 'tenants',
    href: '/tenants',
    label: 'Tenants',
    title: 'Tenants',
    purpose:
      'Listar y gestionar los espacios de trabajo de cada cliente: alta, suspensión y productos contratados.',
    dependency:
      'Requiere un endpoint de administración de tenants en 17s-server que todavía no existe.',
  },
  {
    key: 'feature-flags',
    href: '/feature-flags',
    label: 'Feature flags',
    title: 'Feature flags',
    purpose: 'Activar o desactivar funciones por tenant para lanzamientos graduales y reversibles.',
    dependency:
      'Requiere un servicio de feature flags conectado a 17s-server que todavía no existe.',
  },
  {
    key: 'billing',
    href: '/billing',
    label: 'Facturación',
    title: 'Facturación',
    purpose: 'Consultar suscripciones, planes y facturas de cada tenant.',
    dependency:
      'La integración con Stripe vive en 17s-server y aún no expone endpoints para esta consola.',
  },
  {
    key: 'analytics',
    href: '/analytics',
    label: 'Analítica',
    title: 'Analítica de producto',
    purpose: 'Ver uso y actividad agregados de todos los productos de la suite.',
    dependency: 'Todavía no hay una fuente de eventos agregados conectada a esta consola.',
  },
];

export function getSection(key: SectionKey): ConsoleSection {
  const section = consoleSections.find((item) => item.key === key);
  if (!section) {
    throw new Error(`Unknown console section: ${key}`);
  }
  return section;
}

export function getSectionByPath(pathname: string): ConsoleSection | undefined {
  if (pathname === '/') {
    return getSection('overview');
  }
  return consoleSections.find((item) => item.href !== '/' && pathname.startsWith(item.href));
}
