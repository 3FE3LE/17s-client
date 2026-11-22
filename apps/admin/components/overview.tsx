import { buttonRecipe, cx } from '@17suit/ui';
import { getProductionLinkCopy, type DeploymentEnvironment } from '@/lib/environment';
import {
  CONSOLE_PRODUCT_SLUG,
  REGISTRY_SNAPSHOT_DATE,
  formatSnapshotDate,
  suiteProducts,
  surfaceLabel,
  type SuiteProduct,
} from '@/lib/products';

const linkButton = cx(
  buttonRecipe({ intent: 'secondary', size: 'sm', shape: 'md', fullWidth: false }),
  'gap-[var(--spacing-xs)] whitespace-nowrap no-underline',
);

// Data cells (subdomains, ports, counts) use the system UI sans with tabular
// figures so values align and scan; Arvo stays on headings, Zilla on prose.
const dataFace = 'font-sans tabular-nums';

const cell = 'px-[var(--spacing-md)] py-[6px]';

const snapshotDate = formatSnapshotDate(REGISTRY_SNAPSHOT_DATE);

function isProductActive(product: SuiteProduct): boolean {
  return product.apps.some((app) => app.active);
}

function isThisConsole(product: SuiteProduct): boolean {
  return product.slug === CONSOLE_PRODUCT_SLUG;
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
  environment,
}: {
  product: SuiteProduct;
  environment: DeploymentEnvironment;
}) {
  if (isThisConsole(product)) {
    // Linking the console to itself is a dead loop; name it instead.
    return <span className="text-muted">Esta consola</span>;
  }

  const { label, crossesIntoProduction } = getProductionLinkCopy(environment);
  const localApps =
    environment === 'development' ? product.apps.filter((app) => app.surface !== 'mobile') : [];

  return (
    <div className="flex flex-wrap gap-[var(--spacing-xs)]">
      {localApps.map((app) => (
        <a
          key={app.key}
          href={`http://localhost:${app.devPort}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkButton}
        >
          Local · puerto <span className={dataFace}>{app.devPort}</span>
          <span className="sr-only"> ({app.key}, se abre en otra pestaña)</span>
        </a>
      ))}
      <a
        href={`https://${product.subdomain}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkButton}
      >
        {crossesIntoProduction ? (
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-destructive" />
        ) : null}
        {label}
        <span className="sr-only">
          {' '}
          {product.name} en {product.subdomain} (se abre en otra pestaña)
        </span>
      </a>
    </div>
  );
}

// Server component: static registry snapshot plus console status. No live data.
export function Overview({ environment, operatorCount }: OverviewProps) {
  return (
    <>
      <section aria-labelledby="productos" className="grid min-w-0 gap-[var(--spacing-sm)]">
        <div className="grid gap-[var(--spacing-xs)]">
          <h2 id="productos" className="m-0 font-arvo text-lg font-bold leading-[1.25] text-text">
            Productos de la suite
          </h2>
          {/* Source: hand-synced copy of apps-registry.json (lib/products.ts). */}
          <p className="m-0 max-w-[65ch] text-pretty text-sm leading-[1.45] text-muted">
            Lista mantenida a mano, revisada el{' '}
            <time dateTime={REGISTRY_SNAPSHOT_DATE}>{snapshotDate}</time>.{' '}
            {showStatus
              ? 'El estado indica si el producto está dado de alta, no si su despliegue responde ahora.'
              : 'Todos figuran como activos; no es una comprobación en vivo del despliegue.'}
          </p>
        </div>

        {/* Below md: stacked list so the actions stay visible without horizontal scroll. */}
        <ul className="m-0 grid list-none gap-[var(--spacing-sm)] p-0 md:hidden">
          {suiteProducts.map((product) => (
            <li
              key={product.slug}
              className="grid gap-[var(--spacing-xs)] rounded-[var(--radius-lg)] border border-border-strong bg-surface p-[var(--spacing-md)] text-sm leading-[1.4]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-[var(--spacing-sm)]">
                <h3 className="m-0 text-md font-bold leading-[1.3] text-brand-dark">
                  {product.name}
                </h3>
                {showStatus ? <StatusLabel active={isProductActive(product)} /> : null}
              </div>
              <p className={cx('m-0 break-all text-text', dataFace)}>{product.subdomain}</p>
              <p className="m-0 text-muted">
                {product.apps.map((app) => surfaceLabel[app.surface]).join(' · ')}
              </p>
              <div className="mt-[var(--spacing-xs)]">
                <ProductLinks product={product} environment={environment} />
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden w-0 min-w-full overflow-x-auto rounded-[var(--radius-lg)] border border-border-strong bg-surface md:block">
          <table className="w-full border-collapse whitespace-nowrap text-left text-sm leading-[1.35]">
            <caption className="sr-only">
              {showStatus
                ? 'Productos registrados con su subdominio, superficies, estado y enlaces'
                : 'Productos registrados con su subdominio, superficies y enlaces'}
            </caption>
            <thead>
              <tr className="border-b border-border-emphasis bg-background text-muted">
                <th scope="col" className={cx(cell, 'py-[var(--spacing-sm)] font-bold')}>
                  Producto
                </th>
                <th scope="col" className={cx(cell, 'py-[var(--spacing-sm)] font-bold')}>
                  Subdominio
                </th>
                <th scope="col" className={cx(cell, 'py-[var(--spacing-sm)] font-bold')}>
                  Superficies
                </th>
                {showStatus ? (
                  <th scope="col" className={cx(cell, 'py-[var(--spacing-sm)] font-bold')}>
                    Estado
                  </th>
                ) : null}
                <th scope="col" className={cx(cell, 'py-[var(--spacing-sm)] font-bold')}>
                  Accesos
                </th>
              </tr>
            </thead>
            <tbody>
              {suiteProducts.map((product) => (
                <tr
                  key={product.slug}
                  className="border-b border-border-default align-middle last:border-b-0"
                >
                  <th scope="row" className={cx(cell, 'font-bold text-brand-dark')}>
                    {product.name}
                  </th>
                  <td className={cx(cell, dataFace, 'text-text')}>{product.subdomain}</td>
                  <td className={cx(cell, 'text-text')}>
                    {product.apps.map((app) => surfaceLabel[app.surface]).join(' · ')}
                  </td>
                  {showStatus ? (
                    <td className={cell}>
                      <StatusLabel active={isProductActive(product)} />
                    </td>
                  ) : null}
                  <td className={cell}>
                    <ProductLinks product={product} environment={environment} />
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
        <dl className="m-0 grid gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-border-strong bg-surface p-[var(--spacing-md)] text-sm leading-[1.45] md:grid-cols-[180px_1fr]">
          {/* Access = Clerk session + ADMIN_ALLOWED_EMAILS (lib/operator-access.ts). */}
          <dt className="font-bold text-muted">Acceso</dt>
          <dd className="m-0 text-text">
            Solo entran las cuentas con un email verificado de la lista de operadores autorizados:{' '}
            <span className={cx('font-bold', dataFace)}>{operatorCount}</span>{' '}
            {operatorCount === 1 ? 'email' : 'emails'}.
          </dd>

          {/* No 17s-server reads yet. */}
          <dt className="font-bold text-muted">Datos</dt>
          <dd className="m-0 text-text">
            La consola todavía no está conectada a la plataforma. Nada de lo que ves aquí es un dato
            en vivo.
          </dd>
        </dl>
      </section>
    </>
  );
}
