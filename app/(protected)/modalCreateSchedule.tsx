import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/app-store';
import { useTenantStore } from '@/store/tenant-store';
import { Calendar } from 'react-native-calendars';
import { Room } from '@/types';
import { Image } from 'expo-image';
import { tabBarHeight } from '@/constants/Colors';

interface SelectedDays {
  [key: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

export default function ModalCreateSchedule() {
  const router = useRouter();
  const { location } = useAppStore();
  const { rooms, fetchRooms } = useTenantStore();

  // Theme colors
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');
  const cardShadow = useThemeColor({}, 'cardShadow');
  const inactiveText = useThemeColor({}, 'inactiveText');

  // State
  const [selectedDays, setSelectedDays] = useState<SelectedDays>({});
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (location && Object.keys(selectedDays).length > 0) {
      // Prendi il primo giorno selezionato per caricare le room disponibili
      const firstSelectedDay = Object.keys(selectedDays)[0];
      fetchRooms(location.id, new Date(firstSelectedDay));
    }
  }, [location, selectedDays]);

  const handleDayPress = (day: any) => {
    const dateString = day.dateString;
    const newSelectedDays = { ...selectedDays };

    if (newSelectedDays[dateString]) {
      delete newSelectedDays[dateString];
    } else {
      newSelectedDays[dateString] = {
        selected: true,
        selectedColor: tintColor,
      };
    }

    setSelectedDays(newSelectedDays);
  };

