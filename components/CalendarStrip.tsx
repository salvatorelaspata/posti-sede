import { isDayDisabled } from '@/hooks/useCalendar';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/app-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 7; // 7 giorni visibili alla volta
const CENTER_INDEX = 15; // Il centro della lista (15 giorni prima e 15 dopo)
const TOTAL_DAYS = 31; // 15 + 1 + 15

type DayItem = {
  id: string;
  date: Date;
  dayName: string;
  dayNumber: string;
  month: string;
  isToday: boolean;
};

const CalendarStrip: React.FC = () => {
  // Il centro corrente diventa la data di riferimento
  const [centerDate, setCenterDate] = useState<Date>(new Date());
  const [days, setDays] = useState<DayItem[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { setCurrentDate, booking } = useAppStore();
  const successColor = useThemeColor({}, 'success')
  const tintColor = useThemeColor({}, 'tint')

  // Funzione per ricreare la lista dei giorni in base ad una data centrale
  const generateDays = (center: Date) => {
    const daysArray: DayItem[] = [];
    for (let i = -15; i <= 15; i++) {
      const date = new Date(center);
      date.setDate(center.getDate() + i);
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
      const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
      daysArray.push({
        id: i.toString(),
        date,
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate().toString(),
        month: monthNames[date.getMonth()],
        isToday: isSameDate(date, new Date()),
      });
    }
    return daysArray;
  };

  // Funzione utilitaria per comparare date senza tempo
  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };

  useEffect(() => {
    const initialDays = generateDays(centerDate);
    setDays(initialDays);
    // Scroll automatico al centro
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: CENTER_INDEX,
        animated: true,
      });
    }, 500);
  }, [centerDate]);  // Quando l'utente tocca un giorno, impostiamo quella data come centro e scrolliamo al centro della nuova lista
  const handleDayPress = (index: number) => {
    const selectedDay = days[index].date;
    setCenterDate(selectedDay);
    setCurrentDate(selectedDay);
    flatListRef.current?.scrollToIndex({
      index: CENTER_INDEX,
      animated: true,
    });
  };
  const renderDay = ({ item, index }: { item: DayItem; index: number }) => {
    // L'item selezionato è sempre l'indice centrale poiché la lista viene rigenerata
    const isSelected = index === CENTER_INDEX;
    const isDisabled = isDayDisabled(item.date);

    const current = item.date
    current.setHours(6, 0, 0, 0)
    const f = booking?.find((b) =>
      b.date.toISOString() === current.toISOString()
    )
    return (
      <TouchableOpacity
        style={[styles.dayItem, isSelected && styles.selectedDayItem, isDisabled && { opacity: 0.5 }]}
        onPress={() => handleDayPress(index)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dayName, isSelected && [styles.selectedText, { color: tintColor }]]}>
          {item.dayName}
        </Text>
        <View style={[styles.dateCircle, isSelected && { backgroundColor: tintColor }]}>
          <Text style={[styles.dayNumber, isSelected && styles.selectedDayNumber]}>
            {item.dayNumber}
          </Text>
        </View>
        <Text style={[styles.month, isSelected && [styles.selectedText, { color: tintColor }]]}>
          {item.month}
        </Text>
        {isSameDate(item.date, new Date()) && !isSelected && <View style={[styles.todayDot, { backgroundColor: tintColor }]} />}
        {f && <View style={[styles.bookedDot, { backgroundColor: successColor }]} />}
      </TouchableOpacity>
    );
  }; const getItemLayout = (_: any, index: number) => {
    return {
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    };
  };  // Quando l'utente finisce lo scroll manuale, determiniamo l'item centrale e rigeneriamo la lista
  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    const newCenterDate = days[index]?.date || centerDate;
    // Aggiorna il centro solo se il giorno selezionato è diverso
    if (!isSameDate(newCenterDate, centerDate)) {
      setCenterDate(newCenterDate);
      // Dopo aver rigenerato la lista, scrolliamo al centro
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: CENTER_INDEX,
          animated: false,
        });
      }, 100);
    }
  };

  return (
    <View style={[styles.container, { position: 'relative' }]}>
      <View style={[styles.placeholder]}>
        <View style={[styles.dayItem, styles.selectedDayItem, { height: '100%' }]} />
      </View>
      <Animated.FlatList
        ref={flatListRef}
        data={days}
        renderItem={renderDay}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="center"
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        contentContainerStyle={styles.flatListContent}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  flatListContent: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  dayItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  selectedDayItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 12,
  },
  dayName: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  selectedDateCircle: {
    backgroundColor: '#007AFF',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedDayNumber: {
    color: 'white',
  },
  month: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    // backgroundColor: '#FF3B30',
    position: 'absolute',
    bottom: 2,
  },
  bookedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    // backgroundColor: '#FF3B30',
    position: 'absolute',
    bottom: 2,
  },
  placeholder: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
});

export default CalendarStrip;