'use client';

import { AppBadge } from '@17suit/ui';
import { environmentLabel, environmentTone, type DeploymentEnvironment } from '@/lib/environment';

export function EnvironmentBadge({ environment }: { environment: DeploymentEnvironment }) {
  return (
    <AppBadge variant={environmentTone[environment]} rounded={false}>
      Entorno de {environmentLabel[environment].toLowerCase()}
    </AppBadge>
  );
}
