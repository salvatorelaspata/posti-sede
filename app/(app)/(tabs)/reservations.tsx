import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FlatList, StyleSheet } from "react-native";
import { useMemo, useState } from "react";
import HorizontalMonthSelector from "@/components/HorizontalMonthSelector";
import { formatDate, getDaysInMonth, getTotalWorkingDaysInMonth } from "@/constants/Calendar";
import StatBox from "@/components/StatBox";
import { Image } from "expo-image";
import { isPast } from "@/hooks/useCalendar";

export default function Reservations() {
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

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
        } else {
            if (currentMonth === 11) {
                setSelectedMonth(0)
                setSelectedYear(selectedYear + 1)
            } else {
                setSelectedMonth(currentMonth + 1)
            }
        }
    }

    const reservations = useMemo(() => {
        const date = new Date(selectedYear, selectedMonth, Math.floor(Math.random() * 30));
        return Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
            id: Math.random(),
            date: new Date(date.getFullYear(), date.getMonth(), Math.floor(Math.random() * 30)),
            roomName: 'Stanza ' + (Math.floor(Math.random() * 5) + 1),
        }));
    }, [selectedMonth, selectedYear]);

    const image = require('@/assets/404.png')

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="subtitle" style={styles.title}>Date disponibili</ThemedText>
            {/* segmented control per selezionare: passate o future */}
            <ThemedView style={styles.segmentedControlContainer}>
                <SegmentedControl
                    values={['Passate', 'Pianificate']}
                    selectedIndex={selectedIndex}
                    style={styles.segmentedControl}
                    onChange={(event) => handleSegmentedControlChange(event.nativeEvent.selectedSegmentIndex)}
                />
            </ThemedView>
            <ThemedView style={styles.monthSelectorContainer}>
                <HorizontalMonthSelector
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={(month) => {
                        setSelectedMonth(month)
                        if (isPast(new Date(selectedYear, selectedMonth, 1))) {
                            setSelectedIndex(0)
                        } else {
                            setSelectedIndex(1)
                        }
                    }}
                    onYearChange={(year) => {
                        setSelectedYear(year)
                        if (isPast(new Date(selectedYear, selectedMonth, 1))) {
                            setSelectedIndex(0)
                        } else {
                            setSelectedIndex(1)
                        }
                    }}
                />
            </ThemedView>
            {/* crea i box inerenti alle prenotazioni del mese selezionato */}
            <ThemedView style={styles.reservationsContainer}>
                <StatBox number={getDaysInMonth(selectedMonth, selectedYear)} label="totali" />
                <StatBox number={getTotalWorkingDaysInMonth(selectedMonth, selectedYear)} label="lavorativi" />
                <StatBox number={reservations.length} label="Prenotazioni" />
            </ThemedView>
            {/* crea la lista delle prenotazioni */}
            <ThemedView style={styles.reservationsList}>
                <FlatList
                    style={styles.flatList}
                    data={reservations}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={
                        <ThemedView style={styles.emptyListContainer}>
                            <ThemedText style={[styles.emptyListText, ...(isPast(new Date()) ? [styles.reservationItemPast] : [])]} type="default">Nessuna prenotazione trovata</ThemedText>
                            <Image source={image} style={[styles.emptyListImage, ...(isPast(new Date()) ? [styles.reservationItemPast] : [])]} />
                        </ThemedView>
                    }
                    renderItem={({ item }) => (
                        // se nel passato allora cambia colore
                        <ThemedView key={item.id} style={[styles.reservationItem, ...(isPast(item.date) ? [styles.reservationItemPast] : [])]}>
                            <ThemedText type="defaultSemiBold" style={styles.reservationDate}>{formatDate(item.date, 'full')}</ThemedText>
                            <ThemedText style={styles.reservationRoomName}>{item.roomName}</ThemedText>
                        </ThemedView>
                    )}
                />
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
    flatList: {
        width: '100%',
    },
    reservationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 16,
    },
    reservationDate: {},
    reservationRoomName: {},
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
    },
}); 