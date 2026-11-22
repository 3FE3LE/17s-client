'use client';

import { AppEmpty } from '@17suit/ui';
import Link from 'next/link';
import { getSection, type SectionKey } from '@/lib/sections';
import { sectionIcons } from './admin-nav';

// Honest placeholder for a console section that is not built yet. No fake data.
export function SectionPending({ section: key }: { section: Exclude<SectionKey, 'overview'> }) {
  const section = getSection(key);
  const Icon = sectionIcons[key];

  return (
    <section aria-labelledby={`${key}-estado`} className="grid gap-[var(--spacing-md)]">
      <h2 id={`${key}-estado`} className="sr-only">
        Estado de la sección
      </h2>
      <AppEmpty
        icon={<Icon size={20} strokeWidth={2.2} aria-hidden />}
        title={`${section.label} todavía no está disponible`}
        description={section.purpose}
      >
        {section.dependency ? (
          <p className="m-0 max-w-[480px] text-sm leading-[18px] text-muted">
            {section.dependency}
          </p>
        ) : null}
        <Link
          href="/"
          className="mt-[var(--spacing-xs)] text-sm font-bold text-info underline underline-offset-4"
        >
          Volver al resumen
        </Link>
      </AppEmpty>
    </section>
  );
}
