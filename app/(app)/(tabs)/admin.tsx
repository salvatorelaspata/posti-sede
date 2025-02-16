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
import { getAttendance } from "@/db/api";

export default function Admin() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendance, setAttendance] = useState<any[]>([]);

    useEffect(() => {
        const fetchAttendance = async () => {
            const attendance = await getAttendance(selectedMonth, selectedYear);
            setAttendance(attendance);
        };
        fetchAttendance();
    }, [selectedMonth, selectedYear]);

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
                    <StatBox number={85} label="Occupazione" />
                    <StatBox number={45} label="Prenotazioni" />
                    <StatBox number={12} label="Sale" />
                </ThemedView>
                <ThemedView style={styles.monthSelectorContainer}>
                    <HorizontalMonthSelector
                        handleNextMonth={() => { }}
                        handlePreviousMonth={() => { }}
                        selectedMonth={selectedMonth.getMonth()}
                        selectedYear={selectedYear}
                        onMonthChange={(month) => {
                            setSelectedMonth(new Date(selectedYear, month, 1));
                        }}
                        onYearChange={setSelectedYear}
                    />
                </ThemedView>
                {selectedIndex === 0 ?
                    <Calendar
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={setSelectedMonth}
                        attendance={attendance}
                    /> : <Employee attendance={attendance} />}
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
