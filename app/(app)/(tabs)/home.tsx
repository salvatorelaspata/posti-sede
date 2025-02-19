import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Booking, Room } from '@/types';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedGestureHandlerRootView } from '@/components/ThemedGestureHandlerRootView';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import ReserveBottomSheet from '@/components/bottomSheet/Reserve';
import HorizontalCalendar from '@/components/HorizontalCalendar';
import { useCalendar } from '@/hooks/useCalendar';
import { useTenantStore } from '@/store/tenant-store';
import { useAppStore } from '@/store/app-store';
import { useRouter } from 'expo-router';
import { getAvailabilityForLocation, bookRoom, getBookingUserByDate, getEmployeeByClerkId } from '@/db/api';
import { RoomComponent } from '@/components/Room';
import { useUser } from '@clerk/clerk-expo';
const HomeScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const { location } = useAppStore();
  const { rooms, fetchRooms } = useTenantStore();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { daysInCalendar, currentDay: currentDayFromHook, currentMonth, currentYear } = useCalendar();
  const [currentDay, setCurrentDay] = useState<number>(currentDayFromHook);

  const [availability, setAvailability] = useState<any[]>([]);
  const [booked, setBooked] = useState<Booking | null>(null);

  const fetchAvailability = async () => {
    if (location) {
      const availability = await getAvailabilityForLocation(location.id, new Date(currentYear, currentMonth, currentDay));
      setAvailability(availability);
    }
  }

  const fetchPersonalBooking = async () => {
    if (location) {
      const clerkId = user?.id || '';
      try {
        const employee = await getEmployeeByClerkId(clerkId);
        const booking = await getBookingUserByDate(employee?.id || '', new Date(currentYear, currentMonth, currentDay));
        setBooked(booking[0]);
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (location) fetchAvailability();
  }, [location]);

  useEffect(() => {
    if (location) fetchPersonalBooking();
  }, [location, currentDay]);

  useEffect(() => {
    if (location) fetchRooms(location.id);
  }, [location]);

  const switchSelectedRoom = (room: Room) => {
    if (booked) {
      Alert.alert('Attenzione', 'Hai già una prenotazione per questo giorno');
      return;
    } else if (room.capacity <= availability.length) {
      Alert.alert('Attenzione', 'Questa stanza è piena. Prenota un altra stanza.');
      return;
    } else if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
    } else {
      setSelectedRoom(room);
    }
  }

  const handleBooking = async () => {
    if (selectedRoom && location) {
      try {
        const employee = await getEmployeeByClerkId(user?.id || '');
        await bookRoom(selectedRoom.id, location.tenantId || '', employee?.id || '', new Date(currentYear, currentMonth, currentDay, 6, 0, 0, 0));
        setSelectedRoom(null);
      } catch (error) {
        console.log(error);
      } finally {
        fetchAvailability();
        fetchPersonalBooking();
      }
    }
  }

  return (
    <ThemedGestureHandlerRootView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Date disponibili ({currentMonth + 1}/{currentYear})</ThemedText>
      <HorizontalCalendar
        daysInCalendar={daysInCalendar}
        currentDay={currentDay}
        currentDayFromHook={currentDayFromHook}
        setCurrentDay={setCurrentDay} />
      <ThemedText type="subtitle" style={styles.sectionTitle}>Stanze disponibili
        <TouchableOpacity onPress={() => router.push('/(app)/modalDetailLocation')}>
          <Ionicons name="information-circle" size={24} color="black" />
        </TouchableOpacity>
      </ThemedText>
      {/* <ThemedText>{JSON.stringify(availability, null, 2)}</ThemedText> */}
      <ThemedScrollView ref={scrollViewRef} style={styles.roomsContainer}>
        {/* button to show svg */}
        {rooms.length > 0 ? rooms.map((room) => (
          <RoomComponent
            key={room.id}
            room={room}
            selectedRoom={selectedRoom}
            switchSelectedRoom={switchSelectedRoom}
            selectedDate={new Date(currentYear, currentMonth, currentDay)}
            booked={booked?.roomId === room.id ? true : false} />
        )) : <ThemedText style={styles.noRoomsText}>Nessuna stanza disponibile</ThemedText>}
        <ThemedView style={styles.bottomMargin} />
      </ThemedScrollView>
      {selectedRoom && (
        <ReserveBottomSheet selectedRoom={selectedRoom} onClose={() => setSelectedRoom(null)}
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