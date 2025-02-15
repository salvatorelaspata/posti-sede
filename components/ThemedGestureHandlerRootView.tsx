
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GestureHandlerRootViewProps } from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerRootView';
export type IGestureHandlerRootViewProps = GestureHandlerRootViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedGestureHandlerRootView({ style, lightColor, darkColor, ...otherProps }: IGestureHandlerRootViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <GestureHandlerRootView style={[{ backgroundColor }, style]} {...otherProps} />;
}
