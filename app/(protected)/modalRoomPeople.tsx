import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RoomPerson } from '@/types';
import { getPeopleInRoom } from '@/db/api';

export default function ModalRoomPeople() {
  const { roomId, roomName, date } = useLocalSearchParams();
  const [people, setPeople] = useState<RoomPerson[]>([]);
  const [loading, setLoading] = useState(false);

  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const secondaryText = useThemeColor({}, 'secondaryText');
  const iconColor = useThemeColor({}, 'icon');
  const whiteTextColor = useThemeColor({}, 'whiteText');

  useEffect(() => {
    if (roomId && date) {
      fetchPeople();
    }
  }, [roomId, date]);

  const fetchPeople = async () => {
    if (!roomId || !date) return;

    setLoading(true);
    try {
      const parsedDate = new Date(date as string);
      const roomPeople = await getPeopleInRoom(roomId as string, parsedDate);
      setPeople(roomPeople);
    } catch (error) {
      console.error('Error fetching room people:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'morning':
        return 'Mattina (9:00-13:00)';
      case 'afternoon':
        return 'Pomeriggio (14:00-18:00)';
      case 'full':
      default:
        return 'Intera giornata';
    }
  };

  const renderPerson = ({ item }: { item: RoomPerson }) => (
    <ThemedView style={[styles.personCard, { backgroundColor: cardBackground, borderColor }]}>
      <ThemedView style={styles.personInfo}>
        <ThemedView style={styles.personHeader}>
          <ThemedText type="defaultSemiBold">
            {item.employee.firstName} {item.employee.lastName}
          </ThemedText>
          <ThemedView style={[styles.statusBadge, {
            backgroundColor: item.status === 'confirmed' ? tintColor :
              item.status === 'pending' ? '#orange' : '#red'
          }]}>
            <ThemedText type="small" style={{ color: 'white' }}>
              {item.status === 'confirmed' ? 'Confermata' :
                item.status === 'pending' ? 'In attesa' : 'Annullata'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText type="small" style={{ color: secondaryText }}>
          {item.employee.department}
        </ThemedText>
        <ThemedText type="small" style={{ color: secondaryText }}>
          {getPeriodText(item.period)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedView style={styles.header}>
          <ThemedView>
            <ThemedText type="title" style={{ marginBottom: 4 }}>
              {roomName}
            </ThemedText>
            <ThemedText type="small" style={{ color: secondaryText }}>
              {date ? formatDate(date as string) : ''}
            </ThemedText>
          </ThemedView>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={iconColor} />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={{ flex: 1, marginTop: 20 }}>
          {loading ? (
            <ThemedView style={styles.loadingContainer}>
              <ThemedText>Caricamento...</ThemedText>
            </ThemedView>
          ) : people.length > 0 ? (
            <>
              <ThemedView style={styles.summaryHeader}>
                <Ionicons name="people" size={20} color={tintColor} />
                <ThemedText type="defaultSemiBold" style={{ marginLeft: 8 }}>
                  {people.length} {people.length === 1 ? 'persona presente' : 'persone presenti'}
                </ThemedText>
              </ThemedView>
              <FlatList
                data={people}
                renderItem={renderPerson}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.list}
              />
            </>
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={secondaryText} />
              <ThemedText type="default" style={{ color: secondaryText, marginTop: 16 }}>
                Nessuna persona presente in questa stanza
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Close button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeButtonBottom, { backgroundColor: tintColor }]}
        >
          <ThemedText type="defaultSemiBold" style={{ color: whiteTextColor }}>
            Chiudi
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  personCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  personInfo: {
    flex: 1,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  closeButtonBottom: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
});
