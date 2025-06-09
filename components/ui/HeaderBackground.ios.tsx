import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HeaderBackground() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const shadowColor = useThemeColor({}, 'cardShadow');

  return (
    <View style={styles.container}>
      <BlurView
        // Usiamo il tint appropriato per il tema corrente
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        intensity={95}
        style={StyleSheet.absoluteFill}
      />
      <View 
        style={[
          styles.overlay, 
          { 
            backgroundColor: `${backgroundColor}E6`, // Aggiungiamo trasparenza per il blur
            borderBottomColor: borderColor,
            shadowColor,
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
