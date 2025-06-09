import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Room } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedGestureHandlerRootView } from '@/components/ThemedGestureHandlerRootView';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import ReserveBottomSheet from '@/components/bottomSheet/Reserve';
// import HorizontalCalendar from '@/components/HorizontalCalendar';
import { useTenantStore } from '@/store/tenant-store';
import { useAppStore } from '@/store/app-store';
import { useRouter } from 'expo-router';
import { RoomComponent } from '@/components/Room';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import BottomSheet from '@gorhom/bottom-sheet';
import CalendarStrip from '@/components/CalendarStrip';
import { isDayDisabled } from '@/hooks/useCalendar';

const HomeScreen = () => {
  const router = useRouter();
  const { rooms, fetchRooms } = useTenantStore();
  const { location, room, setRoom, fetchPersonalBooking, currentDay, currentMonth, currentYear, booking, addBooking, booked } = useAppStore();

  const scrollViewRef = useRef<ScrollView>(null);
  // const colorScheme = useColorScheme();
  const primaryButtonColor = useThemeColor({}, 'primaryButton');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  // const warningColor = useThemeColor({}, 'warning');

  const bottomSheetRef = useRef<BottomSheet>(null);

  // Controllo se il giorno corrente è disabilitato
  const currentDate = new Date(currentYear, currentMonth, currentDay);
  const isCurrentDayDisabled = isDayDisabled(currentDate);

  useEffect(() => {
    if (location) fetchRooms(location.id, new Date(currentYear, currentMonth, currentDay));
  }, [location, currentDay]);

  useEffect(() => {
    if (location) fetchPersonalBooking();
  }, [location, currentMonth]);

  const handleBooking = async () => {
    if (room && location) {
      const currentDate = new Date(currentYear, currentMonth, currentDay);

      // Controlla se il giorno è disabilitato
      if (isDayDisabled(currentDate)) {
        Alert.alert(
          'Prenotazione Non Consentita',
          'Non è possibile prenotare una stanza per questo giorno. I giorni nei weekend o passati non sono disponibili per le prenotazioni.',
          [{ text: 'OK', style: 'default' }]
        );
        setRoom(null);
        return;
      }

      try {
        await addBooking();
        setRoom(null);
      } catch (error) {
        console.error(error);
      } finally {
        fetchRooms(location.id, new Date(currentYear, currentMonth, currentDay));
        // fetchPersonalBooking();
      }
    }
  }

  return (
    <ThemedGestureHandlerRootView style={styles.container}>
      <ThemedView style={styles.sectionTitle}>
        <ThemedText type="subtitle">Date disponibili</ThemedText>
        <ThemedText type='small'>({currentYear})</ThemedText>
      </ThemedView>
      {/* <HorizontalCalendar /> */}
      <CalendarStrip />

      {/* Banner giorno disabilitato */}
      {isCurrentDayDisabled && (
        <ThemedView style={[styles.bookingBanner, { backgroundColor: `${errorColor}15`, borderColor: errorColor }]}>
          <ThemedView style={styles.bookingBannerContent}>
            <Ionicons name="warning" size={20} color={errorColor} />
            <ThemedText type="small" style={[styles.bookingBannerText, { color: errorColor }]}>
              Giorno non disponibile per le prenotazioni (weekend o passato)
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}

      {/* Banner stato prenotazione */}
      {booked && (
        <ThemedView style={[styles.bookingBanner, { backgroundColor: `${successColor}15`, borderColor: successColor }]}>
          <ThemedView style={styles.bookingBannerContent}>
            <Ionicons name="checkmark-circle" size={20} color={successColor} />
            <ThemedText type="small" style={[styles.bookingBannerText, { color: successColor }]}>
              Hai prenotato la stanza "{booked.roomName}" per oggi
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.sectionTitle}>
        <ThemedText type="subtitle">Stanze disponibili</ThemedText>
        <ThemedView style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => router.push('/(app)/modalAllPeople')}
            style={styles.iconButton}
          >
            <Ionicons name="people" size={24} color={primaryButtonColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(app)/modalDetailLocation')}>
            <Ionicons name="information-circle" size={24} color={primaryButtonColor} />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ThemedScrollView ref={scrollViewRef} style={styles.roomsContainer}>
        {rooms.length > 0 ? rooms.map((room) => (
          <RoomComponent
            key={room.id}
            room={room}
          />
        )) :
          <ThemedText style={styles.noRoomsText}>
            Nessuna stanza disponibile
          </ThemedText>}
        <ThemedView style={styles.bottomMargin} />
      </ThemedScrollView>

      {room &&
        <ReserveBottomSheet
          bottomSheetRef={bottomSheetRef}
          handleBooking={handleBooking} />
      }
    </ThemedGestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roomsContainer: {
    flex: 1
  },
  sectionTitle: {
    margin: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
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
  bookingBanner: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  bookingBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingBannerText: {
    flex: 1,
    fontWeight: '500',
  },
});

export default HomeScreen;