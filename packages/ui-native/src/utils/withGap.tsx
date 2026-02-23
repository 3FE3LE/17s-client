import type { ReactNode } from 'react';
import { Children } from 'react';
import { View } from 'react-native';

export function withGap(
  children: ReactNode,
  gap: number,
  axis: 'row' | 'column' = 'column',
  wrapperFlex?: number,
) {
  const items = Children.toArray(children);
  return items.map((child, index) => {
    const isLast = index === items.length - 1;
    const style =
      axis === 'row'
        ? { marginRight: isLast ? 0 : gap, flex: wrapperFlex }
        : { marginBottom: isLast ? 0 : gap };
    return (
      <View key={index} style={style}>
        {child}
      </View>
    );
  });
}
