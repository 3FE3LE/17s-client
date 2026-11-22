import type { PropsWithChildren } from 'react';
import { SiteHeader } from './landing-ui';

interface AuthShellProps extends PropsWithChildren {
  title: string;
  description: string;
}

const reasons = [
  'Una cuenta para todas las apps de 17Suit.',
  'Después de entrar, vuelves a la app desde la que llegaste.',
  'Si olvidas tu contraseña, la recuperas con un código en tu correo.',
];

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-suit-canvas font-zilla text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pt-[var(--spacing-lg)]">
        <SiteHeader />

        <section className="grid grid-cols-1 items-start gap-[var(--spacing-xl)] lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-[var(--spacing-x3l)]">
          <div className="grid gap-[var(--spacing-md)] lg:pt-[var(--spacing-lg)]">
            <h1 className="m-0 max-w-[14ch] text-balance font-arvo text-[clamp(34px,5.6vw,64px)] font-bold leading-[1.06] tracking-[-0.025em] text-text">
              {title}
            </h1>
            <p className="m-0 max-w-[48ch] text-[clamp(16px,1.4vw,18px)] leading-[1.5] text-muted">
              {description}
            </p>
            <ul className="m-0 mt-[var(--spacing-sm)] hidden list-none gap-[var(--spacing-sm)] p-0 text-md leading-[1.5] text-muted md:grid">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-[var(--spacing-sm)]">
                  <span
                    aria-hidden="true"
                    className="mt-[8px] size-2.5 shrink-0 rounded-full bg-brand-secondary"
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
