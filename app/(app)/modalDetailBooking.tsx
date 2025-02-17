import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useLocalSearchParams } from "expo-router";
import { useAdminStore } from "@/store/admin-store";
import { FlatList } from "react-native";
export default function ModalDetailBooking() {
    const { employee } = useLocalSearchParams();
    const { attendance } = useAdminStore();
    const employeeAttendance = attendance.find((attendance) => attendance.id === employee);
    console.log(employeeAttendance);
    return <ThemedSafeAreaView style={{ flex: 1 }}  >
        <ThemedView style={{ flex: 1, padding: 16 }}>
            <ThemedText>
                Dettagli Prenotazione {employeeAttendance?.employeeName}
            </ThemedText>
            <ThemedView style={{ flex: 1 }}>
                <ThemedText>
                    Prenotazioni ({employeeAttendance?.days.length})
                </ThemedText>
                <FlatList
                    data={employeeAttendance?.days}
                    renderItem={({ item }) => (
                        <ThemedText>{item.toString() ?? 'Nessuna prenotazione'}</ThemedText>
                    )}
                />
            </ThemedView>
        </ThemedView>
    </ThemedSafeAreaView >
}
