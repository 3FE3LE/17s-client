'use client';

import { AppBadge } from '@17suit/ui';
import { environmentLabel, type DeploymentEnvironment } from '@/lib/environment';

const badgeVariant = {
  production: 'destructive',
  preview: 'warning',
  development: 'neutral',
} as const satisfies Record<DeploymentEnvironment, string>;

export function EnvironmentBadge({ environment }: { environment: DeploymentEnvironment }) {
  return (
    <AppBadge variant={badgeVariant[environment]} rounded={false}>
      Entorno de {environmentLabel[environment].toLowerCase()}
    </AppBadge>
  );
}
