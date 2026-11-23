import type { PropsWithChildren } from 'react';
import { SiteLogo } from './site-logo';

interface AuthShellProps extends PropsWithChildren {
  title: string;
  description: string;
  /** Product the visitor came from, e.g. sign-up with a product `redirect_url`. */
  context?: { accentKey: string; text: string } | undefined;
}

const reasons = [
  'Una cuenta para todas las apps de 17Suit.',
  'Después de entrar, vuelves a la app desde la que llegaste.',
  'Si olvidas tu contraseña, la recuperas con un código en tu correo.',
];

export function AuthShell({ title, description, context, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-suit-canvas font-zilla text-text">
      <div className="mx-auto max-w-[1000px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pt-[var(--spacing-lg)] lg:flex lg:min-h-screen lg:flex-col">
        <header className="mb-[var(--spacing-xl)] flex items-center md:mb-[var(--spacing-x3l)] lg:mb-[var(--spacing-xl)]">
          <SiteLogo />
        </header>

        {/* Desktop: narrower container, columns centred vertically so the form and its
            context read as one block instead of floating in empty canvas. */}
        <section className="grid grid-cols-1 items-start gap-[var(--spacing-xl)] lg:my-auto lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-[var(--spacing-x2l)] lg:pb-[var(--spacing-x3l)]">
          <div className="grid gap-[var(--spacing-md)]">
            <h1 className="m-0 max-w-[14ch] text-balance font-arvo text-[clamp(34px,5.6vw,64px)] font-bold leading-[1.06] tracking-[-0.025em] text-text">
              {title}
            </h1>
            <p className="m-0 max-w-[48ch] text-[clamp(16px,1.4vw,18px)] leading-[1.5] text-muted">
              {description}
            </p>
            {context ? (
              <p
                data-product={context.accentKey}
                className="m-0 w-fit max-w-full rounded-[var(--radius-lg)] border border-product bg-[color-mix(in_oklab,var(--landing-product)_13%,var(--color-surface))] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-md font-bold leading-[1.4] text-text"
              >
                {context.text}
              </p>
            ) : null}
            {/* Compact on mobile (smaller type, tighter rows), full size from md up. */}
            <ul className="m-0 grid list-none gap-[var(--spacing-xs)] p-0 text-sm leading-[1.35] text-muted md:mt-[var(--spacing-sm)] md:gap-[var(--spacing-sm)] md:text-md md:leading-[1.5]">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-[var(--spacing-sm)]">
                  <span
                    aria-hidden="true"
                    className="mt-[6px] size-1.5 shrink-0 rounded-full bg-brand-secondary md:mt-[8px] md:size-2.5"
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <section
            aria-label={title}
            className="rounded-[var(--radius-xl)] border border-line bg-surface p-[clamp(20px,3vw,32px)] shadow-panel"
          >
            {children}
          </section>
        </section>
      </div>
    </main>
  );
}
