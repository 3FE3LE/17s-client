import { useTranslation } from '@17suit/i18n/react';
import { Feather } from '@expo/vector-icons';
import {
  useSetCurrentUserRoleMutation,
  type SevenReservationsClubRole,
} from '@17suit/module-seven-reservations-club/client';
import { AppFrame, AppSpinner, GapView, useAppTheme } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FormError } from '../../components/form-field';
import { humanizeError } from '../../lib/error-messages';

const ROLE_OPTIONS: ReadonlyArray<{
  role: SevenReservationsClubRole;
  titleKey: string;
  descriptionKey: string;
  icon: 'calendar' | 'home';
}> = [
  {
    role: 'PLAYER',
    titleKey: 'role.player.title',
    descriptionKey: 'role.player.description',
    icon: 'calendar',
  },
  {
    role: 'OWNER',
    titleKey: 'role.owner.title',
    descriptionKey: 'role.owner.description',
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
  const { t } = useTranslation('mobile');
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
      setSubmitError(humanizeError(error, t, 'save'));
    } finally {
      setSubmittingRole(null);
    }
  };

  return (
    <AppFrame appName={t('role.title')} subtitle={t('role.subtitle')}>
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
              accessibilityLabel={`${t(option.titleKey)}. ${t(option.descriptionKey)}`}
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
                  {t(option.titleKey)}
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
                  {t(option.descriptionKey)}
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
