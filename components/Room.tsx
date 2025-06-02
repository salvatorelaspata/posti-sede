import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Room } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAppStore } from "@/store/app-store";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

interface RoomComponentProps {
    room: Room & { available: number; capacity: number };
}

export const RoomComponent = ({ room }: RoomComponentProps) => {
    const colorScheme = useColorScheme();
    const bgColor = useThemeColor({}, 'cardBackground');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'border');
    const successColor = useThemeColor({}, 'success');
    const errorColor = useThemeColor({}, 'error');
    const textWhite = useThemeColor({}, 'whiteText');
    const cardShadow = useThemeColor({}, 'cardShadow');

    const { room: _room, setRoom, booked } = useAppStore();

    const handleRoomPress = (_room: Room) => {
        if (booked) {
            return Alert.alert('Attenzione', 'Hai già una prenotazione per questo giorno nella stanza: ' + booked.roomName);
        } else if (room.reserved) {
            return Alert.alert('Attenzione', 'La stanza è riservata');
        }
        setRoom(_room);
    }

    return (
        <TouchableOpacity
            key={room.id}
            style={[
                styles.roomCard,
                {
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    shadowColor: cardShadow,
                },
                room.id === _room?.id && { borderColor: tintColor },
                booked?.roomId === room.id && { borderColor: successColor, shadowColor: successColor },
            ]}
            onPress={() => handleRoomPress(room)}
            disabled={!!booked}
        >
            <ThemedView style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 12 }}>
                <ThemedView style={{ flex: 1, padding: 8, borderRadius: 12 }}>
                    <ThemedView style={styles.roomHeader}>
                        <ThemedText type="defaultSemiBold">{room.name}</ThemedText>
                        <ThemedView style={[styles.capacityBadge, { backgroundColor: tintColor }]}>
                            <ThemedText type="smallSemiBold" style={{ color: textWhite }}>
                                {room.capacity - room.available}/{room.capacity}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <ThemedView style={styles.roomInfo}>
                        <FontAwesome5 name="users" size={15} color={tintColor} />
                        <ThemedText type="small" style={[(room.available === 0) && { color: errorColor }]}>
                            {room.available} posti disponibili
                            {booked?.roomId === room.id && ' - ✅ Prenotata'}
                            {room.reserved && ' - 🛑 Riservata'}
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
                </ThemedView>
                <Image source={{ uri: room.image }} style={{
                    width: 100, height: 100,
                    // borderTopRightRadius: 12,
                    // borderBottomRightRadius: 12,
                    borderRadius: 12,
                    margin: 8,
                    backgroundColor: tintColor
                }} />
                {/* <ImageBackground
                    source={{ uri: room.image }}
                    style={{
                        width: 100, height: 100,
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        backgroundColor: tintColor
                    }}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', tintColor]}
                        style={styles.gradient}
                    >
                    </LinearGradient>
                </ImageBackground> */}

            </ThemedView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    roomCard: {
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 4,
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
    },
    roomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
    },
    capacityBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        justifyContent: 'flex-end',
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#eee',
        borderRadius: 2,
        marginTop: 16,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    }
});