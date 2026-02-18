import type { PropsWithChildren } from 'react';
import type { SuitTheme } from '../../theme';

export interface AppFrameProps extends PropsWithChildren {
  appName: string;
  subtitle?: string;
}

export const APP_FRAME_BADGE = '17SUIT';

export function getAppFrameTypography(theme: SuitTheme) {
  const overlineType = theme.typography.styles.overline;
  const bodyType = theme.typography.styles.body;

  return {
    overlineType,
    bodyType,
    overlineLineHeight: Math.round(overlineType.fontSize * overlineType.lineHeightRecommended),
    bodyLineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
  };
}
