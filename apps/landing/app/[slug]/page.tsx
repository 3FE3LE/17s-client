import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const products = {
  'seven-reservations-club': {
    name: 'Seven Reservations Club',
    tagline: 'Reservas y operacion de hospitalidad para complejos deportivos.',
    summary:
      'Gestiona canchas, disponibilidad, reservas y flujo por rol en una sola experiencia conectada.',
    highlights: [
      'Agenda y reservas con reglas por cancha',
      'Vistas dedicadas para OWNER y PLAYER',
      'Operacion diaria con trazabilidad de actividad',
    ],
  },
  'six-sense-proof': {
    name: 'Six Sense Proof',
    tagline: 'Flujos de validacion con evidencia y seguimiento.',
    summary: 'Estandariza validaciones, captura evidencia y toma decisiones con contexto completo.',
    highlights: [
      'Checklist de validacion reutilizable',
      'Evidencia centralizada por flujo',
      'Seguimiento de estados y responsables',
    ],
  },
  'five-barber-go': {
    name: 'Five Barber Go',
    tagline: 'Agenda, fidelizacion y operacion para barberias.',
    summary:
      'Ordena citas, equipos y clientes frecuentes con un flujo pensado para conversion diaria.',
    highlights: [
      'Agenda de servicios por profesional',
      'Historial y relacion con clientes recurrentes',
      'Promociones y recordatorios de asistencia',
    ],
  },
  'nine-to-nine-nurse': {
    name: 'Nine To Nine Nurse',
    tagline: 'Gestion de turnos y seguimiento clinico en campo.',
    summary:
      'Coordina turnos, tareas y atencion continua con visibilidad para operaciones sensibles.',
    highlights: [
      'Turnos organizados por equipo y cobertura',
      'Seguimiento de tareas en tiempo real',
      'Panel operativo para decisiones rapidas',
    ],
  },
  'fourteen-cash-pulse': {
    name: 'Fourteen Cash Pulse',
    tagline: 'Cockpit financiero personal con evidencia, revision y fechas reales de pago.',
    summary:
      'Centraliza ingresos, gastos, tarjetas, obligaciones e ingestion inicial desde Outlook/Hotmail sin mezclar datos crudos con el ledger confirmado.',
    highlights: [
      'Transacciones candidatas separadas del ledger confirmado',
      'Evidencia multiple para pagos PSE, tarjetas y recibos',
      'Ciclos de tarjeta, FX, fees y cola de revision',
    ],
  },
  'two-split-bill': {
    name: 'Two Split Bill',
    tagline: 'Pagos compartidos claros y sin friccion.',
    summary: 'Divide cuentas, automatiza montos y mejora la experiencia de cobro en grupos.',
    highlights: [
      'Division de montos simple y transparente',
      'Flujo rapido de confirmacion de pago',
      'Historial para soporte y conciliacion',
    ],
  },
  'one-plan-trip': {
    name: 'One Plan Trip',
    tagline: 'Planeacion de viajes con itinerarios accionables.',
    summary:
      'Convierte ideas de viaje en planes claros, tareas coordinadas y seguimiento compartido.',
    highlights: [
      'Itinerarios listos para ejecutar',
      'Coordinacion colaborativa entre viajeros',
      'Centralizacion de reservas y notas clave',
    ],
  },
  'four-you-closet': {
    name: 'Four You Closet',
    tagline: 'Organiza looks y guardarropa por contexto.',
    summary: 'Construye combinaciones, optimiza piezas y manten ordenado tu flujo de vestuario.',
    highlights: [
      'Catalogo visual del guardarropa',
      'Recomendaciones por ocasion y clima',
      'Control de uso y renovacion de prendas',
    ],
  },
  'eight-dream-dishes': {
    name: 'Eight Dream Dishes',
    tagline: 'Operacion culinaria y recetas escalables.',
    summary:
      'Estandariza recetas, costos y ejecucion para equipos de cocina que necesitan consistencia.',
    highlights: [
      'Recetas versionadas por operacion',
      'Control de porciones y costos base',
      'Ejecucion replicable por estaciones',
    ],
  },
} as const;

type ProductSlug = keyof typeof products;

function getProductAppHref(slug: ProductSlug): string {
  if (slug === 'fourteen-cash-pulse') {
    return process.env.NEXT_PUBLIC_FOURTEEN_CP_WEB_URL ?? 'http://localhost:3003/';
  }

  return `/${slug}`;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: ProductSlug }>> {
  const slugs = await Promise.resolve(Object.keys(products) as ProductSlug[]);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products[slug as ProductSlug];

  if (!product) {
    return { title: 'Product not found | 17Suit' };
  }

  return {
    title: `${product.name} | 17Suit`,
    description: product.summary,
  };
}

