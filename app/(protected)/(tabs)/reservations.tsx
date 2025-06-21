import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Alert, FlatList, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import HorizontalMonthSelector from "@/components/HorizontalMonthSelector";
import { formatDate, getDaysInMonth, getTotalWorkingDaysInMonth } from "@/constants/Calendar";
import StatBox from "@/components/StatBox";
import { getMonthStatus, isPast, isPastWithToday } from "@/hooks/useCalendar";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Book, useAppStore } from "@/store/app-store";
import { tabBarHeight } from "@/constants/Colors";

export default function Reservations() {
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    // const [currentMonthReservation, setCurrentMonthReservation] = useState<number>(new Date().getMonth());
    // const [currentYearReservation, setCurrentYearReservation] = useState<number>(new Date().getFullYear());
    // const colorScheme = useColorScheme();
    const errorColor = useThemeColor({}, 'error');
    const shadowColor = useThemeColor({}, 'cardShadow');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const backgroundColor = useThemeColor({}, 'background');
    const { montlyBooking, getMontlyBooking, currentMonthReservation, currentYearReservation, setCurrentMonthReservation, setCurrentYearReservation, removeBooking } = useAppStore()

    const handleRemoveBooking = async (bookingId: string) => {
        // confirm delete
        Alert.alert('Attenzione', 'Sei sicuro di voler eliminare questa prenotazione?', [
            {
                text: 'Annulla',
                style: 'cancel',
            },
            {
                text: 'Elimina',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await removeBooking(bookingId);
                    } catch (error) {
                        console.error(error);
                    }
                },
            },
        ]);
    };

    useEffect(() => {
        getMontlyBooking(currentYearReservation, currentMonthReservation)
    }, [currentMonthReservation])

    const handleSegmentedControlChange = (value: number) => {
        setSelectedIndex(value);
        if (value === 0) {
            setCurrentMonthReservation(new Date().getMonth() - 1)
            setCurrentYearReservation(new Date().getFullYear())
        } else if (value === 1) {
            setCurrentMonthReservation(new Date().getMonth())
            setCurrentYearReservation(new Date().getFullYear())
        }
        else {
            setCurrentMonthReservation(new Date().getMonth() + 1)
            setCurrentYearReservation(new Date().getFullYear())
        }

    }

    const setIndex = () => {
        const currentDate = new Date(currentYearReservation, currentMonthReservation, 1)
        currentDate.setHours(6, 0, 0, 0)
        const today = new Date()
        today.setHours(6, 0, 0, 0)
        // se l'anno è differente so già che è passato o futuro
        if (currentDate.getFullYear() < today.getFullYear()) {
            setSelectedIndex(0)
        } else if (currentDate.getFullYear() > today.getFullYear()) {
            setSelectedIndex(2)
        } else {
            // se l'anno è lo stesso controllo il mese
            if (currentDate.getMonth() < today.getMonth()) {
                setSelectedIndex(0)
            } else if (currentDate.getMonth() > today.getMonth()) {
                setSelectedIndex(2)
            } else {
                setSelectedIndex(1)
            }
        }
    }

    const handleNextMonth = () => {
        if (currentMonthReservation === 11) {
            setCurrentMonthReservation(0)
            setCurrentYearReservation(currentYearReservation + 1)
        } else {
            setCurrentMonthReservation(currentMonthReservation + 1)
        }
        setIndex()
    }

    const handlePreviousMonth = () => {
        if (currentMonthReservation === 0) {
            setCurrentMonthReservation(11)
            setCurrentYearReservation(currentYearReservation - 1)
        } else {
            setCurrentMonthReservation(currentMonthReservation - 1)
        }
        setIndex()
    }

    const renderItem = ({ item }: {
        item: Book
    }) => (
        <ThemedView style={[
            styles.reservationItem, { shadowColor: shadowColor },
            // ...(isPast(item.date) ? [styles.reservationItemPast] : [])
        ]}>
            <ThemedView style={styles.reservationInfo}>
                <ThemedText style={styles.dateText}>{formatDate(item.date, 'full')}</ThemedText>
                <ThemedView style={styles.roomInfoContainer}>
                    <ThemedText style={[styles.roomText, { color: secondaryTextColor }]}>{item.roomName}</ThemedText>
                    {/* <ThemedText style={styles.timeText}>{item.time}</ThemedText> */}
                </ThemedView>
            </ThemedView>
            {/* {!isPastWithToday(item.date) && (<TouchableOpacity
                onPress={() => handleRemoveBooking(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <MaterialIcons name="delete-outline" size={22} color={errorColor} />
            </TouchableOpacity>)} */}
            <TouchableOpacity
                onPress={() => handleRemoveBooking(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <MaterialIcons name="delete-outline" size={22} color={errorColor} />
            </TouchableOpacity>
        </ThemedView>
    );

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
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
                        selectedMonth={currentMonthReservation}
                        selectedYear={currentYearReservation}
                        onMonthChange={setCurrentMonthReservation}
                        onYearChange={setCurrentYearReservation}
                    />
                </ThemedView>
                {/* crea i box inerenti alle prenotazioni del mese selezionato */}
                <ThemedView style={styles.reservationsContainer}>
                    <StatBox number={getDaysInMonth(currentMonthReservation, currentYearReservation)} label="Tot" />
                    <StatBox number={getTotalWorkingDaysInMonth(currentMonthReservation, currentYearReservation)} label="Lavorati" />
                    <StatBox number={montlyBooking?.length || 0} label="Prenotati" />
                </ThemedView>
                {/* crea la lista delle prenotazioni */}
                <ThemedView style={styles.reservationsList}>
                    {montlyBooking && <FlatList
                        data={montlyBooking as Book[]}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <ThemedView style={styles.emptyListContainer}>
                                <ThemedText style={[
                                    styles.emptyListText,
                                    // ...(isPast(new Date()) ? [styles.reservationItemPast] : [])
                                ]} type="default">
                                    Nessuna prenotazione trovata
                                </ThemedText>
                                {/* <Image source={image} style={[styles.emptyListImage, ...(isPast(new Date()) ? [styles.reservationItemPast] : [])]} /> */}
                            </ThemedView>
                        }
                    />}
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
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
        // marginBottom: tabBarHeight
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
        marginRight: 6,
    },
    timeText: {
        fontSize: 13,
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