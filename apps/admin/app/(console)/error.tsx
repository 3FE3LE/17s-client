'use client';

import { AppAlert, AppButton } from '@17suit/ui';

interface ConsoleErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ConsoleError({ error, reset }: ConsoleErrorProps) {
  return (
    <AppAlert
      variant="destructive"
      title="No se pudo cargar esta sección"
      description={
        error.digest
          ? `Ocurrió un error en el servidor. Vuelve a intentarlo; si se repite, comparte la referencia ${error.digest} con el equipo técnico.`
          : 'Ocurrió un error inesperado. Vuelve a intentarlo; si se repite, recarga la página.'
      }
      action={
        <AppButton variant="neutral" compact fullWidth={false} onPress={reset}>
          Reintentar
        </AppButton>
      }
    />
  );
}
