import { titleRecipe } from '@17suit/design-system';

export interface AppTitleProps {
  text: string;
  className?: string;
}

/** Web renderer of the shared title contract (subtitle1 + vertical rhythm). */
export function AppTitle({ text, className }: AppTitleProps) {
  return <p className={titleRecipe({ platform: 'web', className })}>{text}</p>;
}
