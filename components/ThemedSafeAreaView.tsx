import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ISafeAreaViewProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSafeAreaView({ style, lightColor, darkColor, ...otherProps }: ISafeAreaViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
