import { titleRecipe } from '@17suit/design-system';

export type AppTitleLevel = 'h1' | 'h2' | 'h3' | 'p';

export interface AppTitleProps {
  text: string;
  className?: string;
  /** Semantic element. Visual style is the same; pick the level that fits the document outline. */
  as?: AppTitleLevel;
}

/** Web renderer of the shared title contract (subtitle1 + vertical rhythm). */
export function AppTitle({ text, className, as: Tag = 'p' }: AppTitleProps) {
  return <Tag className={titleRecipe({ platform: 'web', className })}>{text}</Tag>;
}
