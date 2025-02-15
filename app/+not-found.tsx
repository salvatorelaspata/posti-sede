// create 404 page

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Image, StyleSheet } from 'react-native';

import { useRouter } from 'expo-router';

export default function NotFound() {
  const router = useRouter();
  const image = require('@/assets/404.png')
  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title'>404</ThemedText>
      <ThemedText type='default'>Page Not Found</ThemedText>
      <Image
        source={image}
        alt='404'
        style={styles.image} />
      {/* go to home */}
      <Button title='Go to Home' onPress={() => router.push('/')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 300,
    height: 300,
  }
})