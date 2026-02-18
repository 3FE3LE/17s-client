import { createElement, type ComponentType } from 'react';
import { YStack } from 'tamagui';
import { suitTheme } from '../../theme';

const YStackAny = YStack as unknown as ComponentType<Record<string, unknown>>;

export interface AppDividerProps {
  marginY?: number;
}

export function AppDivider({ marginY = suitTheme.spacing.xs }: AppDividerProps) {
  return createElement(YStackAny, {
    width: '100%',
    height: 1,
    marginTop: marginY,
    marginBottom: marginY,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  });
}
