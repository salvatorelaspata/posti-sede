import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "../ThemedText";
import { MaterialIcons } from "@expo/vector-icons";

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
    selectedMonth: Date;
    selectedYear: number;
    onMonthChange: (date: Date) => void;
    attendance: any[];
}

export default function Calendar({ selectedMonth, selectedYear, onMonthChange, attendance }: CalendarProps) {
    const dates = getDatesInMonth(selectedMonth);
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    dates.forEach((date) => {
        if (currentWeek.length === 0 && date.getDay() !== 0) {
            for (let i = 0; i < date.getDay(); i++) {
                currentWeek.push(new Date());
            }
        }
        currentWeek.push(date);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return (
        <ThemedView style={styles.adminCalendarContainer}>
            <ThemedView style={styles.monthSelector}>
                <TouchableOpacity onPress={() => {
                    const newDate = new Date(selectedMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    onMonthChange(newDate);
                }}>
                    <MaterialIcons name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <ThemedText style={styles.monthText}>
                    {selectedMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}
                </ThemedText>
                <TouchableOpacity onPress={() => {
                    const newDate = new Date(selectedMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
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


                            return (
                                <TouchableOpacity
                                    key={dateIndex}
                                    style={styles.calendarCell}
                                    onPress={() => {
                                        if (attendance) {
                                            // setSelectedDayAttendance({
                                            //   count: attendance.count,
                                            //   people: attendance.people
                                            // });
                                            // setShowAttendanceModal(true);
                                        }
                                    }}
                                >
                                    <ThemedText style={styles.calendarDate}>{date.getDate()}</ThemedText>
                                    {attendance && (
                                        <ThemedView style={styles.attendanceCount}>
                                            <ThemedText style={styles.attendanceCountText}>{attendance.count}</ThemedText>
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