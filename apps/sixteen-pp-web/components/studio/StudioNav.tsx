'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavTab {
  label: string;
  href: string;
  description?: string;
}

const TABS: ReadonlyArray<NavTab> = [
  {
    label: 'Panel Generator',
    href: '/studio',
    description: 'Generar assets de UI deterministas.',
  },
  {
    label: 'Pixelation Reference',
    href: '/studio/pixelation-ref',
    description: 'Convertir imágenes en referencias de pixel-art.',
  },
];

function isActive(tabHref: string, pathname: string): boolean {
  // Exact match for /studio; prefix match for nested routes.
  if (tabHref === '/studio') return pathname === '/studio' || pathname === '/studio/';
  return pathname === tabHref || pathname.startsWith(`${tabHref}/`);
}

export function StudioNav() {
  const pathname = usePathname() ?? '';
  return (
    <nav
      aria-label="Secciones del estudio"
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-2">
        <span className="mr-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Estudio
        </span>
        <ul className="flex flex-wrap items-center gap-1">
          {TABS.map((tab) => {
            const active = isActive(tab.href, pathname);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  title={tab.description}
                  className={[
                    'inline-flex items-center rounded-md border px-3 py-1.5 text-xs transition-colors',
                    active
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                  ].join(' ')}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
