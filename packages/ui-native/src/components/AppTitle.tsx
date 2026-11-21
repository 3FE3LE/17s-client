import { titleRecipe } from '@17suit/design-system';
import { Text } from 'react-native';

export interface AppTitleProps {
  text: string;
  className?: string;
}

/** Native renderer of the shared title contract (subtitle1 + vertical rhythm). */
export function AppTitle({ text, className }: AppTitleProps) {
  return <Text className={titleRecipe({ platform: 'native', className })}>{text}</Text>;
}
