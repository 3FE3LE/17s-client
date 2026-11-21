/**
 * Single source of truth for the landing product catalog.
 *
 * Consumed by the home page, the per-product page (`app/[slug]/page.tsx`) and
 * the root layout footer. The official portfolio (owner decision, 2026-11-21)
 * is Fifteen Account Check, Seven Reservations Club, One Plan Trip,
 * For Your Closet and Five Barber Go. Copy here must describe only what each
 * product does; do not add stats, prices, customer counts or testimonials.
 *
 * Accent colors live in `app/globals.css` under `[data-product]` so light and
 * dark mode each get a value that clears 4.5:1 on every landing surface.
 */

export type ProductStatus = 'live' | 'beta' | 'soon';

export interface ProductStep {
  title: string;
  body: string;
}

export interface Product {
  slug: string;
  /** Key used by `[data-product]` in globals.css for the accent color. */
  accentKey: 'fifteen' | 'seven' | 'one' | 'closet' | 'five';
  numeral: string;
  name: string;
  /** Short name for CTAs ("Probar Fifteen"). */
  shortName: string;
  status: ProductStatus;
  /** One line for cards and the footer. */
  tagline: string;
  /** Outcome-first headline for the product page. */
  headline: string;
  summary: string;
  highlights: readonly string[];
  steps: readonly [ProductStep, ProductStep, ProductStep];
  /** Shows the "Tus datos" block under the steps, linking to this /privacidad anchor. */
  privacyAnchor?: string;
  /** Env var holding the product web origin (only for products with an app). */
  appUrlEnv?: string;
  /** Production subdomain from apps-registry.json, used when the env var is missing. */
  registrySubdomain?: string;
  /** Local dev port, used only outside production. */
  devPort?: number;
}

