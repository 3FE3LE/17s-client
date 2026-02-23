'use client';

import { Text, View } from 'react-native';
import { AppButton, GapView, suitTheme } from '@17suit/ui';
import {
  SevenReservationsClubRoleOptions,
  type SevenReservationsClubRole,
  type SevenReservationsClubRoleSource,
  getSevenReservationsClubRoleHint,
} from '../onboarding-role';

export interface OnboardingRoleSelectorProps {
  role: SevenReservationsClubRole | null;
  source: SevenReservationsClubRoleSource;
  isSubmittingRole: SevenReservationsClubRole | null;
  roleError: string | null;
  submitError: string | null;
  onRetryLoad?: () => void;
  onClearSubmitError?: () => void;
  onSelectRole: (role: SevenReservationsClubRole) => void;
}

export function OnboardingRoleSelector({
  role,
  source,
  isSubmittingRole,
  roleError,
  submitError,
  onRetryLoad,
  onClearSubmitError,
  onSelectRole,
}: OnboardingRoleSelectorProps) {
  const roleHint = getSevenReservationsClubRoleHint(role, source);
  const bodyType = suitTheme.typography.styles.body;

  return (
    <GapView gap="md">
      <Text
        style={{
          color: suitTheme.colors.text,
          fontFamily: bodyType.nativeFamily,
          fontSize: bodyType.fontSize,
          lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
          letterSpacing: bodyType.letterSpacingPx,
        }}
      >
        {roleHint}
      </Text>

      {roleError ? (
        <GapView gap="sm">
          <Text
            style={{
              color: '#ff7676',
              fontFamily: bodyType.nativeFamily,
              fontSize: bodyType.fontSize,
              lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
              letterSpacing: bodyType.letterSpacingPx,
            }}
          >
            {roleError}
          </Text>
          {onRetryLoad ? (
            <AppButton onPress={onRetryLoad} variant="info">
              Reintentar carga de rol
            </AppButton>
          ) : null}
        </GapView>
      ) : null}

      <GapView gap="md">
        {SevenReservationsClubRoleOptions.map((option) => (
          <View
            key={option.role}
            style={{
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
            }}
          >
            <GapView gap="sm">
              <Text
                style={{
                  color: suitTheme.colors.text,
                  fontFamily: bodyType.nativeFamily,
                  fontSize: bodyType.fontSize,
                  lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
                  letterSpacing: bodyType.letterSpacingPx,
                  fontWeight: '700',
                }}
              >
                {option.title}
              </Text>
              <Text
                style={{
                  color: suitTheme.colors.text,
                  fontFamily: bodyType.nativeFamily,
                  fontSize: bodyType.fontSize,
                  lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
                  letterSpacing: bodyType.letterSpacingPx,
                  opacity: 0.8,
                }}
              >
                {option.subtitle}
              </Text>
              <AppButton
                variant={option.role === 'OWNER' ? 'success' : 'primary'}
                onPress={() => onSelectRole(option.role)}
                disabled={Boolean(isSubmittingRole)}
              >
                {isSubmittingRole === option.role ? 'Guardando...' : option.cta}
              </AppButton>
            </GapView>
          </View>
        ))}
      </GapView>

      {submitError ? (
        <GapView gap="sm">
          <Text
            style={{
              color: '#ff7676',
              fontFamily: bodyType.nativeFamily,
              fontSize: bodyType.fontSize,
              lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
              letterSpacing: bodyType.letterSpacingPx,
            }}
          >
            {submitError}
          </Text>
          {onClearSubmitError ? (
            <AppButton onPress={onClearSubmitError} variant="destructive">
              Cerrar error y reintentar
            </AppButton>
          ) : null}
        </GapView>
      ) : null}
    </GapView>
  );
}
