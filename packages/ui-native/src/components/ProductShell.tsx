import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

interface ProductShellProps extends PropsWithChildren {
  productName: string;
  subtitle: string;
}

export function ProductShell({ productName, subtitle, children }: ProductShellProps) {
  const { theme } = useAppTheme();
  const overlineType = theme.typography.styles.overline;
  const titleType = theme.typography.styles.subtitle1;
  const bodyType = theme.typography.styles.body;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 64,
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.background,
      }}
    >
      <View>
        <Text
          style={{
            color: theme.colors.brandSecondary,
            fontFamily: overlineType.nativeFamily,
            fontSize: overlineType.fontSize,
            lineHeight: Math.round(overlineType.fontSize * overlineType.lineHeightRecommended),
            letterSpacing: overlineType.letterSpacingPx,
          }}
        >
          17SUIT PRODUCT
        </Text>
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: titleType.nativeFamily,
            fontSize: titleType.fontSize,
            lineHeight: Math.round(titleType.fontSize * titleType.lineHeightRecommended),
            letterSpacing: titleType.letterSpacingPx,
          }}
        >
          {productName}
        </Text>
        <Text
          style={{
            color: theme.colors.muted,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
            lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
            letterSpacing: bodyType.letterSpacingPx,
          }}
        >
          {subtitle}
        </Text>
        <View style={{ marginTop: theme.spacing.xl }}>{children}</View>
      </View>
    </View>
  );
}
