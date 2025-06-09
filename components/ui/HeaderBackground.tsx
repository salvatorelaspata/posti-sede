import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HeaderBackground() {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const shadowColor = useThemeColor({}, 'cardShadow');

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor,
          borderBottomColor: borderColor,
          shadowColor,
        }
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
