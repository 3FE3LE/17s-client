import { Feather } from '@expo/vector-icons';
import { AppBottomTabBar as SharedAppBottomTabBar } from './shared';
import type { AppBottomTabBarProps, AppBottomTabItem, AppBottomTabIconName } from './shared';
import { suitTheme } from '../../theme';

function resolveIconName(iconName: AppBottomTabIconName): 'home' | 'user' {
  return iconName === 'profile' ? 'user' : 'home';
}

function withResolvedIcons(items: AppBottomTabItem[]): AppBottomTabItem[] {
  return items.map((item) => {
    if (item.icon || !item.iconName) {
      return item;
    }

    return {
      ...item,
      icon: (
        <Feather
          name={resolveIconName(item.iconName)}
          size={20}
          color={item.isActive ? suitTheme.colors.brandDark : suitTheme.colors.brandLight}
        />
      ),
    };
  });
}

export function AppBottomTabBar(props: AppBottomTabBarProps) {
  return <SharedAppBottomTabBar {...props} items={withResolvedIcons(props.items)} />;
}
