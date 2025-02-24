import React, { useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Room } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedGestureHandlerRootView } from '@/components/ThemedGestureHandlerRootView';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import ReserveBottomSheet from '@/components/bottomSheet/Reserve';
import HorizontalCalendar from '@/components/HorizontalCalendar';
import { useTenantStore } from '@/store/tenant-store';
import { useAppStore } from '@/store/app-store';
import { useRouter } from 'expo-router';
import { bookRoom, getEmployeeByClerkId } from '@/db/api';
import { RoomComponent } from '@/components/Room';
import { useUser } from '@clerk/clerk-expo';
import { useThemeColor } from '@/hooks/useThemeColor';

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { rooms, fetchRooms } = useTenantStore();
  const { location, room, setRoom, fetchPersonalBooking, currentDay, currentMonth, currentYear, booking } = useAppStore();

  const scrollViewRef = useRef<ScrollView>(null);
  const primaryButtonColor = useThemeColor({}, 'primaryButton');

  useEffect(() => {
    if (location) fetchPersonalBooking();
  }, [location, currentDay]);

  useEffect(() => {
    if (location) fetchRooms(location.id, new Date(currentYear, currentMonth, currentDay));
  }, [location, currentDay]);

  const switchSelectedRoom = (room: Room) => {
    console.log(booking);
    if (booking) {
      Alert.alert('Attenzione', 'Hai già una prenotazione per questo giorno nella stanza: ' + booking.roomName);
      return;
    } else if (room.available === 0) {
      Alert.alert('Attenzione', 'Questa stanza è piena. Prenota un altra stanza.');
      return;
    } else if (room?.id === room.id) {
      setRoom(null);
    } else {
      setRoom(room);
    }
  }

  const handleBooking = async () => {
    if (room && location) {
      try {
        const employee = await getEmployeeByClerkId(user?.id || '');
        await bookRoom(room.id, location.tenantId || '', employee?.id || '', new Date(currentYear, currentMonth, currentDay, 6, 0, 0, 0));
        setRoom(null);
      } catch (error) {
        console.log(error);
      } finally {
        fetchRooms(location.id, new Date(currentYear, currentMonth, currentDay));
        fetchPersonalBooking();
      }
    }
  }

  return (
    <ThemedGestureHandlerRootView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Date disponibili ({currentMonth + 1}/{currentYear})</ThemedText>
      <HorizontalCalendar />
      <ThemedView style={styles.sectionTitle}>
        <ThemedText type="subtitle">Stanze disponibili</ThemedText>
        <TouchableOpacity onPress={() => router.push('/(app)/modalDetailLocation')}>
          <Ionicons name="information-circle" size={24} color={primaryButtonColor} />
        </TouchableOpacity>
      </ThemedView>
      <ThemedScrollView ref={scrollViewRef} style={styles.roomsContainer}>
        {rooms.length > 0 ? rooms.map((room) => (
          <RoomComponent
            key={room.id}
            room={room}
            switchSelectedRoom={switchSelectedRoom}
            booked={booking?.roomId === room.id ? true : false} />
        )) : <ThemedText style={styles.noRoomsText}>Nessuna stanza disponibile</ThemedText>}
        <ThemedView style={styles.bottomMargin} />
      </ThemedScrollView>
      {room && (
        <ReserveBottomSheet selectedRoom={room} onClose={() => setRoom(null)}
          selectedDate={new Date(currentYear, currentMonth, currentDay)} handleBooking={handleBooking}
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

    flexDirection: 'row',
    justifyContent: 'space-between',
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