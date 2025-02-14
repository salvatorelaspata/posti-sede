import { StyleSheet, ScrollView } from "react-native";
import { Employee as EmployeeType } from "@/types";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

const employees: EmployeeType[] = [
    { id: 1, name: 'Marco Rossi', department: 'Sviluppo', presences: 15 },
    { id: 2, name: 'Laura Bianchi', department: 'Design', presences: 18 },
    { id: 3, name: 'Giuseppe Verdi', department: 'Marketing', presences: 12 },
    { id: 4, name: 'Anna Neri', department: 'HR', presences: 20 },
];

export default function Employee() {
    return (
        <ScrollView style={styles.employeeList}>
            {employees.map((employee) => (
                <ThemedView key={employee.id} style={styles.employeeCard}>
                    <ThemedView style={styles.employeeInfo}>
                        <ThemedText style={styles.employeeName}>{employee.name}</ThemedText>
                        <ThemedText style={styles.employeeDepartment}>{employee.department}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.presenceBadge}>
                        <ThemedText style={styles.presenceText}>{employee.presences}</ThemedText>
                        <ThemedText style={styles.presenceLabel}>presenze</ThemedText>
                    </ThemedView>
                </ThemedView>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    employeeList: {
        padding: 8,
    },
    employeeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    employeeInfo: {
        flex: 1,
    },
    employeeName: {
        fontSize: 16,
        fontWeight: '600',
    },
    employeeDepartment: {
        color: '#666',
        marginTop: 4,
    },
    presenceBadge: {
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    presenceText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1976D2',
    },
    presenceLabel: {
        fontSize: 12,
        color: '#1976D2',
    },
})
