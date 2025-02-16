import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FlatList, StyleSheet } from "react-native";
import { useLayoutEffect, useMemo, useState } from "react";
import HorizontalMonthSelector from "@/components/HorizontalMonthSelector";
import { formatDate, getDaysInMonth, getTotalWorkingDaysInMonth } from "@/constants/Calendar";
import StatBox from "@/components/StatBox";
import { Image } from "expo-image";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Booking, User } from "@/types";
import { getMonthUserBookings, deleteBooking } from "@/db/api";
import { getMonthStatus, isPast } from "@/hooks/useCalendar";
import { Ionicons } from "@expo/vector-icons";

interface GenericObject {
    [key: string]: any;
}

type BookingWithAny = Booking & GenericObject;


export default function Reservations() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [bookings, setBookings] = useState<BookingWithAny[]>([]);
    useLayoutEffect(() => {
        // Reservations
        if (!user) return router.replace('/login');
    }, [user]);

    useEffect(() => {
        const fetchBookings = async () => {
            // Start of Selection
            if (user) {
                const bookingsData = await getMonthUserBookings(user.id ?? '', selectedMonth, selectedYear);

                const formattedBookings: BookingWithAny[] = bookingsData.map((item) => ({
                    ...item.bookings,
                    room: item.rooms,
                    date: new Date(item?.bookings?.date ?? ''),
                }));
                setBookings(formattedBookings);
            }
        }
        fetchBookings();
    }, [user, selectedMonth, selectedYear]);

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

    const handleDeleteBooking = async (bookingId: string) => {
        try {
            await deleteBooking(bookingId);
            // Aggiorna la lista delle prenotazioni dopo la cancellazione
            setBookings(bookings.filter(booking => booking.id !== bookingId));
        } catch (error) {
            console.error("Errore durante la cancellazione della prenotazione:", error);
        }
    };

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
                <StatBox number={getDaysInMonth(selectedMonth, selectedYear)} label="totali" />
                <StatBox number={getTotalWorkingDaysInMonth(selectedMonth, selectedYear)} label="lavorativi" />
                <StatBox number={bookings.length} label="Prenotazioni" />
            </ThemedView>
            {/* crea la lista delle prenotazioni */}
            <ThemedView style={styles.reservationsList}>
                <FlatList
                    style={styles.flatList}
                    data={bookings}
                    keyExtractor={(item) => item.id?.toString() ?? ''}
                    ListEmptyComponent={
                        <ThemedView style={styles.emptyListContainer}>
                            <ThemedText style={[styles.emptyListText, ...(isPast(new Date()) ? [styles.reservationItemPast] : [])]} type="default">Nessuna prenotazione trovata</ThemedText>
                            {/* <Image source={image} style={[styles.emptyListImage, ...(isPast(new Date()) ? [styles.reservationItemPast] : [])]} /> */}
                        </ThemedView>
                    }
                    renderItem={({ item }) => (
                        <ThemedView key={item.id} style={[styles.reservationItem, ...(isPast(item.date) ? [styles.reservationItemPast] : [])]}>
                            <ThemedText type="defaultSemiBold" style={styles.reservationDate}>{formatDate(item.date, 'full')}</ThemedText>
                            <ThemedText style={styles.reservationRoomName}>{item.room.name}</ThemedText>
                            {!isPast(item.date) && (
                                <ThemedView style={styles.deleteButton}>
                                    <Ionicons name="trash-outline" size={24} color="red" />
                                </ThemedView>
                            )}
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
    deleteButton: {
        color: 'red',
        marginLeft: 10,
    },
}); 