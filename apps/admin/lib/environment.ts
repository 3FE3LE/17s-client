// Deployment environment shown in the console header. `VERCEL_ENV` is the source
// of truth on Vercel; locally it is unset and we fall back to `NODE_ENV`.

export type DeploymentEnvironment = 'production' | 'preview' | 'development';

export const environmentLabel: Record<DeploymentEnvironment, string> = {
  production: 'Producción',
  preview: 'Pruebas',
  development: 'Desarrollo',
};

export function getDeploymentEnvironment(): DeploymentEnvironment {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === 'production' || vercelEnv === 'preview' || vercelEnv === 'development') {
    return vercelEnv;
  }
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}
