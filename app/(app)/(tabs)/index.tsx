import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Room } from '@/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedGestureHandlerRootView } from '@/components/ThemedGestureHandlerRootView';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import ReserveBottomSheet from '@/components/bottomSheet/Reserve';
import HorizontalCalendar from '@/components/HorizontalCalendar';
import { Colors } from '@/constants/Colors';
import { useCalendar } from '@/hooks/useCalendar';
import { useTenantStore } from '@/store/tenant-store';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { location } = useAppStore();
  const { rooms, fetchRooms } = useTenantStore();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!user) return router.replace('/login');
  }, [user]);

  useEffect(() => {
    if (location) {
      fetchRooms(location.id);
    }
  }, [location]);

  const switchSelectedRoom = (room: Room) => {
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
    } else {
      setSelectedRoom(room);
    }
  }
  const { daysInCalendar, currentDay: currentDayFromHook, currentMonth, currentYear } = useCalendar();
  const [currentDay, setCurrentDay] = useState<number>(currentDayFromHook);

  return (
    <ThemedGestureHandlerRootView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Date disponibili</ThemedText>
      <HorizontalCalendar daysInCalendar={daysInCalendar} currentDay={currentDay} currentDayFromHook={currentDayFromHook} setCurrentDay={setCurrentDay} />
      <ThemedText type="subtitle" style={styles.sectionTitle}>Stanze disponibili</ThemedText>
      <ThemedScrollView ref={scrollViewRef} style={styles.roomsContainer}>
        {rooms.length > 0 ? rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={[
              styles.roomCard,
              selectedRoom?.id === room.id && styles.selectedRoom
            ]}
            onPress={() => switchSelectedRoom(room)}
          >
            <ThemedView style={styles.roomHeader}>
              <ThemedText style={styles.roomName}>{room.name}</ThemedText>
              <ThemedView style={styles.capacityBadge}>
                <ThemedText style={styles.capacityText}>
                  {room.available}/{room.capacity}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.roomInfo}>
              <FontAwesome5 name="users" size={20} color="#666" />
              <ThemedText style={styles.availabilityText}>
                {room.available} posti disponibili
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.progressContainer}>
              <ThemedView
                style={[
                  styles.progressBar,
                  { width: `${(room.available / room.capacity) * 100}%` }
                ]}
              />
            </ThemedView>
          </TouchableOpacity>
        )) : <ThemedText style={styles.noRoomsText}>Nessuna stanza disponibile</ThemedText>}
        <ThemedView style={styles.bottomMargin} />
      </ThemedScrollView>
      {selectedRoom && (
        <ReserveBottomSheet selectedRoom={selectedRoom} onClose={() => setSelectedRoom(null)}
          selectedDate={new Date(currentYear, currentMonth, currentDay)}
        />
      )}
    </ThemedGestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  roomsContainer: {
    flex: 1
  },
  sectionTitle: {
    margin: 16,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoom: {
    borderColor: Colors.light.tint,
    borderWidth: 2,
    // shadow
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
  },
  capacityBadge: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capacityText: {
    color: Colors.light.whiteText,
    fontSize: 14,
    fontWeight: '500',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityText: {
    color: Colors.light.text,
    fontSize: 16,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.tint,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: 'blue',
  },
  bottomMargin: {
    // height: 500,
  },
  noRoomsText: {
    textAlign: 'center',
    marginTop: 16,
  },
});

export default HomeScreen;