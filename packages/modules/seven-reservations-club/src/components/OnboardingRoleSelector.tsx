'use client';

import type { CSSProperties } from 'react';
import { AppButton, suitTheme } from '@17suit/ui';
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

const paragraphStyle: CSSProperties = {
  margin: 0,
  fontFamily: suitTheme.typography.styles.body.webFamily,
  fontSize: suitTheme.typography.styles.body.fontSize,
  lineHeight:
    suitTheme.typography.styles.body.fontSize *
    suitTheme.typography.styles.body.lineHeightRecommended,
  letterSpacing: suitTheme.typography.styles.body.letterSpacingEm,
  color: suitTheme.colors.text,
};

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

  return (
    <div style={{ gap: 12, display: 'flex', flexDirection: 'column' }}>
      <p style={paragraphStyle}>{roleHint}</p>

      {roleError ? (
        <div style={{ gap: 8, display: 'flex', flexDirection: 'column' }}>
          <p style={{ ...paragraphStyle, color: '#ff7676' }}>{roleError}</p>
          {onRetryLoad ? (
            <AppButton onPress={onRetryLoad} variant="info">
              Reintentar carga de rol
            </AppButton>
          ) : null}
        </div>
      ) : null}

      <div style={{ gap: 12, display: 'flex', flexDirection: 'column' }}>
        {SevenReservationsClubRoleOptions.map((option) => (
          <div
            key={option.role}
            style={{
              gap: 8,
              padding: 16,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p style={{ ...paragraphStyle, fontWeight: 700 }}>{option.title}</p>
            <p style={{ ...paragraphStyle, opacity: 0.8 }}>{option.subtitle}</p>
            <AppButton
              variant={option.role === 'OWNER' ? 'success' : 'primary'}
              onPress={() => onSelectRole(option.role)}
              disabled={Boolean(isSubmittingRole)}
            >
              {isSubmittingRole === option.role ? 'Guardando...' : option.cta}
            </AppButton>
          </div>
        ))}
      </div>

      {submitError ? (
        <div style={{ gap: 6, display: 'flex', flexDirection: 'column' }}>
          <p style={{ ...paragraphStyle, color: '#ff7676' }}>{submitError}</p>
          {onClearSubmitError ? (
            <AppButton onPress={onClearSubmitError} variant="destructive">
              Cerrar error y reintentar
            </AppButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
