import { DayItem, generateDays, isDayDisabled, isSameDate } from '@/hooks/useCalendar';
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
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 7; // 7 giorni visibili alla volta
const CENTER_INDEX = 15; // Il centro della lista (15 giorni prima e 15 dopo)
// const TOTAL_DAYS = 31; // 15 + 1 + 15

const CalendarStrip: React.FC = () => {
  // Il centro corrente diventa la data di riferimento
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { setCurrentDate, booking, days, setDays, currentYear, currentMonth, currentDay } = useAppStore();

  const successColor = useThemeColor({}, 'success')
  const tintColor = useThemeColor({}, 'tint')
  const whiteText = useThemeColor({}, 'whiteText')
  const inactiveText = useThemeColor({}, 'inactiveText')

  useEffect(() => {
    const initialDays = generateDays(new Date(currentYear, currentMonth, currentDay));
    setDays(initialDays);
    // setCurrentDate(centerDate);
    // Scroll automatico al centro
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: CENTER_INDEX,
        animated: true,
      });
    }, 500);
  }, [currentYear, currentMonth, currentDay]);

  // Quando l'utente tocca un giorno, impostiamo quella data come centro e scrolliamo al centro della nuova lista
  const handleDayPress = (index: number) => {
    const selectedDay = days[index].date;
    setCurrentDate(selectedDay);
    flatListRef.current?.scrollToIndex({
      index: CENTER_INDEX,
      animated: true,
    });
  };

  const getItemLayout = (_: any, index: number) => {
    return {
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    };
  };
  // Quando l'utente finisce lo scroll manuale, determiniamo l'item centrale e rigeneriamo la lista
  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    const currentDate = new Date(currentYear, currentMonth, currentDay);
    const newCurrentDate = days[index]?.date || currentDate;
    // Aggiorna il centro solo se il giorno selezionato è diverso
    if (!isSameDate(newCurrentDate, currentDate)) {
      setCurrentDate(newCurrentDate);
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
        renderItem={({ item, index }: { item: DayItem; index: number }) => {
          // L'item selezionato è sempre l'indice centrale poiché la lista viene rigenerata
          const isSelected = index === CENTER_INDEX;
          const isDisabled = item.isDisabled;
          const isToday = item.isToday && !isSelected;
          const isBooked = booking?.some(b => isSameDate(typeof b.date === 'string' ? new Date(b.date) : b.date, item.date));
          return (
            <TouchableOpacity
              style={[styles.dayItem, isSelected && styles.selectedDayItem, isDisabled && { opacity: 0.5 }]}
              onPress={() => handleDayPress(index)}
              activeOpacity={0.7}
            >
              <ThemedText type="smallSemiBold" style={[styles.dayName, isSelected && [{ color: tintColor, }]]}>
                {item.dayName}
              </ThemedText>
              <ThemedView style={[styles.dateCircle, isSelected && { backgroundColor: tintColor }]}>
                <ThemedText type='defaultSemiBold' style={[isDisabled && { color: inactiveText }, isSelected && { color: whiteText }]}>
                  {item.dayNumber}
                </ThemedText>
              </ThemedView>
              <ThemedText type="small" style={[isSelected && [{ color: tintColor }]]}>
                {item.month}
              </ThemedText>
              {isToday && <View style={[styles.todayDot, { backgroundColor: tintColor }]} />}
              {isBooked && <View style={[styles.bookedDot, { backgroundColor: successColor }]} />}
            </TouchableOpacity>
          );
        }}
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
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
    bottom: 2,
  },
  bookedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
    bottom: 2,
  },
  placeholder: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
});

export default CalendarStrip;