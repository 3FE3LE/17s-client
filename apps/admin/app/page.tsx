'use client';

import { AppButton, AppFrame } from '@17suit/ui';

export default function Page() {
  return (
    <AppFrame
      appName="Admin Web"
      subtitle="Control plane para tenants, analytics, billing y feature flags."
    >
      <AppButton>Shared UI Button</AppButton>
    </AppFrame>
  );
}
