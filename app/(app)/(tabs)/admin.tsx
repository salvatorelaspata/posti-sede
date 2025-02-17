import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useLayoutEffect, useState } from 'react';
import Calendar from "@/components/admin/Calendar";
import Employee from "@/components/admin/Employee";
import StatBox from "@/components/StatBox";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import HorizontalMonthSelector from "@/components/HorizontalMonthSelector";
import { useAdminStore } from "@/store/admin-store";
import { useAppStore } from "@/store/app-store";

export default function Admin() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear, fetchStats, stats, fetchAttendance } = useAdminStore();
    const { location } = useAppStore();

    useEffect(() => {
        fetchAttendance(location?.id ?? '', selectedMonth, selectedYear);
        fetchStats(location?.id ?? '', selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear, location]);

    useLayoutEffect(() => {
        // Admin
        if (!user) return router.replace('/login');
    }, [user]);

    return (
        <ThemedView style={styles.adminContainer}>
            <ThemedView>
                <SegmentedControl
                    values={['Calendario Presenze', 'Dettaglio Dipendenti']}
                    selectedIndex={selectedIndex}
                    onChange={(event) => {
                        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                    }}
                    style={styles.segmentedControl}
                />
            </ThemedView>
            <ThemedView style={styles.adminContainer}>

                <ThemedView style={styles.statsContainer}>
                    <StatBox number={`${stats.occupancy}%`} label="Occupazione" />
                    <StatBox number={stats.bookings} label="Prenotazioni" />
                    <StatBox number={stats.rooms} label="Stanze" />
                </ThemedView>
                <ThemedView style={styles.monthSelectorContainer}>
                    <HorizontalMonthSelector
                        handleNextMonth={() => {
                            setSelectedMonth(selectedMonth + 1);
                        }}
                        handlePreviousMonth={() => {
                            setSelectedMonth(selectedMonth - 1);
                        }}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={(month) => {
                            setSelectedMonth(month);
                        }}
                        onYearChange={setSelectedYear}
                    />
                </ThemedView>
                {selectedIndex === 0 ?
                    <Calendar onMonthChange={(date) => { setSelectedMonth(date.getMonth()) }} /> :
                    <Employee />
                }
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    adminContainer: {
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: '#fff',

    },
    segmentedControl: {
        margin: 16,
    },
    monthSelectorContainer: {
        paddingHorizontal: 16,
    },
});
