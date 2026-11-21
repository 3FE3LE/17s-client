import { auth } from '@clerk/nextjs/server';
import {
  getNineCareCompanionPostAuthPath,
} from '@17suit/module-nine-care-companion';
import { buttonRecipe, cardRecipe, cx, pageContainerRecipe } from '@17suit/ui';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect(getNineCareCompanionPostAuthPath());
  }

  return (
    <main className="relative min-h-screen overflow-clip bg-suit-landing-canvas text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] -top-[20vw] z-0 h-[min(50vw,620px)] w-[min(50vw,620px)] rotate-[-16deg] rounded-[var(--radius-xl)] bg-ambient-landing-conic"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-52px] left-[8vw] z-0 h-[130px] w-[min(52vw,680px)] skew-x-[-22deg] bg-ambient-cyan-line"
      />

      <div className={pageContainerRecipe({ kind: 'landing' })}>
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
            <span className="border-l-0 border-border-default pl-0 text-md leading-[1.5] text-muted md:border-l md:pl-[var(--spacing-md)]">
              Nine Care Companion
            </span>
          </Link>

          <nav className="flex w-full gap-[var(--spacing-sm)] md:w-auto">
            <Link
              href="/sign-in?redirect_url=/"
              className={cx(
                buttonRecipe({
                  intent: 'secondary',
                  size: 'sm',
                  platform: 'web',
                  fullWidth: false,
                }),
                'flex-1 md:flex-none',
              )}
            >
              Iniciar sesion
            </Link>
            <Link
              href="/sign-up?redirect_url=/"
              className={cx(
                buttonRecipe({ intent: 'primary', size: 'sm', platform: 'web', fullWidth: false }),
                'flex-1 md:flex-none',
              )}
            >
              Registrarse
            </Link>
          </nav>
        </header>

        <section className="grid grid-cols-1 gap-[var(--spacing-md)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className={cardRecipe({ variant: 'hero' })}>
            <div className="mb-[var(--spacing-lg)] inline-flex items-center gap-[var(--spacing-sm)] rounded-full bg-brand-primary/15 px-3 py-[var(--spacing-sm)] text-xs font-light uppercase tracking-plus1_5 text-brand-dark">
              <Image src="/icon-17suit.png" alt="17Suit Icon" width={20} height={20} />
              <span>Cuidado compartido, no solo recordatorios</span>
            </div>

            <h1 className="m-0 max-w-[16ch] font-arvo text-[clamp(40px,6.5vw,76px)] leading-[1.08] [letter-spacing:-0.015em] text-text">
              Coordina el cuidado de quien mas quieres.
            </h1>

            <p className="mt-[var(--spacing-md)] max-w-[52ch] text-md leading-[1.5] text-muted">
              Nine Care Companion es una plataforma de coordinacion para familias que cuidan a
              alguien en casa. Care Circle, bloques de medicacion, citas, notas y alertas — todo
              respaldado por un backend que es la unica fuente de verdad.
            </p>

            <div className="mt-[var(--spacing-lg)] flex flex-wrap gap-[var(--spacing-sm)]">
              <Link
                href="/sign-up?redirect_url=/"
                className={buttonRecipe({
                  intent: 'primary',
                  size: 'lg',
                  platform: 'web',
                  fullWidth: false,
                })}
              >
                Crear cuenta
              </Link>
              <Link
                href="/sign-in?redirect_url=/"
                className={buttonRecipe({
                  intent: 'secondary',
                  size: 'lg',
                  platform: 'web',
                  fullWidth: false,
                })}
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          <aside className="grid gap-[var(--spacing-sm)]">
            <article className={cx('relative overflow-hidden', cardRecipe({ variant: 'feature' }))}>
              <div className="pointer-events-none absolute -right-[38px] -top-[40px] h-[136px] w-[136px] rounded-full bg-ambient-cyan-orb" />
              <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
                CIRCUITO DE CUIDADO
              </p>
              <h2 className="my-[var(--spacing-sm)] font-amaranth text-[clamp(28px,3.8vw,34px)] leading-[1.2] tracking-plus0_25 text-brand-dark">
                Todos los cuidadores alineados
              </h2>
              <p className="m-0 text-md leading-[1.5] text-muted">
                Cada familiar y profesional participa segun permisos. La misma medicacion, la
                misma agenda, sin versiones distintas del mismo plan.
              </p>
            </article>

            <article className={cx('relative overflow-hidden', cardRecipe({ variant: 'feature' }))}>
              <div className="pointer-events-none absolute -right-[38px] -top-[40px] h-[136px] w-[136px] rounded-full bg-ambient-coral-orb" />
              <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
                ESTADO EN 10 SEGUNDOS
              </p>
              <h2 className="my-[var(--spacing-sm)] font-amaranth text-[clamp(28px,3.8vw,34px)] leading-[1.2] tracking-plus0_25 text-brand-dark">
                Que tomo, que falta, que toca
              </h2>
              <p className="m-0 text-md leading-[1.5] text-muted">
                Timeline diario con bloques confirmados, pendientes y postergados. Interven solo
                cuando hace falta.
              </p>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}
