import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import HorizontalMonthSelector from "@/components/HorizontalMonthSelector";
import { formatDate, getDaysInMonth, getTotalWorkingDaysInMonth } from "@/constants/Calendar";
import StatBox from "@/components/StatBox";
import { getMonthStatus, isPast, isPastWithToday } from "@/hooks/useCalendar";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppStore } from "@/store/app-store";

export default function Reservations() {
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const errorColor = useThemeColor({}, 'error');
    const shadowColor = useThemeColor({}, 'cardShadow');
    const { booking, removeBooking } = useAppStore()

    const handleSegmentedControlChange = (value: number) => {
        setSelectedIndex(value);
        const currentMonth = new Date().getMonth()

        if (value === 0) {
            if (currentMonth === 0) {
                setSelectedMonth(11)
                setSelectedYear(selectedYear - 1)
            } else {
                setSelectedMonth(currentMonth - 1)
            }
        } else if (value === 1) {
            setSelectedMonth(new Date().getMonth())
            setSelectedYear(new Date().getFullYear())
        } else {
            if (currentMonth === 11) {
                setSelectedMonth(0)
                setSelectedYear(selectedYear + 1)
            } else {
                setSelectedMonth(currentMonth + 1)
            }
        }
    }

    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0)
            setSelectedYear(selectedYear + 1)
        } else {
            setSelectedMonth(selectedMonth + 1)
        }
        setSelectedIndex(getMonthStatus(new Date(selectedYear, selectedMonth, 1)))

    }

    const handlePreviousMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11)
            setSelectedYear(selectedYear - 1)
        } else {
            setSelectedMonth(selectedMonth - 1)
        }
        setSelectedIndex(getMonthStatus(new Date(selectedYear, selectedMonth, 1)))
    }

    const renderItem = ({ item }: {
        item: {
            id: string;
            date: Date;
            roomName: string;
            time: string;
        }
    }) => (
        <ThemedView style={[styles.reservationItem, { shadowColor: shadowColor }, ...(isPast(item.date) ? [styles.reservationItemPast] : [])]}>
            <ThemedView style={styles.reservationInfo}>
                <ThemedText style={styles.dateText}>{formatDate(item.date, 'full')}</ThemedText>
                <ThemedView style={styles.roomInfoContainer}>
                    <ThemedText style={styles.roomText}>{item.roomName}</ThemedText>
                    <ThemedText style={styles.timeText}>{item.time}</ThemedText>
                </ThemedView>
            </ThemedView>
            {!isPastWithToday(item.date) && (<TouchableOpacity
                onPress={() => removeBooking(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <MaterialIcons name="delete-outline" size={22} color={errorColor} />
            </TouchableOpacity>)}
        </ThemedView>
    );

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="subtitle" style={styles.title}>Date disponibili</ThemedText>
            {/* segmented control per selezionare: passate o future */}
            <ThemedView style={styles.segmentedControlContainer}>
                <SegmentedControl
                    values={['Passate', 'Oggi', 'Pianificate']}
                    selectedIndex={selectedIndex}
                    style={styles.segmentedControl}
                    onChange={(event) => handleSegmentedControlChange(event.nativeEvent.selectedSegmentIndex)}
                />
            </ThemedView>
            <ThemedView style={styles.monthSelectorContainer}>
                <HorizontalMonthSelector
                    handleNextMonth={handleNextMonth}
                    handlePreviousMonth={handlePreviousMonth}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                />
            </ThemedView>
            {/* crea i box inerenti alle prenotazioni del mese selezionato */}
            <ThemedView style={styles.reservationsContainer}>
                <StatBox number={getDaysInMonth(selectedMonth, selectedYear)} label="lavorativi/" />
                <StatBox number={getTotalWorkingDaysInMonth(selectedMonth, selectedYear)} label="lavorativi" />
                <StatBox number={booking?.length || 0} label="Prenotazioni" />
            </ThemedView>
            {/* crea la lista delle prenotazioni */}
            <ThemedView style={styles.reservationsList}>
                {booking && <FlatList
                    data={booking as any}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <ThemedView style={styles.emptyListContainer}>
                            <ThemedText style={[styles.emptyListText, ...(isPast(new Date()) ? [styles.reservationItemPast] : [])]} type="default">Nessuna prenotazione trovata</ThemedText>
                            {/* <Image source={image} style={[styles.emptyListImage, ...(isPast(new Date()) ? [styles.reservationItemPast] : [])]} /> */}
                        </ThemedView>
                    }
                />}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    segmentedControl: {
        width: '100%',
        marginVertical: 16,
    },
    segmentedControlContainer: {
        width: '100%',
        paddingHorizontal: 16,
    },
    monthSelectorContainer: {
        paddingHorizontal: 16,
    },
    reservationsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    reservationsList: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',

    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 90,
    },
    reservationItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    reservationInfo: {},
    dateText: {
        fontSize: 14,
        marginBottom: 4,
    },
    roomInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    roomText: {
        fontSize: 13,
        color: '#6c757d',
        marginRight: 6,
    },
    timeText: {
        fontSize: 13,
        color: '#6c757d',
        fontWeight: '500',
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    emptyListText: {
        padding: 16,
    },
    emptyListImage: {
        width: 300,
        height: 300,
    },
    reservationItemPast: {
        opacity: 0.7,
    }
}); 