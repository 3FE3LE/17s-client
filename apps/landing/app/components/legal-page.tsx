import Link from 'next/link';
import type { ReactNode, SVGProps } from 'react';
import { SiteHeader } from './landing-ui';

/*
 * Shared structure for the placeholder legal pages (/privacidad, /terminos).
 * The owner writes the legal text; this component only renders the outline.
 * Do not add legal or data-handling claims here.
 */

export interface LegalSection {
  /** Stable anchor id; other pages link to it (e.g. /privacidad#acceso-a-gmail). */
  id: string;
  title: string;
  /** Points the reader to /contacto while the section text is pending. */
  linksToContact?: boolean;
}

interface LegalPageProps {
  title: string;
  description: string;
  sections: readonly LegalSection[];
}

/* Icon geometry from lucide (ISC): info, 24px grid, 2px stroke. */
function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function ReviewNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="flex items-start gap-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-line bg-surface px-[var(--spacing-md)] py-[var(--spacing-sm)] text-md leading-[1.5] text-text"
    >
      <InfoIcon className="mt-[3px] shrink-0 text-muted" />
      <p className="m-0">{children}</p>
    </div>
  );
}

export function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader />

        {/* Desktop: reading column plus a sticky table of contents, so the page
            uses the width instead of leaving a blank right half. */}
        <article
          aria-labelledby="legal-title"
          className="grid grid-cols-1 gap-x-[var(--spacing-x3l)] lg:grid-cols-[minmax(0,68ch)_minmax(220px,1fr)]"
        >
          <header className="grid max-w-[68ch] gap-[var(--spacing-md)] lg:col-start-1 lg:row-start-1">
            <h1
              id="legal-title"
              className="m-0 text-balance font-arvo text-[clamp(34px,5vw,56px)] font-bold leading-[1.06] tracking-[-0.025em] text-text"
            >
              {title}
            </h1>
            <p className="m-0 text-[clamp(16px,1.4vw,18px)] leading-[1.5] text-muted">
              {description}
            </p>
            {/* TODO(legal): replace "Pendiente" with the publication date of the final text. */}
            <p className="m-0 text-sm leading-[18px] text-muted">
              Última actualización: <span className="font-bold text-text">Pendiente</span>
            </p>
            <ReviewNotice>
              {/* TODO(legal): replace with the final notice once the text is approved. */}
              Documento en revisión.
            </ReviewNotice>
          </header>

          <nav
            aria-label="Contenido"
            className="mt-[var(--spacing-xl)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0"
          >
            <div className="lg:sticky lg:top-[var(--spacing-lg)] lg:rounded-[var(--radius-lg)] lg:border lg:border-line lg:bg-surface lg:p-[var(--spacing-md)]">
              <h2 className="m-0 font-arvo text-md font-bold leading-[1.3] text-text">Contenido</h2>
              <ol className="m-0 mt-[var(--spacing-xs)] grid list-decimal gap-x-[var(--spacing-lg)] pl-[1.25em] text-md leading-[1.4] text-muted sm:grid-cols-2 lg:grid-cols-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="inline-flex min-h-11 items-center text-text underline decoration-line hover:decoration-current"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="mt-[var(--spacing-xl)] grid max-w-[68ch] gap-[var(--spacing-xl)] border-t border-line pt-[var(--spacing-xl)] lg:col-start-1 lg:row-start-2">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-[var(--spacing-lg)]"
              >
                <h2
                  id={`${section.id}-title`}
                  className="m-0 text-balance font-arvo text-[clamp(22px,2.6vw,28px)] font-bold leading-[1.2] text-text"
                >
                  {section.title}
                </h2>
                {/* TODO(legal): replace this placeholder with the owner-approved text. */}
                <p className="m-0 mt-[var(--spacing-sm)] text-md italic leading-[1.5] text-muted">
                  Pendiente de redacción.
                </p>
                {section.linksToContact ? (
                  <p className="m-0 text-md leading-[1.5] text-muted">
                    Mientras tanto, escríbenos desde la{' '}
                    <Link
                      href="/contacto"
                      className="font-bold text-text underline underline-offset-4"
                    >
                      página de contacto
                    </Link>
                    .
                  </p>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
