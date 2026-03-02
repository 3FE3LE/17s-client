import { auth } from '@clerk/nextjs/server';
import { getSevenReservationsClubPostAuthPath } from '@17suit/module-seven-reservations-club';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserRole } from '@/lib/current-user-role';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    const { role } = await getCurrentUserRole();
    redirect(getSevenReservationsClubPostAuthPath(role));
  }

  const buttonBaseClass =
    'inline-flex items-center justify-center rounded-full border px-[var(--spacing-md)] py-[10px] text-md font-bold leading-[1.4] [letter-spacing:0.0125em] transition-transform duration-200 hover:-translate-y-px';

  return (
    <main className="relative min-h-screen overflow-clip bg-[radial-gradient(circle_at_0%_0%,rgba(53,167,255,0.2),transparent_33%),radial-gradient(circle_at_100%_2%,rgba(255,73,92,0.18),transparent_34%),linear-gradient(152deg,#fbfcff_0%,#f7f8fa_54%,#eef3f7_100%)] text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] -top-[20vw] z-0 h-[min(50vw,620px)] w-[min(50vw,620px)] rotate-[-16deg] rounded-[var(--radius-xl)] bg-[conic-gradient(from_180deg,rgba(0,145,110,0.2),rgba(53,167,255,0.16))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-52px] left-[8vw] z-0 h-[130px] w-[min(52vw,680px)] skew-x-[-22deg] bg-[linear-gradient(90deg,rgba(53,167,255,0.18),rgba(0,145,110,0))]"
      />

      <div className="relative z-10 mx-auto max-w-[1080px] px-[var(--spacing-md)] pb-[var(--spacing-x2l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <header className="mb-[var(--spacing-lg)] flex flex-col items-start gap-[var(--spacing-md)] md:mb-[var(--spacing-xl)] md:flex-row md:items-center md:justify-between md:gap-[var(--spacing-lg)]">
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
              Seven Reservations Club
            </span>
          </Link>

          <nav className="flex w-full gap-[var(--spacing-sm)] md:w-auto">
            <Link
              href="/sign-in?redirect_url=/"
              className={`${buttonBaseClass} flex-1 border-[rgba(0,23,31,0.12)] bg-white/90 text-brand-dark md:flex-none`}
            >
              Iniciar sesion
            </Link>
            <Link
              href="/sign-up?redirect_url=/"
              className={`${buttonBaseClass} flex-1 border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] text-white shadow-[0_12px_26px_rgba(0,145,110,0.24)] md:flex-none`}
            >
              Registrarse
            </Link>
          </nav>
        </header>

        <section className="grid grid-cols-1 gap-[var(--spacing-md)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[clamp(24px,4vw,44px)] backdrop-blur-sm">
            <div className="mb-[var(--spacing-lg)] inline-flex items-center gap-[var(--spacing-sm)] rounded-full bg-brand-primary/15 px-3 py-[var(--spacing-sm)] text-xs font-light uppercase tracking-plus1_5 text-brand-dark">
              <Image src="/icon-17suit.png" alt="17Suit Icon" width={20} height={20} />
              <span>Opera tu club en una sola plataforma</span>
            </div>

            <h1 className="m-0 max-w-[14ch] font-arvo text-[clamp(44px,7vw,84px)] leading-[1.08] [letter-spacing:-0.015em] text-text">
              Gestiona reservas, canchas y jugadores sin friccion.
            </h1>

            <p className="mt-[var(--spacing-md)] max-w-[52ch] text-md leading-[1.5] text-muted">
              Seven RC centraliza la operacion de complejos deportivos con flujos distintos para
              OWNER y PLAYER, autenticacion unificada y ruta automatica por rol.
            </p>

            <div className="mt-[var(--spacing-lg)] flex flex-wrap gap-[var(--spacing-sm)]">
              <Link
                href="/sign-up?redirect_url=/"
                className={`${buttonBaseClass} border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-5 py-[13px] text-white shadow-[0_12px_26px_rgba(0,145,110,0.24)]`}
              >
                Crear cuenta
              </Link>
              <Link
                href="/sign-in?redirect_url=/"
                className={`${buttonBaseClass} border-[rgba(0,23,31,0.12)] bg-white/90 px-5 py-[13px] text-brand-dark`}
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          <aside className="grid gap-[var(--spacing-sm)]">
            <article className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-lg)] backdrop-blur-sm">
              <div className="pointer-events-none absolute -right-[38px] -top-[40px] h-[136px] w-[136px] rounded-full bg-[radial-gradient(circle,rgba(53,167,255,0.24),rgba(53,167,255,0))]" />
              <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">OWNER</p>
              <h2 className="my-[var(--spacing-sm)] font-amaranth text-[clamp(28px,3.8vw,34px)] leading-[1.2] tracking-plus0_25 text-brand-dark">
                Administra tu complejo y sus reservas
              </h2>
              <p className="m-0 text-md leading-[1.5] text-muted">
                Controla disponibilidad de canchas, monitorea actividad y da seguimiento a tus
                clientes.
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-lg)] backdrop-blur-sm">
              <div className="pointer-events-none absolute -right-[38px] -top-[40px] h-[136px] w-[136px] rounded-full bg-[radial-gradient(circle,rgba(255,73,92,0.24),rgba(255,73,92,0))]" />
              <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">PLAYER</p>
              <h2 className="my-[var(--spacing-sm)] font-amaranth text-[clamp(28px,3.8vw,34px)] leading-[1.2] tracking-plus0_25 text-brand-dark">
                Reserva rapido y juega sin vueltas
              </h2>
              <p className="m-0 text-md leading-[1.5] text-muted">
                Busca complejos, agenda tus partidos y revisa tu historial desde el mismo flujo.
              </p>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}
