import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { getAllPeopleInLocation } from '@/db/api';
import { useAppStore } from '@/store/app-store';
import { RoomWithPeople } from '@/types';
import { formatDate } from '@/constants/Calendar';

const ModalAllPeople = () => {
  const router = useRouter();
  const { location, currentDay, currentMonth, currentYear } = useAppStore();
  const [roomsWithPeople, setRoomsWithPeople] = useState<RoomWithPeople[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(currentYear, currentMonth, currentDay));
  
  const primaryButtonColor = useThemeColor({}, 'primaryButton');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');

  const fetchAllPeople = async (date: Date) => {
    if (!location) return;
    
    setLoading(true);
    try {
      const data = await getAllPeopleInLocation(location.id, date);
      setRoomsWithPeople(data);
    } catch (error) {
      console.error('Errore nel recupero delle persone:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPeople(currentDate);
  }, [location, currentDate]);

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return 'sunny-outline';
      case 'afternoon':
        return 'partly-sunny-outline';
      default:
        return 'time-outline';
    }
  };

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'morning':
        return 'Mattina';
      case 'afternoon':
        return 'Pomeriggio';
      default:
        return 'Giornata intera';
    }
  };

  const totalPeople = roomsWithPeople.reduce((total, room) => total + room.people.length, 0);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title">Persone presenti</ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            {formatDate(currentDate, 'full')}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.placeholder} />
      </ThemedView>

      {/* Navigazione giorni */}
      <ThemedView style={styles.navigationContainer}>
        <TouchableOpacity 
          onPress={() => navigateDay('prev')}
          style={[styles.navButton, { borderColor }]}
        >
          <Ionicons name="chevron-back" size={20} color={primaryButtonColor} />
          <ThemedText type="small" style={[styles.navButtonText, { color: primaryButtonColor }]}>
            Giorno precedente
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => navigateDay('next')}
          style={[styles.navButton, { borderColor }]}
        >
          <ThemedText type="small" style={[styles.navButtonText, { color: primaryButtonColor }]}>
            Giorno successivo
          </ThemedText>
          <Ionicons name="chevron-forward" size={20} color={primaryButtonColor} />
        </TouchableOpacity>
      </ThemedView>

      {/* Statistiche */}
      <ThemedView style={[styles.statsContainer, { backgroundColor: cardBackgroundColor, borderColor }]}>
        <ThemedView style={styles.statItem}>
          <ThemedText type="title" style={styles.statNumber}>{totalPeople}</ThemedText>
          <ThemedText type="small" style={styles.statLabel}>Persone totali</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText type="title" style={styles.statNumber}>{roomsWithPeople.length}</ThemedText>
          <ThemedText type="small" style={styles.statLabel}>Stanze occupate</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Lista delle stanze */}
      <ThemedScrollView style={styles.scrollContainer}>
        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={primaryButtonColor} />
            <ThemedText type="small" style={styles.loadingText}>
              Caricamento persone presenti...
            </ThemedText>
          </ThemedView>
        ) : roomsWithPeople.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={borderColor} />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              Nessuna persona presente
            </ThemedText>
            <ThemedText type="small" style={styles.emptySubtitle}>
              Non ci sono prenotazioni per questo giorno
            </ThemedText>
          </ThemedView>
        ) : (
          roomsWithPeople.map((roomData) => (
            <ThemedView 
              key={roomData.room.id} 
              style={[styles.roomCard, { backgroundColor: cardBackgroundColor, borderColor }]}
            >
              {/* Header della stanza */}
              <ThemedView style={styles.roomHeader}>
                <ThemedView style={styles.roomInfo}>
                  <ThemedText type="subtitle">{roomData.room.name}</ThemedText>
                  <ThemedText type="small" style={styles.roomCapacity}>
                    {roomData.occupancy}/{roomData.room.capacity} persone
                  </ThemedText>
                </ThemedView>
                <ThemedView style={[styles.occupancyBadge, { backgroundColor: primaryButtonColor }]}>
                  <ThemedText type="small" style={styles.occupancyText}>
                    {Math.round((roomData.occupancy / roomData.room.capacity) * 100)}%
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {/* Lista delle persone */}
              <ThemedView style={styles.peopleContainer}>
                {roomData.people.map((person) => (
                  <ThemedView key={person.id} style={[styles.personCard, { borderColor }]}>
                    <ThemedView style={styles.personInfo}>
                      <ThemedView style={styles.personHeader}>
                        <ThemedText type="defaultSemiBold">
                          {person.employee.firstName} {person.employee.lastName}
                        </ThemedText>
                        <ThemedView style={styles.periodContainer}>
                          <Ionicons 
                            name={getPeriodIcon(person.period)} 
                            size={14} 
                            color={primaryButtonColor} 
                          />
                          <ThemedText type="small" style={[styles.periodText, { color: primaryButtonColor }]}>
                            {getPeriodText(person.period)}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                      <ThemedText type="small" style={styles.personDepartment}>
                        {person.employee.department}
                      </ThemedText>
                      <ThemedText type="small" style={styles.personEmail}>
                        {person.employee.email}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          ))
        )}
        <ThemedView style={styles.bottomPadding} />
      </ThemedScrollView>
    </ThemedView>
  );
};

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
    paddingBottom: 8,
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  placeholder: {
    width: 40,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  navButtonText: {
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  statLabel: {
    marginTop: 4,
    opacity: 0.7,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  loadingText: {
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  roomCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  roomInfo: {
    flex: 1,
  },
  roomCapacity: {
    marginTop: 4,
    opacity: 0.7,
  },
  occupancyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  occupancyText: {
    color: 'white',
    fontWeight: '600',
  },
  peopleContainer: {
    gap: 12,
  },
  personCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  personInfo: {
    gap: 4,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '500',
  },
  personDepartment: {
    opacity: 0.8,
    fontWeight: '500',
  },
  personEmail: {
    opacity: 0.6,
  },
  bottomPadding: {
    height: 32,
  },
});

export default ModalAllPeople;
