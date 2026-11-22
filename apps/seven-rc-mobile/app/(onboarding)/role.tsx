import { Feather } from '@expo/vector-icons';
import {
  useSetCurrentUserRoleMutation,
  type SevenReservationsClubRole,
} from '@17suit/module-seven-reservations-club/client';
import { AppFrame, AppSpinner, GapView, useAppTheme } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FormError } from '../../components/form-field';
import { humanizeError } from '../../lib/error-messages';

const ROLE_OPTIONS: ReadonlyArray<{
  role: SevenReservationsClubRole;
  title: string;
  description: string;
  icon: 'calendar' | 'home';
}> = [
  {
    role: 'PLAYER',
    title: 'Quiero reservar canchas',
    description: 'Busca complejos, reserva tu horario y sigue el estado de tus reservas.',
    icon: 'calendar',
  },
  {
    role: 'OWNER',
    title: 'Administro un complejo',
    description: 'Publica tus canchas, define horarios y confirma las reservas que llegan.',
    icon: 'home',
  },
];

/**
 * Role picker rendered in-app (instead of the module's `OnboardingRoleSelector`)
 * so the copy is human and the cards meet native touch/a11y rules. Persistence
 * still goes through the module's `useSetCurrentUserRoleMutation`.
 */
export default function OnboardingRoleScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const [submittingRole, setSubmittingRole] = useState<SevenReservationsClubRole | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const titleType = theme.typography.styles.subtitle2;
  const bodyType = theme.typography.styles.body;

  const handleSetRole = async (role: SevenReservationsClubRole) => {
    setSubmitError(null);
    setSubmittingRole(role);
    try {
      await setRoleMutation.mutateAsync(role);
      router.replace('/home');
    } catch (error) {
      setSubmitError(humanizeError(error, 'save'));
    } finally {
      setSubmittingRole(null);
    }
  };

  return (
    <AppFrame appName="¿Cómo vas a usar la app?" subtitle="Elige una opción para empezar.">
      <GapView gap="md">
        {ROLE_OPTIONS.map((option) => {
          const isSubmitting = submittingRole === option.role;
          return (
            <Pressable
              key={option.role}
              onPress={() => {
                void handleSetRole(option.role);
              }}
              disabled={submittingRole !== null}
              accessibilityRole="button"
              accessibilityLabel={`${option.title}. ${option.description}`}
              accessibilityState={{ disabled: submittingRole !== null, busy: isSubmitting }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.md,
                minHeight: 88,
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius.lg,
                borderWidth: 1,
                borderColor: isSubmitting ? theme.colors.brandPrimary : theme.grayscale[3],
                backgroundColor: theme.colors.surface,
                opacity: submittingRole !== null && !isSubmitting ? 0.6 : pressed ? 0.85 : 1,
              })}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: theme.borderRadius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.background,
                }}
              >
                <Feather name={option.icon} size={20} color={theme.colors.text} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Text
                  style={{
                    color: theme.colors.text,
                    fontFamily: titleType.nativeFamily,
                    fontSize: titleType.fontSize,
                    lineHeight: Math.round(titleType.fontSize * titleType.lineHeightRecommended),
                    letterSpacing: titleType.letterSpacingPx,
                  }}
                >
                  {option.title}
                </Text>
                <Text
                  style={{
                    color: theme.colors.muted,
                    fontFamily: bodyType.nativeFamily,
                    fontSize: bodyType.fontSize,
                    lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
                    letterSpacing: bodyType.letterSpacingPx,
                  }}
                >
                  {option.description}
                </Text>
              </View>
              {isSubmitting ? (
                <AppSpinner size={20} />
              ) : (
                <Feather name="chevron-right" size={20} color={theme.colors.muted} />
              )}
            </Pressable>
          );
        })}
        <FormError message={submitError} />
      </GapView>
    </AppFrame>
  );
}
