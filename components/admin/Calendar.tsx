import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "../ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { useAdminStore } from "@/store/admin-store";

const getDatesInMonth = (date: Date) => {
    const dates: Date[] = [];
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i));
    }
    return dates;
};

interface CalendarProps {
    onMonthChange: (date: Date) => void;
}

export default function Calendar({ onMonthChange }: CalendarProps) {
    const { attendance } = useAdminStore();
    const { selectedMonth, selectedYear } = useAdminStore();
    const dates = getDatesInMonth(new Date(selectedYear, selectedMonth, 1));

    const weeks: Date[][] = [];
    let currentWeek: (Date | null)[] = [];

    dates.forEach((date) => {
        if (currentWeek.length === 0 && date.getDay() !== 0) {
            for (let i = 0; i < date.getDay(); i++) {
                currentWeek.push(null);
            }
        }
        currentWeek.push(date);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek.filter(date => date !== null) as Date[]);
            currentWeek = [];
        }
    });

    if (currentWeek.length > 0) {
        weeks.push(currentWeek.filter(date => date !== null) as Date[]);
    }

    return (
        <ThemedView style={styles.adminCalendarContainer}>
            <ThemedView style={styles.monthSelector}>
                <TouchableOpacity onPress={() => {
                    const newDate = new Date(selectedYear, selectedMonth - 1, 1);
                    onMonthChange(newDate);
                }}>
                    <MaterialIcons name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <ThemedText style={styles.monthText}>
                    {new Date(selectedYear, selectedMonth, 1).toLocaleString('it-IT', { month: 'long', year: 'numeric' })}
                </ThemedText>
                <TouchableOpacity onPress={() => {
                    const newDate = new Date(selectedYear, selectedMonth + 1, 1);
                    onMonthChange(newDate);
                }}>
                    <MaterialIcons name="chevron-right" size={24} color="#333" />
                </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.calendarGrid}>
                {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
                    <ThemedText key={day} style={styles.calendarHeader}>{day}</ThemedText>
                ))}
                {weeks.map((week, weekIndex) => (
                    <ThemedView key={weekIndex} style={styles.calendarRow}>
                        {week.map((date, dateIndex) => {
                            if (!date) return <ThemedView key={`empty-${dateIndex}`} style={styles.calendarCell} />;
                            const dateString = date.toISOString().split('T')[0];
                            const attendanceCount = attendance?.filter(a => a.date === dateString).length || 0;
                            return (
                                <TouchableOpacity
                                    key={dateIndex}
                                    style={styles.calendarCell}
                                    onPress={() => {
                                        if (attendanceCount > 0) {
                                            console.log('Attendance for', dateString);
                                        }
                                    }}
                                >
                                    <ThemedText style={styles.calendarDate}>{date.getDate()}</ThemedText>
                                    {attendanceCount > 0 && (
                                        <ThemedView style={styles.attendanceCount}>
                                            <ThemedText style={styles.attendanceCountText}>{attendanceCount}</ThemedText>
                                        </ThemedView>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ThemedView>
                ))}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    adminCalendarContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flex: 1,
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthText: {
        fontSize: 18,
        fontWeight: '600',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarHeader: {
        width: '14.28%',
        textAlign: 'center',
        paddingVertical: 8,
        fontSize: 14,
        color: '#666',
    },
    calendarRow: {
        flexDirection: 'row',
        width: '100%',
    },
    calendarCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#eee',
    },
    calendarDate: {
        fontSize: 16,
    },
    attendanceCount: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#E3F2FD',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attendanceCountText: {
        fontSize: 12,
        color: '#1976D2',
    },
})