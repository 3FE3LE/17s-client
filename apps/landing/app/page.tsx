import Image from 'next/image';
import Link from 'next/link';

const products = [
  {
    slug: 'seven-reservations-club',
    name: 'Seven Reservations Club',
    tagline: 'Reservas y operación de hospitalidad',
  },
  {
    slug: 'six-sense-proof',
    name: 'Six Sense Proof',
    tagline: 'Flujos de validación con evidencia',
  },
  {
    slug: 'five-barber-go',
    name: 'Five Barber Go',
    tagline: 'Agenda y fidelización para barberías',
  },
  {
    slug: 'nine-to-nine-nurse',
    name: 'Nine To Nine Nurse',
    tagline: 'Gestión de turnos y seguimiento clínico',
  },
  {
    slug: 'fifteen-all-check',
    name: 'Fifteen All Check',
    tagline: 'Cockpit financiero personal con evidencia',
  },
  {
    slug: 'two-split-bill',
    name: 'Two Split Bill',
    tagline: 'Pagos compartidos sin fricción',
  },
  {
    slug: 'one-plan-trip',
    name: 'One Plan Trip',
    tagline: 'Planeación inteligente de viajes',
  },
  {
    slug: 'four-you-closet',
    name: 'Four You Closet',
    tagline: 'Organización de looks y guardarropa',
  },
  {
    slug: 'eight-dream-dishes',
    name: 'Eight Dream Dishes',
    tagline: 'Operación culinaria y recetas escalables',
  },
];

