import {
  useSetCurrentUserRoleMutation,
  useCurrentUserRoleQuery,
  OnboardingRoleSelector,
} from '@17suit/module-seven-reservations-club/client';
import { AppFrame, GapView } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function OnboardingRoleScreen() {
  const router = useRouter();
  const { user } = useUser();
  const {
    role: currentRole,
    source,
    error: roleError,
    refetch,
  } = useCurrentUserRoleQuery({
    userId: user?.id,
    enabled: Boolean(user?.id),
  });
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const [isSubmittingRole, setIsSubmittingRole] = useState<'OWNER' | 'PLAYER' | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSetRole = async (role: 'OWNER' | 'PLAYER') => {
    setSubmitError(null);
    setIsSubmittingRole(role);

    try {
      await setRoleMutation.mutateAsync(role);
      router.replace('/home');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo guardar el rol. Intenta nuevamente.';
      setSubmitError(message);
      Alert.alert('Onboarding', message);
    } finally {
      setIsSubmittingRole(null);
    }
  };

  return (
    <AppFrame
      appName="Seven Reservations Club"
      subtitle="Elige tu perfil inicial para personalizar tu experiencia"
    >
      <GapView gap="md">
        <OnboardingRoleSelector
          role={currentRole}
          source={source}
          isSubmittingRole={isSubmittingRole}
          roleError={roleError}
          submitError={submitError}
          onRetryLoad={() => {
            void refetch();
          }}
          onClearSubmitError={() => setSubmitError(null)}
          onSelectRole={(role) => {
            void handleSetRole(role);
          }}
        />
      </GapView>
    </AppFrame>
  );
}
