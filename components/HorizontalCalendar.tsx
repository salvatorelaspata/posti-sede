import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useEffect, useRef } from "react";
import { Colors } from "@/constants/Colors";
import {
    GestureHandlerRootView,
    FlatList,
    TouchableOpacity,
} from 'react-native-gesture-handler';
import { useAppStore } from "@/store/app-store";
import { Day, daysInCalendar, isDayDisabled } from "@/hooks/useCalendar";

const ITEM_WIDTH = 65;
const ITEM_MARGIN = 5;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + (ITEM_MARGIN * 2);

interface HorizontalCalendarProps { }

export default function HorizontalCalendar({ }: HorizontalCalendarProps) {
    const { currentYear, currentMonth, currentDay, setCurrentDate } = useAppStore();
    const flatListRef = useRef<FlatList<any>>(null);

    // const findFirstAvailableDay = () => {
    //     const availableDay = daysInCalendar(currentMonth).find(item =>
    //         !isDayDisabled(item.dayOfWeekIndex, item.day)
    //     );
    //     return availableDay?.day || currentDayFromHook;
    // };

    const scrollToDay = (day: number) => {
        flatListRef.current?.scrollToIndex({
            index: day,
            animated: true,
            viewPosition: 0.5
        });
    };

    const handleDayPress = (date: Date) => {
        setCurrentDate(date);
        const day = date.getDay() + 1;
        scrollToDay(15);
    };

    const getItemLayout = (_: any, index: number) => ({
        length: TOTAL_ITEM_WIDTH,
        offset: TOTAL_ITEM_WIDTH * index,
        index,
    });

    useEffect(() => {
        // if (isDayDisabled(new Date(currentYear, currentMonth, currentDay))) {
        //     setCurrentDate(new Date());
        //     setTimeout(() => scrollToDay(15), 100);
        // } else {
        setTimeout(() => scrollToDay(15), 100);
        // }
    }, []);

    const renderItem = ({ item }: { item: Day }) => (
        <TouchableOpacity
            onPress={() => handleDayPress(item.d)}
            disabled={isDayDisabled(item.d)}
            style={[styles.dayButtonContainer, isDayDisabled(item.d) && styles.dayButtonDisabled]}
        >
            <ThemedView style={[styles.dayButton, item.day === currentDay && styles.selectedDay]}>
                <ThemedText
                    type="subtitle"
                    style={[styles.dayText, item.day === currentDay && styles.selectedDayText]}
                >
                    {item.day}
                    {/* {item.d.toISOString()} */}
                </ThemedText>
                <ThemedText
                    type="default"
                    style={[styles.dayTextDayOfWeek, item.day === currentDay && styles.selectedDayTextDayOfWeek]}
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
                data={daysInCalendar(new Date(currentYear, currentMonth, currentDay))}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                snapToInterval={TOTAL_ITEM_WIDTH}
                snapToAlignment="center"
                decelerationRate="fast"
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