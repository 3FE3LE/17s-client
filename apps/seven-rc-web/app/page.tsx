import { auth } from '@clerk/nextjs/server';
import { getSevenReservationsClubPostAuthPath } from '@17suit/module-seven-reservations-club';
import { buttonRecipe, cx, pageContainerRecipe } from '@17suit/ui';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserRole } from '@/lib/current-user-role';

const AUDIENCES = [
  {
    title: 'Si juegas',
    steps: [
      'Busca el complejo por nombre o dirección.',
      'Elige cancha, día y uno de los horarios libres.',
      'Sigue tu reserva hasta que el complejo la confirme.',
    ],
  },
  {
    title: 'Si administras un complejo',
    steps: [
      'Publica tus canchas con sus horarios de apertura.',
      'Confirma o rechaza cada solicitud desde una sola lista.',
      'Revisa la agenda del día en la hora de tu complejo.',
    ],
  },
] as const;

const PREVIEW_SLOTS = [
  { time: '6:00 p. m.', free: false },
  { time: '7:00 p. m.', free: true, selected: true },
  { time: '8:00 p. m.', free: true },
  { time: '9:00 p. m.', free: false },
] as const;

/** Illustration of the booking step: free slots are chosen, taken ones are crossed out. */
function SlotPreview() {
  return (
    <figure className="m-0 grid gap-[var(--spacing-sm)] border-t border-border-default pt-[var(--spacing-lg)] lg:border-l lg:border-t-0 lg:pl-[var(--spacing-xl)] lg:pt-0">
      <div aria-hidden className="grid gap-[var(--spacing-sm)]">
        <p className="m-0 font-arvo text-lg leading-[1.3] text-text">Cancha 2 · Fútbol 5</p>
        <div className="grid grid-cols-2 gap-[var(--spacing-sm)]">
          {PREVIEW_SLOTS.map((slot) => (
            <span
              key={slot.time}
              className={cx(
                'flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-3 text-md tabular-nums',
                !slot.free && 'border-border-default text-muted line-through',
                slot.free && 'border-border-strong font-bold text-text',
                'selected' in slot && 'border-action-primary bg-action-primary-soft',
              )}
            >
              {slot.time}
            </span>
          ))}
        </div>
        <span className="flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-action-primary px-3 font-bold text-foreground-inverse">
          Reservar
        </span>
      </div>
      <figcaption className="text-pretty text-sm leading-[1.45] text-muted">
        Los horarios ocupados aparecen tachados; solo eliges entre los libres.
      </figcaption>
    </figure>
  );
}

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    const { role } = await getCurrentUserRole();
    redirect(getSevenReservationsClubPostAuthPath(role));
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
              Seven Reservations Club
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
              Iniciar sesión
            </Link>
            <Link
              href="/sign-up?redirect_url=/"
              className={cx(
                buttonRecipe({ intent: 'primary', size: 'sm', platform: 'web', fullWidth: false }),
                'flex-1 md:flex-none',
              )}
            >
              Crear cuenta
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-[var(--spacing-xl)] rounded-[var(--radius-xl)] border border-border-default bg-surface-panel p-[clamp(24px,4vw,44px)] shadow-panel backdrop-blur-sm lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="@container min-w-0">
            <h1 className="m-0 max-w-[18ch] text-balance break-words font-arvo text-[clamp(32px,12cqi,68px)] leading-[1.08] [letter-spacing:-0.015em] text-text">
              Elige el horario libre y reserva tu cancha.
            </h1>

            <p className="mt-[var(--spacing-md)] max-w-[56ch] text-pretty text-md leading-[1.5] text-muted">
              Seven RC muestra los turnos disponibles de cada cancha. Eliges día y hora, el complejo
              confirma tu reserva y ves el estado en un solo lugar, sin cadenas de mensajes por
              WhatsApp.
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

          <SlotPreview />
        </section>

        <section
          aria-label="Cómo funciona"
          className="mt-[var(--spacing-xl)] grid gap-[var(--spacing-xl)] md:grid-cols-2 md:gap-[var(--spacing-x2l)]"
        >
          {AUDIENCES.map((audience) => (
            <article key={audience.title} className="grid content-start gap-[var(--spacing-sm)]">
              <h2 className="m-0 font-amaranth text-[clamp(24px,3vw,30px)] leading-[1.2] text-brand-dark">
                {audience.title}
              </h2>
              <ol className="m-0 grid gap-[var(--spacing-sm)] list-decimal pl-[1.25em] text-pretty text-md leading-[1.5] text-text marker:font-bold marker:text-muted">
                {audience.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
