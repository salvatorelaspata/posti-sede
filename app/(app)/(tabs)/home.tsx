import React, { useEffect, useRef, useState } from 'react';
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
import BottomSheet from '@gorhom/bottom-sheet';
import CalendarStrip from '@/components/CalendarStrip';

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { rooms, fetchRooms } = useTenantStore();
  const { location, room, setRoom, fetchPersonalBooking, currentDay, currentMonth, currentYear, booking } = useAppStore();

  const scrollViewRef = useRef<ScrollView>(null);
  const primaryButtonColor = useThemeColor({}, 'primaryButton');

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [booked, setBooked] = useState<{
    date: Date;
    roomId: string | null;
    roomName: string | null;
  } | undefined>();

  useEffect(() => {
    const current = new Date(currentYear, currentMonth, currentDay)
    current.setHours(6, 0, 0, 0)
    const f = booking?.find((b) => b.date.toISOString() === current.toISOString())
    if (f) setBooked(f)
    else setBooked(undefined)
  }, [location, currentDay])

  useEffect(() => {
    if (location) fetchPersonalBooking();
  }, [location, currentMonth]);

  useEffect(() => {
    if (location) fetchRooms(location.id, new Date(currentYear, currentMonth, currentDay));
  }, [location]);

  const switchSelectedRoom = (_room: Room) => {
    if (booked) {
      Alert.alert('Attenzione', 'Hai già una prenotazione per questo giorno nella stanza: ' + booked.roomName);
      return;
    } else if (_room.available === 0) {
      Alert.alert('Attenzione', 'Questa stanza è piena. Prenota un altra stanza.');
      return;
    } else if (room?.id === _room.id) {
      setRoom(null);
    } else {
      setRoom(_room);
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
      <ThemedText type="subtitle" style={styles.sectionTitle}>Date disponibili {/*({currentMonth + 1}/{currentYear})*/}</ThemedText>
      {/* <HorizontalCalendar /> */}
      <CalendarStrip />
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
          // booked={booking?.roomId === room.id ? true : false} />
          />
        )) : <ThemedText style={styles.noRoomsText}>Nessuna stanza disponibile</ThemedText>}
        <ThemedView style={styles.bottomMargin} />
      </ThemedScrollView>
      {room &&
        <ReserveBottomSheet bottomSheetRef={bottomSheetRef} handleBooking={handleBooking} />
      }

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