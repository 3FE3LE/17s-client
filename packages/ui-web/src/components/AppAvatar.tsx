import type { CSSProperties, ImgHTMLAttributes } from 'react';
import { useMemo } from 'react';
import { useAppTheme } from '../theme/theme-context';

export interface AppAvatarProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'style'
> {
  src?: string;
  alt?: string;
  name?: string;
  size?: number;
  shape?: 'circle' | 'rounded';
  style?: CSSProperties;
}

function initialsFromName(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return tokens.map((token) => token[0]?.toUpperCase() ?? '').join('') || 'U';
}

export function AppAvatar({
  src,
  alt,
  name,
  size = 40,
  shape = 'circle',
  style,
  ...rest
}: AppAvatarProps) {
  const { theme } = useAppTheme();
  const subtitleType = theme.typography.styles.subtitle2;
  const initials = useMemo(() => initialsFromName(name ?? alt ?? 'User'), [alt, name]);
  const borderRadius = shape === 'circle' ? theme.borderRadius.full : theme.borderRadius.md;

  if (src) {
    return (
      <img
        {...rest}
        src={src}
        alt={alt ?? name ?? 'Avatar'}
        style={{
          width: size,
          height: size,
          borderRadius,
          objectFit: 'cover',
          border: `1px solid ${theme.grayscale[3]}`,
          ...style,
        }}
      />
    );
  }

  return (
    <span
      aria-label={alt ?? name ?? 'Avatar'}
      style={{
        width: size,
        height: size,
        borderRadius,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${theme.grayscale[3]}`,
        backgroundColor: theme.grayscale[4],
        color: theme.colors.brandDark,
        fontFamily: subtitleType.webFamily,
        fontWeight: subtitleType.fontWeight,
        fontSize: Math.max(12, Math.floor(size * 0.38)),
        lineHeight: 1,
        letterSpacing: subtitleType.letterSpacingEm,
        ...style,
      }}
    >
      {initials}
    </span>
  );
}