export default function HomePage() {
  const buttonBaseClass =
    'inline-flex items-center justify-center rounded-full border px-[var(--spacing-md)] py-[10px] text-md font-bold leading-[1.4] [letter-spacing:0.0125em] transition-transform duration-200 hover:-translate-y-px';

  return (
    <main className="relative min-h-screen overflow-clip bg-[radial-gradient(circle_at_8%_1%,rgba(53,167,255,0.22),transparent_40%),radial-gradient(circle_at_96%_4%,rgba(255,73,92,0.16),transparent_34%),linear-gradient(155deg,#fbfcff_0%,#f7f8fa_46%,#eef4f8_100%)] text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[24vw] -top-[24vw] z-0 h-[min(58vw,690px)] w-[min(58vw,690px)] rotate-[-15deg] rounded-[var(--radius-xl)] bg-[conic-gradient(from_180deg,rgba(0,145,110,0.2),rgba(53,167,255,0.16),rgba(255,73,92,0.16))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-52px] left-[6vw] z-0 h-[140px] w-[min(64vw,720px)] skew-x-[-24deg] bg-[linear-gradient(90deg,rgba(53,167,255,0.22),rgba(0,145,110,0))]"
      />

      <div className="relative z-10 mx-auto max-w-[1080px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <header className="mb-[var(--spacing-lg)] flex flex-col items-start gap-[var(--spacing-md)] md:mb-[var(--spacing-x2l)] md:flex-row md:items-center md:justify-between md:gap-[var(--spacing-lg)]">
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
              Suite de apps y herramientas conectadas
            </span>
          </Link>

          <nav className="flex w-full items-center gap-[var(--spacing-sm)] md:w-auto">
            <Link
              href="/sign-in"
              className={`${buttonBaseClass} flex-1 border-[rgba(0,23,31,0.12)] bg-white/90 text-brand-dark md:flex-none`}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/sign-up"
              className={`${buttonBaseClass} flex-1 border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] text-white shadow-[0_12px_26px_rgba(0,145,110,0.24)] md:flex-none`}
            >
              Registrarse
            </Link>
          </nav>
        </header>

        <section className="mb-[var(--spacing-xl)] grid grid-cols-1 gap-[var(--spacing-md)] lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)]">
          <div className="rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[clamp(24px,4vw,44px)] backdrop-blur-sm">
            <div className="mb-[var(--spacing-lg)] inline-flex items-center gap-[var(--spacing-sm)] rounded-full bg-brand-primary/15 px-3 py-[var(--spacing-sm)] text-xs font-light uppercase tracking-plus1_5 text-brand-dark">
              <Image src="/icon-17suit.png" alt="17Suit Icon" width={20} height={20} />
              <span>Una cuenta para todo el ecosistema 17Suit</span>
            </div>

            <h1 className="m-0 max-w-[16ch] font-arvo text-[clamp(48px,8vw,96px)] leading-[1.08] [letter-spacing:-0.015em] text-text">
              Herramientas listas para facilitar tu día, en una sola suite.
            </h1>

            <p className="mt-[var(--spacing-lg)] max-w-[52ch] text-md leading-[1.5] text-muted">
              Centralizamos autenticación, operación y producto para que cada app resuelva un caso
              real y se conecte con el resto sin fricción.
            </p>

            <div className="mt-[var(--spacing-xl)] flex flex-wrap items-center gap-[var(--spacing-sm)]">
              <Link
                href="/sign-up"
                className={`${buttonBaseClass} border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-5 py-[13px] text-white shadow-[0_12px_26px_rgba(0,145,110,0.24)]`}
              >
                Crear cuenta
              </Link>
              <Link
                href="/sign-in"
                className={`${buttonBaseClass} border-[rgba(0,23,31,0.12)] bg-white/90 px-5 py-[13px] text-brand-dark`}
              >
                Entrar a mi cuenta
              </Link>
            </div>
          </div>

          <aside className="grid gap-[var(--spacing-sm)]">
            <article className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-lg)] backdrop-blur-sm">
              <div className="pointer-events-none absolute -right-[42px] -top-[44px] h-[140px] w-[140px] rounded-full bg-[radial-gradient(circle,rgba(53,167,255,0.26),rgba(53,167,255,0))]" />
              <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
                Autenticación central
              </p>
              <h2 className="my-[var(--spacing-sm)] font-amaranth text-[clamp(28px,3.8vw,34px)] leading-[1.2] tracking-plus0_25 text-brand-dark">
                Landing como hub de acceso con Clerk
              </h2>
              <p className="m-0 text-md leading-[1.5] text-muted">
                Desde aquí se inicia sesión y se enruta al producto correcto según el flujo de cada
                app.
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-lg)] backdrop-blur-sm">
              <div className="pointer-events-none absolute -right-[42px] -top-[44px] h-[140px] w-[140px] rounded-full bg-[radial-gradient(circle,rgba(255,73,92,0.24),rgba(255,73,92,0))]" />
              <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
                Escalado sin caos
              </p>
              <h2 className="my-[var(--spacing-sm)] font-amaranth text-[clamp(28px,3.8vw,34px)] leading-[1.2] tracking-plus0_25 text-brand-dark">
                8 productos, misma base operativa
              </h2>
              <p className="m-0 text-md leading-[1.5] text-muted">
                Misma identidad, componentes compartidos y experiencia consistente en web y mobile.
              </p>
            </article>
          </aside>
        </section>

        <section className="mt-[var(--spacing-x2l)]">
          <h2 className="m-0 font-amaranth text-[clamp(36px,5vw,48px)] font-bold leading-[1.16] text-brand-dark">
            Lo que hace fuerte a 17Suit
          </h2>
          <div className="mt-[var(--spacing-md)] grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-[var(--radius-lg)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-md)] backdrop-blur-sm">
              <h3 className="m-0 font-arvo text-lg font-bold leading-[1.25] text-brand-dark">
                Acceso unificado
              </h3>
              <p className="mt-[var(--spacing-sm)] text-md leading-[1.5] text-muted">
                Una cuenta, múltiples productos y menos fricción para cada usuario.
              </p>
            </article>
            <article className="rounded-[var(--radius-lg)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-md)] backdrop-blur-sm">
              <h3 className="m-0 font-arvo text-lg font-bold leading-[1.25] text-brand-dark">
                Flujo por rol
              </h3>
              <p className="mt-[var(--spacing-sm)] text-md leading-[1.5] text-muted">
                Después del login, cada perfil aterriza directo en su vista de trabajo.
              </p>
            </article>
            <article className="rounded-[var(--radius-lg)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-md)] backdrop-blur-sm">
              <h3 className="m-0 font-arvo text-lg font-bold leading-[1.25] text-brand-dark">
                Suite conectada
              </h3>
              <p className="mt-[var(--spacing-sm)] text-md leading-[1.5] text-muted">
                Componentes, tokens y prácticas compartidas para evolucionar más rápido.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-[var(--spacing-x2l)]">
          <div className="flex flex-col items-start justify-between gap-[var(--spacing-md)] md:flex-row md:items-end">
            <h2 className="m-0 font-amaranth text-[clamp(36px,5vw,48px)] font-bold leading-[1.16] text-brand-dark">
              Productos disponibles
            </h2>
            <p className="m-0 max-w-[48ch] text-md leading-[1.5] text-muted">
              Espacios listos para SEO, campañas y páginas de conversión por producto.
            </p>
          </div>

          <div className="mt-[var(--spacing-md)] grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-md)] no-underline backdrop-blur-sm"
              >
                <p className="m-0 font-arvo text-lg font-bold leading-[1.25] text-brand-dark">
                  {product.name}
                </p>
                <p className="mt-[var(--spacing-sm)] min-h-[3.4em] text-md leading-[1.5] text-muted">
                  {product.tagline}
                </p>
                <span className="mt-3 inline-flex items-center gap-[var(--spacing-sm)] text-md font-bold leading-[1.4] tracking-plus1_25 text-brand-secondary">
                  Ver página <span aria-hidden>{'->'}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
