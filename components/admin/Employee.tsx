import { StyleSheet, FlatList, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useAuthStore } from "@/store/auth-store";
import { useAdminStore } from "@/store/admin-store";

export default function Employee() {
    const { user } = useAuthStore();
    const { attendance } = useAdminStore();
    return (
        <FlatList
            data={attendance}
            renderItem={({ item }) => (
                <ThemedView key={item.id} style={[styles.employeeCard, { backgroundColor: user?.id === item.userId ? '#E3F2FD' : '#fff' }]}>
                    <View style={styles.employeeInfo}>
                        <ThemedText style={styles.employeeName}>{item.employeeName}</ThemedText>
                        <ThemedText style={styles.employeeDepartment}>{item.employeeDepartment}</ThemedText>
                    </View>
                    <ThemedView style={styles.presenceBadge}>
                        <ThemedText style={styles.presenceText}>{item.days.size}</ThemedText>
                        <ThemedText style={styles.presenceLabel}>presenze</ThemedText>
                    </ThemedView>
                </ThemedView>
            )}
        />
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