export const products: readonly Product[] = [
  {
    slug: 'fifteen-account-check',
    accentKey: 'fifteen',
    numeral: '15',
    name: 'Fifteen Account Check',
    shortName: 'Fifteen',
    status: 'live',
    privacyAnchor: 'acceso-a-gmail',
    tagline: 'Tus gastos, tarjetas y pagos fijos, ordenados desde los correos de tu banco.',
    headline: 'Sabe en qué se fue tu dinero este mes sin pasar movimientos a mano.',
    summary:
      'Conecta tu Gmail y Fifteen lee las notificaciones de tus bancos y pasarelas de pago. Cada movimiento queda en revisión hasta que tú lo confirmas, así tus cuentas solo muestran lo que ya validaste.',
    highlights: [
      'Movimientos detectados en una cola de revisión, separados de lo que ya confirmaste',
      'Tarjetas con sus días de corte y de pago',
      'Ingresos, suscripciones y pagos fijos del mes en un solo panel',
    ],
    steps: [
      {
        title: 'Conecta tu correo',
        body: 'Vinculas tu Gmail y eliges qué remitentes de bancos y pagos se leen.',
      },
      {
        title: 'Revisa cada movimiento',
        body: 'Confirmas, descartas o pospones lo que Fifteen detectó en tus correos.',
      },
      {
        title: 'Mira tu mes completo',
        body: 'Ingresos, gastos, tarjetas y pagos fijos quedan en un panel mensual.',
      },
    ],
    appUrlEnv: 'NEXT_PUBLIC_FIFTEEN_AC_WEB_URL',
    registrySubdomain: 'fifteen-ac.17suit.com',
    devPort: 3015,
  },
  {
    slug: 'seven-reservations-club',
    accentKey: 'seven',
    numeral: '7',
    name: 'Seven Reservations Club',
    shortName: 'Seven',
    status: 'beta',
    tagline: 'Reserva cancha en tu complejo deportivo o administra las de tu negocio.',
    headline: 'Reserva cancha sin llamadas, y llena tu agenda si administras el complejo.',
    summary:
      'Los complejos deportivos publican sus canchas y horarios; los jugadores eligen un horario libre y envían su reserva. El complejo la confirma o la rechaza desde su panel.',
    highlights: [
      'Canchas con horarios y duración de turno propios',
      'Una vista para quien administra y otra para quien juega',
      'Reservas pendientes, de hoy y próximas en un mismo lugar',
    ],
    steps: [
      {
        title: 'Elige cómo vas a usarlo',
        body: 'Al crear tu cuenta indicas si administras un complejo o vienes a jugar.',
      },
      {
        title: 'El complejo abre sus horarios',
        body: 'Quien administra registra sus canchas y los horarios de cada día.',
      },
      {
        title: 'Reservas y recibes respuesta',
        body: 'Eliges cancha y hora; el complejo confirma o rechaza tu reserva.',
      },
    ],
    appUrlEnv: 'NEXT_PUBLIC_SEVEN_RC_WEB_URL',
    registrySubdomain: 'seven-rc.17suit.com',
    devPort: 3007,
  },
  {
    slug: 'one-plan-trip',
    accentKey: 'one',
    numeral: '1',
    name: 'One Plan Trip',
    shortName: 'One',
    status: 'soon',
    tagline: 'Pasa de la idea de viaje a un itinerario que todos pueden seguir.',
    headline: 'Un solo plan de viaje, claro para todos los que van.',
    summary:
      'One Plan Trip reunirá las ideas, reservas y notas del viaje en un itinerario compartido con quienes viajan contigo.',
    highlights: [
      'Itinerario día por día',
      'Reservas y notas clave en el mismo plan',
      'Plan compartido con tus compañeros de viaje',
    ],
    steps: [
      {
        title: 'Reúne las ideas',
        body: 'Guardas destinos, reservas y notas del viaje en un solo lugar.',
      },
      {
        title: 'Arma el itinerario',
        body: 'Ordenas todo en un plan día por día.',
      },
      {
        title: 'Compártelo',
        body: 'Quienes viajan contigo ven el mismo plan.',
      },
    ],
  },
  {
    slug: 'for-your-closet',
    accentKey: 'closet',
    numeral: '4',
    name: 'For Your Closet',
    shortName: 'For Your Closet',
    status: 'soon',
    tagline: 'Tu ropa en un catálogo visual para armar looks por ocasión.',
    headline: 'Decide qué ponerte mirando tu clóset, no tu pila de ropa.',
    summary:
      'For Your Closet convertirá tu guardarropa en un catálogo visual para combinar prendas según la ocasión y ver qué usas de verdad.',
    highlights: [
      'Catálogo visual de tus prendas',
      'Combinaciones guardadas por ocasión',
      'Registro de qué prendas usas y cuáles no',
    ],
    steps: [
      {
        title: 'Sube tus prendas',
        body: 'Armas un catálogo visual con lo que hay en tu clóset.',
      },
      {
        title: 'Combina por ocasión',
        body: 'Creas y guardas looks para trabajo, salidas o viajes.',
      },
      {
        title: 'Mira qué usas',
        body: 'Ves qué prendas repites y cuáles llevan tiempo sin salir.',
      },
    ],
  },
  {
    slug: 'five-barber-go',
    accentKey: 'five',
    numeral: '5',
    name: 'Five Barber Go',
    shortName: 'Five Barber Go',
    status: 'soon',
    tagline: 'Agenda de citas por barbero y clientes que vuelven.',
    headline: 'Una agenda por barbero y clientes que regresan a tiempo.',
    summary:
      'Five Barber Go ordenará las citas de cada profesional, el historial de tus clientes frecuentes y los recordatorios de asistencia.',
    highlights: [
      'Agenda de servicios por profesional',
      'Historial de clientes recurrentes',
      'Recordatorios de asistencia',
    ],
    steps: [
      {
        title: 'Publica tu agenda',
        body: 'La barbería registra sus servicios y los horarios de cada barbero.',
      },
      {
        title: 'El cliente aparta su cita',
        body: 'Elige servicio, barbero y hora disponible.',
      },
      {
        title: 'Recordatorio y regreso',
        body: 'El cliente recibe un recordatorio y su historial queda para la próxima visita.',
      },
    ],
  },
];

export const productCount = products.length;

export const statusLabel: Record<ProductStatus, string> = {
  live: 'Disponible',
  beta: 'Beta',
  soon: 'Próximamente',
};

/** Old landing slugs that map to a current product slug. */
export const legacySlugRedirects: Record<string, string> = {
  'fifteen-all-check': 'fifteen-account-check',
  'four-you-closet': 'for-your-closet',
};

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function hasApp(product: Product): boolean {
  return product.status !== 'soon';
}

/**
 * Resolves the product web app URL. Order: configured env var, then the
 * production subdomain from apps-registry.json. A localhost URL is returned
 * only outside production, so a missing env var never ships a localhost link.
 */
export function getProductAppUrl(product: Product): string | null {
  if (!hasApp(product)) return null;

  const fromEnv = product.appUrlEnv ? readPublicEnv(product.appUrlEnv) : undefined;
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV !== 'production' && product.devPort) {
    return `http://localhost:${product.devPort}/`;
  }

  return product.registrySubdomain ? `https://${product.registrySubdomain}/` : null;
}

// NEXT_PUBLIC_* values must be referenced literally to be inlined at build time.
function readPublicEnv(name: string): string | undefined {
  const values: Record<string, string | undefined> = {
    NEXT_PUBLIC_FIFTEEN_AC_WEB_URL: process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL,
    NEXT_PUBLIC_SEVEN_RC_WEB_URL: process.env.NEXT_PUBLIC_SEVEN_RC_WEB_URL,
  };
  const value = values[name]?.trim();
  return value ? value : undefined;
}
