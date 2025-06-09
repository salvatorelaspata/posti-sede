import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/app-store';
import { Calendar } from 'react-native-calendars';
import { ThemedTextInput } from '@/components/ThemedTextInput';

interface SelectedDays {
  [key: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

export default function ModalCreateSchedule() {
  const router = useRouter();
  const { location } = useAppStore();

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

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
    if (!title.trim()) {
      Alert.alert('Errore', 'Inserisci un titolo per la schedulazione');
      return;
    }

    if (Object.keys(selectedDays).length === 0) {
      Alert.alert('Errore', 'Seleziona almeno un giorno');
      return;
    }

    // Qui implementerai la logica per salvare la schedulazione
    const scheduleData = {
      title,
      description,
      selectedDays: Object.keys(selectedDays),
      isRecurring,
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
        {/* Form Fields */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground, shadowColor: cardShadow }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Dettagli Schedulazione
          </ThemedText>

          <ThemedView style={styles.inputGroup}>
            <ThemedText type="default" style={[styles.label, { color: textColor }]}>
              Titolo *
            </ThemedText>
            <ThemedTextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Inserisci il titolo della schedulazione"
              style={styles.input}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText type="default" style={[styles.label, { color: textColor }]}>
              Descrizione
            </ThemedText>
            <ThemedTextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descrizione opzionale"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </ThemedView>

          {/* <ThemedView style={styles.inputGroup}>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <ThemedText type="default" style={[styles.label, { color: textColor }]}>
                Schedulazione ricorrente
              </ThemedText>
              <Ionicons 
                name={isRecurring ? "checkbox" : "square-outline"} 
                size={24} 
                color={isRecurring ? tintColor : iconColor} 
              />
            </TouchableOpacity>
          </ThemedView> */}
        </ThemedView>

        {/* Calendar Section */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground, shadowColor: cardShadow }]}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
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
          </ThemedView>

          {getSelectedDaysCount() > 0 && (
            <ThemedView style={[styles.selectedDaysInfo, { backgroundColor: `${tintColor}15`, borderColor: tintColor }]}>
              <Ionicons name="calendar" size={20} color={tintColor} />
              <ThemedText type="small" style={[styles.selectedDaysText, { color: tintColor }]}>
                Hai selezionato {getSelectedDaysCount()} giorni
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Instructions */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground, shadowColor: cardShadow }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Come funziona
          </ThemedText>
          <ThemedView style={styles.instructionsList}>
            <ThemedView style={styles.instructionItem}>
              <Ionicons name="calendar-outline" size={20} color={iconColor} />
              <ThemedText type="default" style={[styles.instructionText, { color: textColor }]}>
                Seleziona i giorni del calendario toccandoli
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.instructionItem}>
              <Ionicons name="time-outline" size={20} color={iconColor} />
              <ThemedText type="default" style={[styles.instructionText, { color: textColor }]}>
                La schedulazione sarà attiva per tutti i giorni selezionati
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.instructionItem}>
              <Ionicons name="location-outline" size={20} color={iconColor} />
              <ThemedText type="default" style={[styles.instructionText, { color: textColor }]}>
                Valida solo per la sede {location?.name}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

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
            Salva Schedulazione
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
    paddingTop: 16,
    paddingBottom: 12,
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
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
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
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
});
