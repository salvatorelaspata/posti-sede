import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Room } from '@/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';

const rooms: Room[] = [
  { id: 1, name: 'Sala Blu', capacity: 8, available: 5 },
  { id: 2, name: 'Sala Verde', capacity: 12, available: 3 },
  { id: 3, name: 'Sala Rossa', capacity: 6, available: 6 },
  { id: 4, name: 'Open Space', capacity: 20, available: 8 },
];

const HomeScreen = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.roomsContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Stanze disponibili</ThemedText>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={[
                styles.roomCard,
                selectedRoom?.id === room.id && styles.selectedRoom
              ]}
              onPress={() => setSelectedRoom(room)}
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
        </ThemedView>
      </ScrollView>
      {selectedRoom && (
        <ThemedView style={styles.bookButtonContainer}>
          <TouchableOpacity style={styles.bookUnbookButton} onPress={() => {
            alert('Prenotazione annullata con successo!');
            setSelectedRoom(null);
          }}>
            <FontAwesome5 name="times" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton} onPress={() => {
            alert('Prenotazione effettuata con successo!');
            setSelectedRoom(null);
          }}>
            <ThemedText style={styles.bookButtonText}>Prenota</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1
  },
  container: {
    flex: 1,
  },
  bookButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookButton: {
    width: '80%',
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
  bookUnbookButton: {
    backgroundColor: 'gray',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: 50,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  roomsContainer: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
});

export default HomeScreen;