import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Room } from '@/types';
import { FontAwesome5 } from '@expo/vector-icons';

import { GestureHandlerRootView } from 'react-native-gesture-handler';


import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import ReserveBottomSheet from '@/components/bottomSheet/Reserve';
import { ThemedGestureHandlerRootView } from '@/components/ThemedGestureHandlerRootView';
import { ThemedScrollView } from '@/components/ThemedScrollView';

const rooms: Room[] = [
  { id: 1, name: 'Sala Blu', capacity: 8, available: 5 },
  { id: 2, name: 'Sala Verde', capacity: 12, available: 3 },
  { id: 3, name: 'Sala Rossa', capacity: 6, available: 6 },
  { id: 4, name: 'Open Space', capacity: 20, available: 8 },
];

const snapPoints = ['50%'];

const HomeScreen = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const switchSelectedRoom = (room: Room) => {
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
    } else {
      setSelectedRoom(room);
    }
  }

  return (
    <ThemedGestureHandlerRootView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Stanze disponibili</ThemedText>
      <ThemedScrollView>
        {rooms.map((room) => (
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
        ))}
      </ThemedScrollView>
      {selectedRoom && (
        <ReserveBottomSheet selectedRoom={selectedRoom} onClose={() => setSelectedRoom(null)} />
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
    borderColor: '#007AFF',
    borderWidth: 2,
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
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capacityText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityText: {
    color: '#666',
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
    backgroundColor: '#4CAF50',
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
});

export default HomeScreen;