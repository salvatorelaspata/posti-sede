import React, { useEffect, useLayoutEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTenantStore } from '@/store/tenant-store';
import { useAppStore } from '@/store/app-store';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
// import { getTenantFromEmail } from '@/db/api';
import { useUser } from '@clerk/clerk-expo';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function App() {
  const router = useRouter()
  const { user } = useUser();
  const { locations, fetchLocations } = useTenantStore();
  const { setClerkUser, setLocation, tenant } = useAppStore();

  // Theme colors
  const colorScheme = useColorScheme();
  const tintColor = useThemeColor({}, 'tint');
  const whiteText = useThemeColor({}, 'whiteText');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const cardShadow = useThemeColor({}, 'cardShadow');

  useEffect(() => {
    (async () => {
      if (user) setClerkUser(user);
    })();
  }, [user]);

  useEffect(() => {
    if (tenant) fetchLocations(tenant.id);
  }, [tenant]);

  return (
    <ThemedSafeAreaView style={styles.locationContainer}>
      <ThemedText type="title" style={styles.title}>Seleziona la tua sede</ThemedText>
      <ThemedView style={styles.locationGrid}>
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.locationCard, { backgroundColor: cardBackground, shadowColor: cardShadow }]}
              onPress={() => {
                setLocation(item);
                router.push(`/(app)/(tabs)/home`)
              }}
            >
              <ThemedView style={styles.locationImageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.locationImage}
                  alt={item.name}
                />
                <LinearGradient
                  colors={['transparent', tintColor]}
                  style={styles.locationGradient}
                />
                <ThemedText style={[styles.locationName, {
                  color: whiteText,
                  textShadowColor: tintColor
                }]}>
                  {item.name}
                </ThemedText>
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
