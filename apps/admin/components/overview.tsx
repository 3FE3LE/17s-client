import { buttonRecipe, cx } from '@17suit/ui';
import Link from 'next/link';
import type { DeploymentEnvironment } from '@/lib/environment';
import { suiteProducts, surfaceLabel, type SuiteProduct } from '@/lib/products';
import { consoleSections } from '@/lib/sections';

const linkButton = cx(
  buttonRecipe({ intent: 'secondary', size: 'sm', shape: 'md', fullWidth: false }),
  'whitespace-nowrap no-underline',
);

const pendingSections = consoleSections.filter((section) => section.key !== 'overview');

const cell = 'px-[var(--spacing-md)] py-[var(--spacing-sm)]';

function isProductActive(product: SuiteProduct): boolean {
  return product.apps.some((app) => app.active);
}

// Only show status when at least one product is inactive: a column where every
// row says "Activo" carries no information.
const showStatus = suiteProducts.some((product) => !isProductActive(product));

interface OverviewProps {
  environment: DeploymentEnvironment;
  /** Number of emails in ADMIN_ALLOWED_EMAILS. */
  operatorCount: number;
}

function StatusLabel({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-[var(--spacing-xs)] font-bold text-text">
      <span
        aria-hidden
        className={cx('h-2 w-2 rounded-full', active ? 'bg-success' : 'bg-muted')}
      />
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}

function ProductLinks({
  product,
  isDevelopment,
}: {
  product: SuiteProduct;
  isDevelopment: boolean;
}) {
  const localApps = product.apps.filter((app) => app.surface !== 'mobile');
  return (
    <div className="flex flex-wrap gap-[var(--spacing-xs)]">
      <a
        href={`https://${product.subdomain}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkButton}
      >
        Abrir
        <span className="sr-only">
          {' '}
          {product.name} en {product.subdomain} (se abre en otra pestaña)
        </span>
      </a>
      {isDevelopment
        ? localApps.map((app) => (
            <a
              key={app.key}
              href={`http://localhost:${app.devPort}`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkButton}
            >
              Local · puerto <span className="tabular-nums">{app.devPort}</span>
              <span className="sr-only"> ({app.key}, se abre en otra pestaña)</span>
            </a>
          ))
        : null}
    </div>
  );
}

// Server component: static registry snapshot plus console status. No live data.
export function Overview({ environment, operatorCount }: OverviewProps) {
  const isDevelopment = environment === 'development';

  return (
    <>
      <section aria-labelledby="productos" className="grid min-w-0 gap-[var(--spacing-sm)]">
        <div className="grid gap-[var(--spacing-xs)]">
          <h2 id="productos" className="m-0 font-arvo text-lg font-bold leading-[1.25] text-text">
            Productos de la suite
          </h2>
          <p className="m-0 max-w-[65ch] text-sm leading-[1.45] text-muted">
            Copia del registro de apps del workspace (apps-registry.json).{' '}
            {showStatus
              ? 'El estado refleja el campo «active» del registro, no una comprobación en vivo del despliegue.'
              : 'Todos figuran como activos en el campo «active» del registro; no es una comprobación en vivo del despliegue.'}
          </p>
        </div>

        {/* Below md: stacked list so the actions stay visible without horizontal scroll. */}
        <ul className="m-0 grid list-none gap-[var(--spacing-sm)] p-0 md:hidden">
          {suiteProducts.map((product) => (
            <li
              key={product.slug}
              className="grid gap-[var(--spacing-xs)] rounded-[var(--radius-lg)] border border-border-default bg-surface p-[var(--spacing-md)] text-sm leading-[1.4]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-[var(--spacing-sm)]">
                <h3 className="m-0 text-md font-bold leading-[1.3] text-brand-dark">
                  {product.name}
                </h3>
                {showStatus ? <StatusLabel active={isProductActive(product)} /> : null}
              </div>
              <p className="m-0 break-all text-text">{product.subdomain}</p>
              <p className="m-0 text-muted">
                {product.apps.map((app) => surfaceLabel[app.surface]).join(' · ')}
              </p>
              <div className="mt-[var(--spacing-xs)]">
                <ProductLinks product={product} isDevelopment={isDevelopment} />
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden w-0 min-w-full overflow-x-auto rounded-[var(--radius-lg)] border border-border-default bg-surface md:block">
          <table className="w-full border-collapse whitespace-nowrap text-left text-sm leading-[1.4]">
            <caption className="sr-only">
              {showStatus
                ? 'Productos registrados con su subdominio, superficies, estado y enlaces'
                : 'Productos registrados con su subdominio, superficies y enlaces'}
            </caption>
            <thead>
              <tr className="border-b border-border-default text-muted">
                <th scope="col" className={cx(cell, 'font-bold')}>
                  Producto
                </th>
                <th scope="col" className={cx(cell, 'font-bold')}>
                  Subdominio
                </th>
                <th scope="col" className={cx(cell, 'font-bold')}>
                  Superficies
                </th>
                {showStatus ? (
                  <th scope="col" className={cx(cell, 'font-bold')}>
                    Estado
                  </th>
                ) : null}
                <th scope="col" className={cx(cell, 'font-bold')}>
                  Accesos
                </th>
              </tr>
            </thead>
            <tbody>
              {suiteProducts.map((product) => (
                <tr
                  key={product.slug}
                  className="border-b border-border-hairline align-middle last:border-b-0"
                >
                  <th scope="row" className={cx(cell, 'font-bold text-brand-dark')}>
                    {product.name}
                  </th>
                  <td className={cx(cell, 'text-text')}>{product.subdomain}</td>
                  <td className={cx(cell, 'text-text')}>
                    {product.apps.map((app) => surfaceLabel[app.surface]).join(' · ')}
                  </td>
                  {showStatus ? (
                    <td className={cell}>
                      <StatusLabel active={isProductActive(product)} />
                    </td>
                  ) : null}
                  <td className={cell}>
                    <ProductLinks product={product} isDevelopment={isDevelopment} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="estado-consola" className="grid gap-[var(--spacing-sm)]">
        <h2
          id="estado-consola"
          className="m-0 font-arvo text-lg font-bold leading-[1.25] text-text"
        >
          Estado de la consola
        </h2>
        <dl className="m-0 grid gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-border-default bg-surface p-[var(--spacing-md)] text-sm leading-[1.45] md:grid-cols-[180px_1fr]">
          <dt className="font-bold text-muted">Acceso</dt>
          <dd className="m-0 text-text">
            Sesión de Clerk más lista de emails autorizados (ADMIN_ALLOWED_EMAILS):{' '}
            {operatorCount === 1 ? '1 email' : `${operatorCount} emails`}.
          </dd>

          <dt className="font-bold text-muted">Datos de backend</dt>
          <dd className="m-0 text-text">
            Esta consola todavía no consulta 17s-server. Nada de lo que ves aquí es un dato en vivo.
          </dd>

          <dt className="font-bold text-muted">Secciones pendientes</dt>
          <dd className="m-0">
            <ul className="m-0 flex list-none flex-wrap gap-x-[var(--spacing-md)] gap-y-[var(--spacing-xs)] p-0">
              {pendingSections.map((section) => (
                <li key={section.key}>
                  <Link
                    href={section.href}
                    className="font-bold text-info underline underline-offset-4"
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      </section>
    </>
  );
}
