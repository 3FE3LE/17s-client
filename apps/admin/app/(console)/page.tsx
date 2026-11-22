import type { Metadata } from 'next';
import { Overview } from '@/components/overview';
import { getDeploymentEnvironment } from '@/lib/environment';
import { getOperatorAccess } from '@/lib/operator-access';

export const metadata: Metadata = {
  title: 'Resumen',
  description: 'Productos registrados en la suite 17Suit, su estado y accesos directos.',
};

export default async function OverviewPage() {
  const access = await getOperatorAccess();
  if (access.status !== 'allowed') {
    return null;
  }

  return <Overview environment={getDeploymentEnvironment()} operatorCount={access.allowlistSize} />;
}
