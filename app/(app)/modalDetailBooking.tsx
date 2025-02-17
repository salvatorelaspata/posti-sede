import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { router, useLocalSearchParams } from "expo-router";
import { useAdminStore } from "@/store/admin-store";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
export default function ModalDetailBooking() {
    const { employee } = useLocalSearchParams();
    const { attendance } = useAdminStore();
    const employeeAttendance = attendance.find((attendance) => attendance.id === employee);
    return <ThemedSafeAreaView style={{ flex: 1 }}  >
        <ThemedView style={{ flex: 1, padding: 16 }}>
            <ThemedText type="title" style={{ marginVertical: 16 }}>
                Dettagli Prenotazione
            </ThemedText>
            <ThemedText type="subtitle">
                {employeeAttendance?.employeeName}
            </ThemedText>
            <ThemedView style={{ flex: 1, marginVertical: 16 }}>
                <ThemedText type="defaultSemiBold">
                    Prenotazioni ({employeeAttendance?.days.length})
                </ThemedText>
                <FlatList
                    style={{ flex: 1, marginTop: 16 }}
                    data={employeeAttendance?.days}
                    renderItem={({ item }) => (
                        <ThemedText type="defaultSemiBold" style={styles.date}>{item ?? 'Nessuna prenotazione'}</ThemedText>
                    )}
                />
            </ThemedView>
            {/* close button */}
            <Pressable onPress={() => router.back()}>
                <ThemedText type="link" style={{ textAlign: 'center' }}>
                    Chiudi
                </ThemedText>
            </Pressable>
        </ThemedView>
    </ThemedSafeAreaView >
}

const styles = StyleSheet.create({
    date: {
        backgroundColor: Colors.light.tint,
        color: Colors.light.whiteText,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 8,
        borderRadius: 4,
        paddingHorizontal: 16,
        marginBottom: 8
    }
})