import React, { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useTenantStore } from '@/store/tenant-store';
import { useAppStore } from '@/store/app-store';

export default function App() {
  const router = useRouter()
  const { user, tenant } = useAuthStore();
  const { locations, fetchLocations } = useTenantStore();
  const { setLocation } = useAppStore();

  useEffect(() => {
    if (!user) return router.replace('/login');
  }, [user]);

  useEffect(() => {
    if (tenant) {
      fetchLocations(tenant)
    }
  }, [tenant]);

  return (
    <ThemedSafeAreaView style={styles.locationContainer}>
      <ThemedText type="title" style={styles.title}>Seleziona la sede</ThemedText>
      <ThemedView style={styles.locationGrid}>
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={styles.locationCard}
              onPress={() => {
                setLocation(item);
                router.push(`/(app)/(tabs)`)
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
