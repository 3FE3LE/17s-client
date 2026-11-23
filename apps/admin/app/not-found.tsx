import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonRecipe } from '@17suit/ui';

export const metadata: Metadata = {
  title: 'Página no encontrada',
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-background px-[var(--spacing-md)] py-[var(--spacing-x2l)]">
      <section
        aria-labelledby="no-encontrada"
        className="grid w-full max-w-[560px] gap-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-border-default bg-surface p-[var(--spacing-lg)] shadow-panel"
      >
        <h1
          id="no-encontrada"
          className="m-0 text-balance font-arvo text-2xl font-bold leading-[1.2] text-text"
        >
          Esta página no existe
        </h1>
        <p className="m-0 max-w-[65ch] text-md leading-[1.5] text-muted">
          La dirección no corresponde a ninguna sección de la consola de operación. Revisa el enlace
          o vuelve al resumen.
        </p>
        <div>
          <Link
            href="/"
            className={`${buttonRecipe({ intent: 'secondary', size: 'sm', shape: 'md', fullWidth: false })} no-underline`}
          >
            Ir al resumen
          </Link>
        </div>
      </section>
    </main>
  );
}
