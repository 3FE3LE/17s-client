import { useAppTheme } from '../theme/theme-context';

export type AppTitleLevel = 'h1' | 'h2' | 'h3' | 'p';

export interface AppTitleProps {
  text: string;
  /** Semantic element. Visual style is the same; pick the level that fits the document outline. */
  as?: AppTitleLevel;
}

export function AppTitle({ text, as: Tag = 'p' }: AppTitleProps) {
  const { theme } = useAppTheme();
  const titleType = theme.typography.styles.subtitle1;
  return (
    <Tag
      // Color comes from the CSS token so it follows the resolved light/dark class,
      // not the JS theme (which can disagree with the DOM during SSR/hydration).
      className="text-text"
      style={{
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        fontSize: titleType.fontSize,
        fontFamily: titleType.webFamily,
        lineHeight: titleType.lineHeightRecommended,
        letterSpacing: titleType.letterSpacingEm,
        fontWeight: titleType.fontWeight,
      }}
    >
      {text}
    </Tag>
  );
}
