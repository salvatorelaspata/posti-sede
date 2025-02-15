import React, { forwardRef } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type IScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

// Utilizza forwardRef per inoltrare il ref al componente ScrollView interno
const ThemedScrollView = forwardRef<ScrollView, IScrollViewProps>(
  ({ style, lightColor, darkColor, ...otherProps }, ref) => {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
      <ScrollView
        ref={ref}
        style={[{ backgroundColor }, style]}
        contentContainerStyle={styles.container}
        {...otherProps}
      >
        {otherProps.children}
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export { ThemedScrollView };