export default async function ProductLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products[slug as ProductSlug];

  if (!product) {
    notFound();
  }

  const redirectTarget = getProductAppHref(slug as ProductSlug);

  return (
    <main className="relative min-h-screen overflow-clip bg-[radial-gradient(circle_at_10%_0%,rgba(53,167,255,0.22),transparent_36%),radial-gradient(circle_at_96%_8%,rgba(255,73,92,0.18),transparent_34%),linear-gradient(155deg,#fbfcff_0%,#f7f8fa_52%,#eef4f8_100%)] text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] -top-[20vw] z-0 h-[min(52vw,640px)] w-[min(52vw,640px)] rotate-[-14deg] rounded-[var(--radius-xl)] bg-[conic-gradient(from_180deg,rgba(0,145,110,0.2),rgba(53,167,255,0.15),rgba(255,73,92,0.14))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-52px] left-[6vw] z-0 h-[132px] w-[min(56vw,700px)] skew-x-[-22deg] bg-[linear-gradient(90deg,rgba(53,167,255,0.2),rgba(0,145,110,0))]"
      />

      <div className="relative z-10 mx-auto max-w-[1080px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <header className="mb-[var(--spacing-lg)] flex flex-col items-start gap-[var(--spacing-md)] md:mb-[var(--spacing-xl)] md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="inline-flex flex-col items-start gap-[var(--spacing-sm)] no-underline md:flex-row md:items-center md:gap-[var(--spacing-md)]"
          >
            <Image
              src="/logo-17suit@4x.svg"
              alt="17Suit"
              width={196}
              height={62}
              className="h-[44px] w-auto"
              priority
            />
            <span className="border-l-0 border-[rgba(0,23,31,0.12)] pl-0 text-md leading-[1.5] text-muted md:border-l md:pl-[var(--spacing-md)]">
              Producto de la suite 17Suit
            </span>
          </Link>

          <nav className="flex w-full gap-[var(--spacing-sm)] md:w-auto">
            <Link
              href={`/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-[rgba(0,23,31,0.12)] bg-white/90 px-[var(--spacing-md)] py-[10px] text-md font-bold leading-[1.4] tracking-plus1_25 text-brand-dark no-underline transition-transform duration-200 hover:-translate-y-px md:flex-none"
            >
              Iniciar sesion
            </Link>
            <Link
              href={`/sign-up?redirect_url=${encodeURIComponent(redirectTarget)}`}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-[var(--spacing-md)] py-[10px] text-md font-bold leading-[1.4] tracking-plus1_25 text-white no-underline shadow-[0_12px_26px_rgba(0,145,110,0.24)] transition-transform duration-200 hover:-translate-y-px md:flex-none"
            >
              Crear cuenta
            </Link>
          </nav>
        </header>

        <section className="grid grid-cols-1 gap-[var(--spacing-md)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <article className="rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[clamp(24px,4vw,44px)] backdrop-blur-sm">
            <p className="mb-[var(--spacing-sm)] inline-flex w-fit items-center rounded-full bg-brand-primary/15 px-3 py-[var(--spacing-xs)] text-xs font-light uppercase tracking-plus1_5 text-brand-dark">
              17Suit / {slug}
            </p>
            <h1 className="m-0 max-w-[16ch] font-arvo text-[clamp(42px,7.2vw,84px)] leading-[1.08] [letter-spacing:-0.015em] text-text">
              {product.name}
            </h1>
            <p className="mt-[var(--spacing-md)] max-w-[50ch] font-amaranth text-[clamp(22px,3.4vw,34px)] leading-[1.2] tracking-plus0_25 text-brand-dark">
              {product.tagline}
            </p>
            <p className="mt-[var(--spacing-md)] max-w-[56ch] text-md leading-[1.5] text-muted">
              {product.summary}
            </p>
            <div className="mt-[var(--spacing-lg)] flex flex-wrap gap-[var(--spacing-sm)]">
              <Link
                href={`/sign-up?redirect_url=${encodeURIComponent(redirectTarget)}`}
                className="inline-flex items-center justify-center rounded-full border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-5 py-[13px] text-md font-bold leading-[1.4] tracking-plus1_25 text-white no-underline shadow-[0_12px_26px_rgba(0,145,110,0.24)] transition-transform duration-200 hover:-translate-y-px"
              >
                Probar este producto
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(0,23,31,0.12)] bg-white/90 px-5 py-[13px] text-md font-bold leading-[1.4] tracking-plus1_25 text-brand-dark no-underline transition-transform duration-200 hover:-translate-y-px"
              >
                Volver al landing
              </Link>
            </div>
          </article>

          <aside className="rounded-[var(--radius-lg)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-lg)] backdrop-blur-sm">
            <h2 className="m-0 font-amaranth text-[clamp(26px,3.6vw,34px)] leading-[1.2] tracking-plus0_25 text-brand-dark">
              Lo que desbloquea
            </h2>
            <ul className="mt-[var(--spacing-md)] grid list-none gap-[var(--spacing-sm)] p-0">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-[var(--spacing-sm)]">
                  <span className="mt-[7px] h-[9px] w-[9px] shrink-0 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary" />
                  <span className="text-md leading-[1.5] text-muted">{highlight}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
