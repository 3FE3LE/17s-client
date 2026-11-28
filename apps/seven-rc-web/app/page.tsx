import { getServerAuth } from '@/lib/server-auth';
import { getSevenReservationsClubPostAuthPath } from '@17suit/module-seven-reservations-club';
import { CheckCircle2, buttonRecipe, cx, pageContainerRecipe } from '@17suit/ui';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserRole } from '@/lib/current-user-role';
import { getServerT } from '@/lib/i18n-server';

type T = Awaited<ReturnType<typeof getServerT>>['t'];

const audiences = (t: T) =>
  [
    {
      title: t('home.audiencePlayerTitle'),
      steps: [
        t('home.audiencePlayerSteps.step1'),
        t('home.audiencePlayerSteps.step2'),
        t('home.audiencePlayerSteps.step3'),
      ],
    },
    {
      title: t('home.audienceOwnerTitle'),
      steps: [
        t('home.audienceOwnerSteps.step1'),
        t('home.audienceOwnerSteps.step2'),
        t('home.audienceOwnerSteps.step3'),
      ],
    },
  ] as const;

/** Sign-up that lands on role onboarding with the matching option pre-selected. */
const signUpFor = (rol: 'jugador' | 'complejo') =>
  `/sign-up?redirect_url=${encodeURIComponent(`/onboarding/role?rol=${rol}`)}`;

const PREVIEW_SLOTS = [
  { hour: 6, free: false },
  { hour: 7, free: true, selected: true },
  { hour: 8, free: true },
  { hour: 9, free: false },
] as const;

/**
 * Illustration of the booking step: free slots are chosen, taken ones are crossed out.
 * Drawn flat on a tinted plate, with no button shapes or pointer affordances, so it reads
 * as a picture of the product rather than a control on this page.
 */
function SlotPreview({ t }: { t: T }) {
  return (
    <figure className="m-0 grid gap-[var(--spacing-sm)] border-t border-border-default pt-[var(--spacing-lg)] lg:border-l lg:border-t-0 lg:pl-[var(--spacing-xl)] lg:pt-0">
      <div
        aria-hidden
        inert
        className="pointer-events-none grid select-none gap-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-background/70 p-[var(--spacing-md)]"
      >
        <p className="m-0 font-arvo text-md leading-[1.3] text-text">{t('home.previewCourt')}</p>
        <p className="m-0 text-sm leading-[18px] text-muted">{t('home.previewDay')}</p>
        <div className="grid grid-cols-2 gap-[var(--spacing-xs)]">
          {PREVIEW_SLOTS.map((slot) => (
            <span
              key={slot.hour}
              className={cx(
                'flex min-h-9 items-center justify-center gap-xs rounded-[var(--radius-sm)] px-2 text-sm tabular-nums',
                !slot.free && 'text-muted line-through',
                slot.free && !('selected' in slot) && 'bg-surface font-bold text-text',
                'selected' in slot && 'bg-action-primary-soft font-bold text-text',
              )}
            >
              {'selected' in slot ? <CheckCircle2 size={14} aria-hidden /> : null}
              {t('home.previewTimeFormat', { hour: slot.hour })}
            </span>
          ))}
        </div>
        <p className="m-0 text-sm leading-[18px] text-text">
          <span className="font-bold">{t('home.previewTimeFormat', { hour: 7 })}</span> ·{' '}
          {t('home.previewPending')}
        </p>
      </div>
      <figcaption className="text-pretty text-sm leading-[1.45] text-muted">
        {t('home.previewCaption')}
      </figcaption>
    </figure>
  );
}

export default async function HomePage() {
  const { t } = await getServerT('shell');
  const { userId } = await getServerAuth();

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
              alt={t('brand.suite')}
              width={196}
              height={62}
              className="h-[44px] w-auto"
              priority
            />
            <span className="border-l-0 border-border-default pl-0 text-md leading-[1.5] text-muted md:border-l md:pl-[var(--spacing-md)]">
              {t('brand.product')}
            </span>
          </Link>

          {/* Mobile already gets both actions in the hero; the header copy would duplicate them. */}
          <nav aria-label={t('home.accountNav')} className="hidden gap-[var(--spacing-sm)] md:flex">
            <Link
              href="/sign-in?redirect_url=/"
              className={cx(
                buttonRecipe({
                  intent: 'secondary',
                  size: 'sm',
                  platform: 'web',
                  fullWidth: false,
                }),
                'flex-none',
              )}
            >
              {t('footer.signIn')}
            </Link>
            <Link
              href="/sign-up?redirect_url=/"
              className={cx(
                buttonRecipe({ intent: 'primary', size: 'sm', platform: 'web', fullWidth: false }),
                'flex-none',
              )}
            >
              {t('footer.signUp')}
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-[var(--spacing-xl)] rounded-[var(--radius-xl)] border border-border-default bg-surface-panel p-[clamp(24px,4vw,44px)] shadow-panel backdrop-blur-sm lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="@container min-w-0">
            <h1 className="m-0 max-w-[18ch] text-balance break-words font-arvo text-[clamp(32px,12cqi,68px)] leading-[1.08] [letter-spacing:-0.015em] text-text">
              {t('home.heroTitle')}
            </h1>

            <p className="mt-[var(--spacing-md)] max-w-[56ch] text-pretty text-md leading-[1.5] text-muted">
              {t('home.heroBody')}
            </p>

            <div className="mt-[var(--spacing-lg)] flex flex-wrap gap-[var(--spacing-sm)]">
              <Link
                href={signUpFor('jugador')}
                className={cx(
                  buttonRecipe({
                    intent: 'primary',
                    size: 'lg',
                    platform: 'web',
                    fullWidth: false,
                  }),
                  'w-full sm:w-auto',
                )}
              >
                {t('home.bookCourt')}
              </Link>
              <Link
                href={signUpFor('complejo')}
                className={cx(
                  buttonRecipe({
                    intent: 'secondary',
                    size: 'lg',
                    platform: 'web',
                    fullWidth: false,
                  }),
                  'w-full sm:w-auto',
                )}
              >
                {t('home.publishVenue')}
              </Link>
            </div>
            <p className="mt-[var(--spacing-sm)] text-md leading-[1.5] text-muted">
              {t('home.haveAccount')}{' '}
              <Link
                href="/sign-in?redirect_url=/"
                className="inline-flex min-h-11 items-center font-bold text-text underline underline-offset-4"
              >
                {t('home.signInLink')}
              </Link>
            </p>
          </div>

          <SlotPreview t={t} />
        </section>

        <section
          aria-label={t('home.howItWorks')}
          className="mt-[var(--spacing-xl)] grid gap-[var(--spacing-xl)] md:grid-cols-2 md:gap-[var(--spacing-x2l)]"
        >
          {audiences(t).map((audience) => (
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
