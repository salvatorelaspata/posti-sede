import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Location } from '@/types';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';


const locations: Location[] = [
  { id: 'rm', name: 'Roma', image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20rome%20sunset&aspect=16:9' },

  { id: 'mi', name: 'Milano', image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20milan%20business%20district&aspect=16:9' },
  { id: 'bg', name: 'Bergamo', image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20bergamo%20with%20mountains&aspect=16:9' },
  { id: 'to', name: 'Torino', image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20torino%20with%20mountains&aspect=16:9' },
  { id: 'pa', name: 'Palermo', image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20palermo%20with%20mountains&aspect=16:9' },
];
export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const router = useRouter()
  return (
    <ThemedSafeAreaView style={styles.locationContainer}>
      <ThemedText type="title" style={styles.title}>Seleziona la sede</ThemedText>
      <ThemedView style={styles.locationGrid}>
        <FlatList
          data={locations}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={styles.locationCard}
              onPress={() => {
                setSelectedLocation(item)
                router.push(`/(app)/(tabs)?location=${item.name}`)
              }}
            >
              <ThemedView style={styles.locationImageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.locationImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.locationGradient}
                />
                <ThemedText style={styles.locationName}>{item.name}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          )}
        />
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    flex: 1,

  },
  title: {
    textAlign: 'center',
    marginVertical: 8
  },
  locationGrid: {
    marginTop: 16,
    flexDirection: 'column',
    flex: 1,
  },
  locationCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 16
  },
  locationImageContainer: {
    height: 200,
    position: 'relative',

  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  locationGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  locationName: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
