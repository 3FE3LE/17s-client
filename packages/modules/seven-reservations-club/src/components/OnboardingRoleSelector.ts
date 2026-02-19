'use client';

import { createElement, type ComponentType } from 'react';
import { Button, Paragraph, YStack } from 'tamagui';
import {
  SevenReservationsClubRoleOptions,
  type SevenReservationsClubRole,
  type SevenReservationsClubRoleSource,
  getSevenReservationsClubRoleHint,
} from '../onboarding-role';

const YStackAny = YStack as unknown as ComponentType<Record<string, unknown>>;
const ParagraphAny = Paragraph as unknown as ComponentType<Record<string, unknown>>;
const ButtonAny = Button as unknown as ComponentType<Record<string, unknown>>;

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

  const roleErrorBlock = roleError
    ? createElement(YStackAny, {
        key: 'role-error',
        gap: 8,
        children: [
          createElement(ParagraphAny, {
            key: 'role-error-text',
            margin: 0,
            color: '#ff7676',
            children: roleError,
          }),
          onRetryLoad
            ? createElement(ButtonAny, {
                key: 'role-error-retry',
                theme: 'blue',
                onPress: onRetryLoad,
                children: 'Reintentar carga de rol',
              })
            : null,
        ],
      })
    : null;

  const roleCards = createElement(YStackAny, {
    key: 'role-cards',
    gap: 12,
    children: SevenReservationsClubRoleOptions.map((option) =>
      createElement(YStackAny, {
        key: option.role,
        gap: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        children: [
          createElement(ParagraphAny, {
            key: `${option.role}-title`,
            margin: 0,
            fontWeight: '700',
            children: option.title,
          }),
          createElement(ParagraphAny, {
            key: `${option.role}-subtitle`,
            margin: 0,
            opacity: 0.8,
            children: option.subtitle,
          }),
          createElement(ButtonAny, {
            key: `${option.role}-cta`,
            theme: option.role === 'OWNER' ? 'green' : 'blue',
            onPress: () => onSelectRole(option.role),
            disabled: Boolean(isSubmittingRole),
            children: isSubmittingRole === option.role ? 'Guardando...' : option.cta,
          }),
        ],
      }),
    ),
  });

  const submitErrorBlock = submitError
    ? createElement(YStackAny, {
        key: 'submit-error',
        gap: 6,
        children: [
          createElement(ParagraphAny, {
            key: 'submit-error-text',
            margin: 0,
            color: '#ff7676',
            children: submitError,
          }),
          onClearSubmitError
            ? createElement(ButtonAny, {
                key: 'submit-error-close',
                theme: 'red',
                onPress: onClearSubmitError,
                children: 'Cerrar error y reintentar',
              })
            : null,
        ],
      })
    : null;

  return createElement(YStackAny, {
    gap: 12,
    children: [
      createElement(ParagraphAny, {
        key: 'hint',
        margin: 0,
        children: roleHint,
      }),
      roleErrorBlock,
      roleCards,
      submitErrorBlock,
    ],
  });
}
