// Console sections. Only `overview` is built; the rest are honest placeholders
// until 17s-server exposes the admin endpoints they need. Visible copy talks
// about "la plataforma" instead of internal repo or service names.

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
  /** Nav group label. Pending sections sit under "Próximamente". */
  group?: string;
}

const PENDING_GROUP = 'Próximamente';

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
    dependency: 'Falta el servicio de la plataforma que da de alta, suspende y lista los tenants.',
    group: PENDING_GROUP,
  },
  {
    key: 'feature-flags',
    href: '/feature-flags',
    label: 'Feature flags',
    title: 'Feature flags',
    purpose: 'Activar o desactivar funciones por tenant para lanzamientos graduales y reversibles.',
    dependency: 'Falta un servicio de feature flags conectado a la plataforma.',
    group: PENDING_GROUP,
  },
  {
    key: 'billing',
    href: '/billing',
    label: 'Facturación',
    title: 'Facturación',
    purpose: 'Consultar suscripciones, planes y facturas de cada tenant.',
    dependency:
      'Los pagos ya se procesan en la plataforma, pero todavía no se pueden consultar desde esta consola.',
    group: PENDING_GROUP,
  },
  {
    key: 'analytics',
    href: '/analytics',
    label: 'Analítica',
    title: 'Analítica de producto',
    purpose: 'Ver uso y actividad agregados de todos los productos de la suite.',
    dependency: 'Todavía no hay una fuente de eventos agregados conectada a esta consola.',
    group: PENDING_GROUP,
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
  // Exact route or a nested one (`/billing/x`); a bare prefix would match `/billingx`.
  return consoleSections.find(
    (item) => item.href !== '/' && (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
}
