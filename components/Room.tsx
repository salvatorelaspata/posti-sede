import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Room } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppStore } from "@/store/app-store";

interface RoomComponentProps {
    room: Room & { available: number; capacity: number };
}

export const RoomComponent = ({ room }: RoomComponentProps) => {
    const bgColor = useThemeColor({}, 'cardBackground');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'border');
    const successColor = useThemeColor({}, 'success');
    const errorColor = useThemeColor({}, 'error');
    const textWhite = useThemeColor({}, 'whiteText');

    const { room: _room, setRoom, booked } = useAppStore();

    const handleRoomPress = (_room: Room) => {
        setRoom(_room);
        if (booked) {
            return Alert.alert('Attenzione', 'Hai già una prenotazione per questo giorno nella stanza: ' + booked.roomName);
        }
    }

    return (
        <TouchableOpacity
            key={room.id}
            style={[
                styles.roomCard,
                { backgroundColor: bgColor, borderColor },
                room.id === _room?.id && { borderColor: Colors.light.tint },
                booked?.roomId === room.id && { borderColor: successColor, shadowColor: successColor },
            ]}
            onPress={() => handleRoomPress(room)}
            disabled={!!booked}
        >
            <ThemedView style={styles.roomHeader}>
                <ThemedText type="defaultSemiBold">{room.name}</ThemedText>
                <ThemedView style={styles.capacityBadge}>
                    <ThemedText type="smallSemiBold" style={{ color: textWhite }}>
                        {room.capacity - room.available}/{room.capacity}
                    </ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.roomInfo}>
                <FontAwesome5 name="users" size={15} color={tintColor} />
                <ThemedText type="small" style={[(room.available === 0) && { color: errorColor }]}>
                    {room.available} posti disponibili {booked?.roomId === room.id && ' - ✅ Prenotata'}
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.progressContainer}>
                <ThemedView
                    style={[
                        styles.progressBar,
                        { width: `${(room.available / room.capacity) * 100}%`, backgroundColor: tintColor },
                    ]}
                />
            </ThemedView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    roomCard: {
        borderRadius: 12,
        padding: 8,
        marginHorizontal: 16,
        marginVertical: 4,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    roomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
    },
    capacityBadge: {
        backgroundColor: Colors.light.tint,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#eee',
        borderRadius: 2,
        marginVertical: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    }
});