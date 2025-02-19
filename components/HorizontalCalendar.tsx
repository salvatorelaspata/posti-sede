import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import {
    GestureHandlerRootView,
    FlatList,
    TouchableOpacity,
} from 'react-native-gesture-handler';

const ITEM_WIDTH = 65;
const ITEM_MARGIN = 5;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + (ITEM_MARGIN * 2);
// const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HorizontalCalendarProps {
    daysInCalendar: any[];
    currentDay: number;
    currentDayFromHook: number;
    setCurrentDay: (day: number) => void;
}

export default function HorizontalCalendar({ daysInCalendar, currentDay, currentDayFromHook, setCurrentDay }: HorizontalCalendarProps) {
    const flatListRef = useRef<FlatList<any>>(null);

    const isDayDisabled = (workDay: number, day: number) => {
        if (workDay === 0 || workDay === 6) return true;
        const today = new Date();
        if (day < today.getDate()) return true;
        return false;
    };

    const findFirstAvailableDay = () => {
        const availableDay = daysInCalendar.find(item =>
            !isDayDisabled(item.dayOfWeekIndex, item.day)
        );
        return availableDay?.day || currentDayFromHook;
    };

    const scrollToDay = (day: number | string) => {
        console.log(day);
        // check if day is a number or a string 
        let index
        if (typeof day === 'string') {
            index = day === '<' ? daysInCalendar.length - 2 : 0;
        } else {
            index = day - 1;
        }

        flatListRef.current?.scrollToIndex({
            index: index,
            animated: true,
            viewPosition: 0.5
        });
    };

    const handleDayPress = (day: number) => {
        setCurrentDay(day);
        scrollToDay(day);
    };

    const getItemLayout = (_: any, index: number) => ({
        length: TOTAL_ITEM_WIDTH,
        offset: TOTAL_ITEM_WIDTH * index,
        index,
    });

    useEffect(() => {
        // Se il giorno corrente è disabilitato, trova il primo giorno disponibile
        if (isDayDisabled(
            daysInCalendar[currentDayFromHook - 1]?.dayOfWeekIndex,
            currentDayFromHook
        )) {
            const firstAvailableDay = findFirstAvailableDay();
            setCurrentDay(firstAvailableDay);
            setTimeout(() => scrollToDay(firstAvailableDay), 100);
        } else {
            setTimeout(() => scrollToDay(currentDayFromHook), 100);
        }
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => handleDayPress(item.day)}
            disabled={isDayDisabled(item.dayOfWeekIndex, item.day)}
            style={[
                styles.dayButtonContainer,
                isDayDisabled(item.dayOfWeekIndex, item.day) && styles.dayButtonDisabled
            ]}
        >
            <ThemedView
                style={[
                    styles.dayButton,
                    item.day === currentDay && styles.selectedDay
                ]}
            >
                <ThemedText
                    type="subtitle"
                    style={[
                        styles.dayText,
                        item.day === currentDay && styles.selectedDayText
                    ]}
                >
                    {item.day}
                </ThemedText>
                <ThemedText
                    type="default"
                    style={[
                        styles.dayTextDayOfWeek,
                        item.day === currentDay && styles.selectedDayTextDayOfWeek
                    ]}
                >
                    {item.dayOfWeek}
                </ThemedText>
            </ThemedView>
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView style={styles.calendar}>
            <FlatList
                ref={flatListRef}
                data={[
                    // {
                    //     day: '<',
                    //     dayOfWeekIndex: 5,
                    //     dayOfWeek: 'prev'
                    // },
                    ...daysInCalendar, {
                        day: '>',
                        dayOfWeekIndex: 5,
                        dayOfWeek: 'next'
                    }]}
                renderItem={renderItem}
                keyExtractor={item => item.day.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                snapToInterval={TOTAL_ITEM_WIDTH}
                snapToAlignment="center"
                decelerationRate="fast"
                // contentContainerStyle={styles.scrollContent}
                // initialNumToRender={31}
                maxToRenderPerBatch={31}
                windowSize={31}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    calendar: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        height: 100,
        borderBottomWidth: 0.5,
        borderColor: Colors.light.tint,
        paddingBottom: 10,
        marginBottom: 10,
    },
    // scrollContent: {
    //     paddingHorizontal: (SCREEN_WIDTH - TOTAL_ITEM_WIDTH) / 2,
    // },
    dayButtonContainer: {
        width: ITEM_WIDTH,
        marginHorizontal: ITEM_MARGIN,
    },
    dayButton: {
        width: '100%',
        height: 75,
        borderWidth: 0.5,
        borderColor: Colors.light.tint,
        borderRadius: 10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.light.tint,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dayText: {
        textAlign: 'center'
    },
    dayTextDayOfWeek: {
        textAlign: 'center'
    },
    selectedDay: {
        backgroundColor: Colors.light.tint,
        borderWidth: 0.5,
    },
    selectedDayText: {
        color: 'white',
    },
    selectedDayTextDayOfWeek: {
        color: 'white',
    },
    dayButtonDisabled: {
        opacity: 0.5,
    }
});