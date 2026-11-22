// Deployment environment shown in the console sidebar. `VERCEL_ENV` is the source
// of truth on Vercel; locally it is unset and we fall back to `NODE_ENV`.
//
// Every environment-dependent colour and link label lives here so the badge, the
// production rail and the product links can never disagree.

export type DeploymentEnvironment = 'production' | 'preview' | 'development';

// "Pruebas" is the operator-facing name for Vercel's Preview environment.
export const environmentLabel: Record<DeploymentEnvironment, string> = {
  production: 'Producción',
  preview: 'Pruebas',
  development: 'Desarrollo',
};

export type EnvironmentTone = 'destructive' | 'warning' | 'neutral';

/** AppBadge variant / colour family per environment. Production is always destructive. */
export const environmentTone: Record<DeploymentEnvironment, EnvironmentTone> = {
  production: 'destructive',
  preview: 'warning',
  development: 'neutral',
};

export function getDeploymentEnvironment(): DeploymentEnvironment {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === 'production' || vercelEnv === 'preview' || vercelEnv === 'development') {
    return vercelEnv;
  }
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

export interface ProductionLinkCopy {
  /** Visible button label. */
  label: string;
  /**
   * True when the link leaves a non-production console for production. The UI
   * marks it with a destructive dot so nobody crosses environments silently.
   */
  crossesIntoProduction: boolean;
}

/**
 * Copy for a link to a product's public subdomain, which is always production.
 * From production it is a plain "Abrir"; from any other environment the label
 * names the destination.
 */
export function getProductionLinkCopy(environment: DeploymentEnvironment): ProductionLinkCopy {
  if (environment === 'production') {
    return { label: 'Abrir', crossesIntoProduction: false };
  }
  return { label: 'Abrir en producción', crossesIntoProduction: true };
}
