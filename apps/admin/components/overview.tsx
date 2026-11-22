import { buttonRecipe, cx } from '@17suit/ui';
import Link from 'next/link';
import { environmentLabel, type DeploymentEnvironment } from '@/lib/environment';
import { suiteProducts, surfaceLabel } from '@/lib/products';
import { consoleSections } from '@/lib/sections';

const linkButton = cx(
  buttonRecipe({ intent: 'secondary', size: 'sm', shape: 'md', fullWidth: false }),
  'whitespace-nowrap no-underline',
);

const pendingSections = consoleSections.filter((section) => section.key !== 'overview');

interface OverviewProps {
  environment: DeploymentEnvironment;
  /** Number of emails in ADMIN_ALLOWED_EMAILS. */
  operatorCount: number;
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
            Copia del registro de apps del workspace (apps-registry.json). El estado refleja el
            campo «active» del registro, no una comprobación en vivo del despliegue.
          </p>
        </div>
        <div className="w-0 min-w-full overflow-x-auto rounded-[var(--radius-lg)] border border-border-default bg-surface">
          <table className="w-full border-collapse whitespace-nowrap text-left text-sm leading-[1.4] tabular-nums">
            <caption className="sr-only">
              Productos registrados con su subdominio, superficies, estado y enlaces
            </caption>
            <thead>
              <tr className="border-b border-border-default text-muted">
                <th scope="col" className="px-[var(--spacing-md)] py-[var(--spacing-sm)] font-bold">
                  Producto
                </th>
                <th scope="col" className="px-[var(--spacing-md)] py-[var(--spacing-sm)] font-bold">
                  Subdominio
                </th>
                <th scope="col" className="px-[var(--spacing-md)] py-[var(--spacing-sm)] font-bold">
                  Superficies
                </th>
                <th scope="col" className="px-[var(--spacing-md)] py-[var(--spacing-sm)] font-bold">
                  Estado
                </th>
                <th scope="col" className="px-[var(--spacing-md)] py-[var(--spacing-sm)] font-bold">
                  Accesos
                </th>
              </tr>
            </thead>
            <tbody>
              {suiteProducts.map((product) => {
                const isActive = product.apps.some((app) => app.active);
                const localApps = product.apps.filter((app) => app.surface !== 'mobile');
                return (
                  <tr
                    key={product.slug}
                    className="border-b border-border-hairline align-middle last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="px-[var(--spacing-md)] py-[var(--spacing-sm)] font-bold text-brand-dark"
                    >
                      {product.name}
                    </th>
                    <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-text">
                      {product.subdomain}
                    </td>
                    <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-text">
                      {product.apps.map((app) => surfaceLabel[app.surface]).join(' · ')}
                    </td>
                    <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)]">
                      <span
                        className={cx(
                          'inline-flex items-center gap-[var(--spacing-xs)] font-bold',
                          isActive ? 'text-action-primary' : 'text-muted',
                        )}
                      >
                        <span
                          aria-hidden
                          className={cx(
                            'h-2 w-2 rounded-full',
                            isActive ? 'bg-action-primary' : 'bg-muted',
                          )}
                        />
                        {isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)]">
                      <div className="flex gap-[var(--spacing-xs)]">
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
                                Local :{app.devPort}
                                <span className="sr-only">
                                  {' '}
                                  ({app.key}, se abre en otra pestaña)
                                </span>
                              </a>
                            ))
                          : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
          <dt className="font-bold text-muted">Entorno</dt>
          <dd className="m-0 text-text">{environmentLabel[environment]}</dd>

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
