import { StyleSheet, FlatList, View, Pressable } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useUser } from "@clerk/clerk-expo";
import { useAdminStore } from "@/store/admin-store";
import { useRouter } from "expo-router";
export default function Employee() {
    const { user } = useUser();
    const { attendance } = useAdminStore();
    const router = useRouter();
    return (
        <FlatList
            keyExtractor={(item) => item.id}
            data={attendance}
            style={{ flex: 1, paddingTop: 16 }}
            renderItem={({ item }) => (
                <Pressable

                    style={[styles.employeeCard, { backgroundColor: user?.id === item.userId ? '#E3F2FD' : '#fff' }]}
                    onPress={() => {
                        router.push({
                            pathname: '/(app)/modalDetailBooking',
                            params: { employee: item.id }
                        })
                    }}>
                    <View style={styles.employeeInfo}>
                        <ThemedText style={styles.employeeName}>{item.employeeName}</ThemedText>
                        <ThemedText style={styles.employeeDepartment}>{item.employeeDepartment}</ThemedText>
                    </View>
                    <ThemedView style={styles.presenceBadge}>
                        <ThemedText style={styles.presenceText}>{item.days.length}</ThemedText>
                        <ThemedText style={styles.presenceLabel}>presenze</ThemedText>
                    </ThemedView>
                </Pressable>
            )}

        />
    )
}

const styles = StyleSheet.create({
    employeeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        // shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 16,
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
