import { StyleSheet, FlatList, View, Pressable } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAdminStore } from "@/store/admin-store";
import { useRouter } from "expo-router";
export default function Employee() {
    const { attendance } = useAdminStore();
    const router = useRouter();

    // colors
    const cardBackground = useThemeColor({}, 'cardBackground');
    const tintColor = useThemeColor({}, 'tint');
    const secondaryText = useThemeColor({}, 'secondaryText');
    const cardShadow = useThemeColor({}, 'cardShadow');

    // TODO
    const user = {
        id: '16b2681e-b944-402e-b734-b87251c6f1fe', // Replace with actual user ID from your auth context or store
    }

    return (
        <FlatList
            keyExtractor={(item) => item.id}
            data={attendance}
            style={{ flex: 1, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <Pressable
                    style={[
                        styles.employeeCard,
                        {
                            backgroundColor: user?.id === item.userId ? tintColor + '20' : cardBackground,
                            shadowColor: cardShadow,
                            borderColor: user?.id === item.userId ? tintColor : 'transparent',
                            borderWidth: user?.id === item.userId ? 1 : 0,
                        }
                    ]}
                    onPress={() => {
                        router.push({
                            pathname: '/(protected)/modalDetailBooking',
                            params: { employee: item.id }
                        })
                    }}
                >
                    <View style={styles.employeeInfo}>
                        <ThemedText style={styles.employeeName}>{item.employeeName}</ThemedText>
                        <ThemedText style={[styles.employeeDepartment, { color: secondaryText }]}>
                            {item.employeeDepartment}
                        </ThemedText>
                    </View>
                    <ThemedView style={[styles.presenceBadge, { backgroundColor: tintColor + '20' }]}>
                        <ThemedText style={[styles.presenceText, { color: tintColor }]}>{item.days.length}</ThemedText>
                        <ThemedText style={[styles.presenceLabel, { color: tintColor }]}>presenze</ThemedText>
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
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        marginHorizontal: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    employeeInfo: {
        flex: 1,
    },
    employeeName: {
        fontSize: 16,
        fontWeight: '600',
    },
    employeeDepartment: {
        marginTop: 4,
        fontSize: 14,
    },
    presenceBadge: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    presenceText: {
        fontSize: 18,
        fontWeight: '600',
    },
    presenceLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
})