  const handleSaveSchedule = () => {
    if (!selectedRoom) {
      Alert.alert('Errore', 'Seleziona una stanza per la schedulazione');
      return;
    }

    if (Object.keys(selectedDays).length === 0) {
      Alert.alert('Errore', 'Seleziona almeno un giorno');
      return;
    }

    // Qui implementerai la logica per salvare la schedulazione
    const scheduleData = {
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      selectedDays: Object.keys(selectedDays),
      locationId: location?.id,
    };

    console.log('Saving schedule:', scheduleData);

    Alert.alert(
      'Successo',
      'Schedulazione creata con successo!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const getSelectedDaysCount = () => Object.keys(selectedDays).length;

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: cardBackground, borderBottomColor: borderColor }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color={iconColor} />
        </TouchableOpacity>

        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            Nuova Schedulazione
          </ThemedText>
          <ThemedText type="default" style={[styles.subtitle, { color: inactiveText }]}>
            Sede {location?.name}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.placeholder} />
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Instructions - Compatte */}
        {/* <ThemedView style={[styles.instructionsSection, { backgroundColor: cardBackground, shadowColor: cardShadow }]}>
          <ThemedView style={styles.instructionsList}>
            <ThemedView style={styles.instructionItem}>
              <Ionicons name="calendar-outline" size={18} color={iconColor} />
              <ThemedText type="small" style={[styles.instructionText, { color: textColor }]}>
                Tocca i giorni per selezionarli
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.instructionItem}>
              <Ionicons name="time-outline" size={18} color={iconColor} />
              <ThemedText type="small" style={[styles.instructionText, { color: textColor }]}>
                Schedulazione per tutti i giorni selezionati
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView> */}


        {/* Room Selection */}
        <ThemedView style={[styles.roomSection, { backgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.compactSectionTitle, { color: textColor }]}>
            Seleziona Stanza
          </ThemedText>

          {rooms.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.roomScrollContainer}
            >
              {rooms.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.roomCardHorizontal,
                    {
                      backgroundColor: selectedRoom?.id === item.id ? cardBackground : cardBackground,
                      borderColor: selectedRoom?.id === item.id ? tintColor : borderColor,
                      borderWidth: selectedRoom?.id === item.id ? 2 : 1,
                      shadowColor: cardShadow,
                    }
                  ]}
                  onPress={() => setSelectedRoom(item)}
                >
                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.roomImageHorizontal}
                      contentFit="cover"
                    />
                  )}
                  <ThemedView style={styles.roomInfoHorizontal}>
                    <ThemedText type="defaultSemiBold" style={[styles.roomNameHorizontal, { color: textColor }]} numberOfLines={1}>
                      {item.name}
                    </ThemedText>
                    {/* <ThemedText type="small" style={[styles.roomDetailsHorizontal, { color: inactiveText }]} numberOfLines={1}>
                      {item.capacity} posti
                    </ThemedText> */}
                    {/* {item.available !== undefined && (
                      <ThemedText type="small" style={[styles.roomDetailsHorizontal, { color: tintColor }]} numberOfLines={1}>
                        {item.available} liberi
                      </ThemedText>
                    )} */}
                  </ThemedView>
                  {selectedRoom?.id === item.id && (
                    <ThemedView style={[styles.selectedIndicator, { backgroundColor: tintColor }]}>
                      <Ionicons name="checkmark" size={16} color="white" />
                    </ThemedView>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <ThemedView style={styles.noRoomsContainerCompact}>
              <Ionicons name="information-circle-outline" size={24} color={inactiveText} />
              <ThemedText type="small" style={[styles.noRoomsTextCompact, { color: inactiveText }]}>
                Seleziona un giorno per vedere le stanze
              </ThemedText>
            </ThemedView>
          )}
          <ThemedView style={styles.compactSectionHeader}>
            <ThemedText type="subtitle" style={[styles.compactSectionTitle, { color: textColor }]}>
              Seleziona Giorni
            </ThemedText>
            <ThemedView style={[styles.badge, { backgroundColor: tintColor }]}>
              <ThemedText type="small" style={{ color: 'white' }}>
                {getSelectedDaysCount()} giorni
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.calendarContainer}>
            <Calendar
              firstDay={1}
              onDayPress={handleDayPress}
              markedDates={selectedDays}
              theme={{
                backgroundColor: cardBackground,
                calendarBackground: cardBackground,
                textSectionTitleColor: textColor,
                selectedDayBackgroundColor: tintColor,
                selectedDayTextColor: 'white',
                todayTextColor: tintColor,
                dayTextColor: textColor,
                textDisabledColor: inactiveText,
                dotColor: tintColor,
                selectedDotColor: 'white',
                arrowColor: tintColor,
                monthTextColor: textColor,
                indicatorColor: tintColor,
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              minDate={new Date().toISOString().split('T')[0]}
              style={[styles.calendar, { borderColor }]}
            />
            {/* </ThemedView> */}

            {getSelectedDaysCount() > 0 && (
              <ThemedView style={[styles.selectedDaysInfo, { backgroundColor: `${tintColor}15`, borderColor: tintColor }]}>
                <Ionicons name="calendar" size={20} color={tintColor} />
                <ThemedText type="small" style={[styles.selectedDaysText, { color: tintColor }]}>
                  Hai selezionato {getSelectedDaysCount()} giorni
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>

        {/* Calendar Section */}
        {/* <ThemedView style={[styles.calendarSection, { backgroundColor: cardBackground, shadowColor: cardShadow }]}> */}


        <ThemedView style={styles.bottomPadding} />
      </ScrollView>

      {/* Footer */}
      <ThemedView style={[styles.footer, { backgroundColor: cardBackground, borderTopColor: borderColor }]}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, { borderColor }]}
          onPress={() => router.back()}
        >
          <ThemedText type="default" style={[styles.buttonText, { color: textColor }]}>
            Annulla
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton, { backgroundColor: tintColor }]}
          onPress={handleSaveSchedule}
        >
          <Ionicons name="save" size={20} color="white" style={styles.buttonIcon} />
          <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: 'white' }]}>
            Salva
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    minHeight: 44,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  calendarContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  calendar: {
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedDaysInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedDaysText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 8,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28, // Ridotto per safe area
    borderTopWidth: 1,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44,
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    // backgroundColor will be set by tintColor
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonIcon: {
    marginRight: 8,
  },
  roomCard: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
  },
  roomContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    marginBottom: 4,
  },
  roomDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  noRoomsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noRoomsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  // Stili compatti per la versione ottimizzata
  roomSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  compactSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  roomScrollContainer: {
    paddingRight: 16,
  },
  roomCardHorizontal: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    padding: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  roomImageHorizontal: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  roomInfoHorizontal: {
    flex: 1,
  },
  roomNameHorizontal: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  roomDetailsHorizontal: {
    fontSize: 12,
    marginBottom: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRoomsContainerCompact: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    flexDirection: 'row',
    gap: 8,
  },
  noRoomsTextCompact: {
    fontSize: 14,
    textAlign: 'center',
  },
  calendarSection: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 12,
  },
  instructionsSection: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
