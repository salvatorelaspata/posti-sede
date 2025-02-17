import { StyleSheet, FlatList, View, Pressable } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useAuthStore } from "@/store/auth-store";
import { useAdminStore } from "@/store/admin-store";
import { useRouter } from "expo-router";
export default function Employee() {
    const { user } = useAuthStore();
    const { attendance } = useAdminStore();
    const router = useRouter();
    return (
        <FlatList
            data={attendance}
            renderItem={({ item }) => (
                <ThemedView key={item.id} style={[styles.employeeCard, { backgroundColor: user?.id === item.userId ? '#E3F2FD' : '#fff' }]}>
                    <View style={styles.employeeInfo}>
                        <ThemedText style={styles.employeeName}>{item.employeeName}</ThemedText>
                        <ThemedText style={styles.employeeDepartment}>{item.employeeDepartment}</ThemedText>
                    </View>
                    <Pressable onPress={() => {
                        router.push({
                            pathname: '/(app)/modalDetailBooking',
                            params: { employee: item.id }
                        })
                    }} style={styles.presenceBadge}>
                        <ThemedText style={styles.presenceText}>{item.days.length}</ThemedText>
                        <ThemedText style={styles.presenceLabel}>presenze</ThemedText>
                    </Pressable>
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
