import React, { useEffect } from 'react';
import { Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { useTenantStore } from '@/store/tenant-store';
import { useAppStore } from '@/store/app-store';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/auth';

export default function App() {
  const router = useRouter()
  const { user, signOut } = useAuth();
  if (!user) return <Redirect href="/login" />
  const { locations, setTenantFromUser, reset: resetTenant } = useTenantStore();
  const { setLocation, reset: resetApp, setEmployee } = useAppStore();

  // Theme colors
  const tintColor = useThemeColor({}, 'tint');
  const whiteText = useThemeColor({}, 'whiteText');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const cardShadow = useThemeColor({}, 'cardShadow');

  useEffect(() => {
    console.log('App component mounted, fetching tenant locations', user);
    if (user) {
      const fetchEmployee = async () => {
        try {
          const employee = await setTenantFromUser(user);
          if (employee) {
            console.log('Employee set:', employee);
            setEmployee(employee);
          } else {
            console.error('Failed to set employee for user:', user.email);
          }
        }
        catch (error) {
          console.error('Error fetching employee:', error);
        }
      };
      fetchEmployee();
    }
  }, [user]);

  return (
    <ThemedSafeAreaView style={styles.locationContainer}>
      <ThemedText type="title" style={styles.title}>Sedi</ThemedText>
      <ThemedText type='small' style={styles.info}>
        👋 {user.given_name}, seleziona una sede per visualizzare le postazioni disponibili
      </ThemedText>
      <ThemedView style={styles.locationGrid}>
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.locationCard, { backgroundColor: cardBackground, shadowColor: cardShadow }]}
              onPress={() => {
                console.log('Selected location:', item);
                setLocation(item);
                router.push(`/(protected)/(tabs)/home`)
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
          ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 16 }}>Nessuna sede disponibile per la tua organizzazione</ThemedText>}
        />
      </ThemedView>
      {/* Logout button */}
      <TouchableOpacity
        style={{ margin: 16, padding: 16, backgroundColor: tintColor, borderRadius: 8, marginTop: 16 }}
        onPress={async () => {
          await signOut();
          resetApp();
          resetTenant();
          router.push('/login');
        }}
      >
        <ThemedText type='defaultSemiBold' style={{ color: 'white', textAlign: 'center' }}>Logout</ThemedText>
      </TouchableOpacity>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    flex: 1,

  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  info: {
    marginBottom: 8,
    marginHorizontal: 16,
  },
  locationGrid: {
    marginHorizontal: 16,
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
