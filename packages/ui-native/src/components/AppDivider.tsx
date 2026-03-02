import { View } from 'react-native';

export interface AppDividerProps {
  marginY?: number;
}

export function AppDivider({ marginY }: AppDividerProps) {
  return (
    <View
      className="h-px w-full bg-surface"
      style={{
        marginTop: marginY ?? 4,
        marginBottom: marginY ?? 4,
      }}
    />
  );
}
