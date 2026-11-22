import Link from 'next/link';
import { getSection, type SectionKey } from '@/lib/sections';
import { sectionIcons } from './admin-nav';

export type PendingSectionKey = Exclude<SectionKey, 'overview'>;

// Honest placeholder for a console section that is not built yet. No fake data.
// Own markup rather than AppEmpty: AppEmpty renders its title as a <p>, and the
// section status must be a real heading under the page h1. Plain tokens keep it
// a server component (no theme hook).
export function SectionPending({ section: key }: { section: PendingSectionKey }) {
  const section = getSection(key);
  const Icon = sectionIcons[key];
  const headingId = `${key}-estado`;

  return (
    <section
      aria-labelledby={headingId}
      className="grid justify-items-center gap-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-dashed border-border-emphasis bg-surface p-[var(--spacing-lg)] text-center"
    >
      <span
        aria-hidden
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary/12 text-brand-primary"
      >
        <Icon size={20} strokeWidth={2.2} aria-hidden />
      </span>
      <h2
        id={headingId}
        className="m-0 text-balance font-arvo text-lg font-bold leading-[1.25] text-text"
      >
        {section.label} todavía no está disponible
      </h2>
      <p className="m-0 max-w-[60ch] text-pretty text-md leading-[1.5] text-text">
        {section.purpose}
      </p>
      {section.dependency ? (
        <p className="m-0 max-w-[60ch] text-pretty text-sm leading-[18px] text-muted">
          {section.dependency}
        </p>
      ) : null}
      <Link
        href="/"
        className="mt-[var(--spacing-xs)] text-sm font-bold text-info underline underline-offset-4"
      >
        Volver al resumen
      </Link>
    </section>
  );
}
