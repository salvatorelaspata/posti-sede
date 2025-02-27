import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Room } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppStore } from "@/store/app-store";

interface RoomComponentProps {
    room: Room & { available: number; capacity: number };
    switchSelectedRoom: (room: Room) => void;
    booked: boolean;
}

export const RoomComponent = ({ room, switchSelectedRoom, booked }: RoomComponentProps) => {
    const bgColor = useThemeColor({}, 'cardBackground');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'border');
    const successColor = useThemeColor({}, 'success');
    const errorColor = useThemeColor({}, 'error');

    const { room: _room } = useAppStore();

    return (
        <TouchableOpacity
            key={room.id}
            style={[
                styles.roomCard,
                { backgroundColor: bgColor, borderColor },
                room.id === _room?.id && { borderColor: Colors.light.tint },
                booked && { ...styles.booked, borderColor: successColor, shadowColor: successColor },
            ]}
            onPress={() => switchSelectedRoom(room)}
            disabled={booked}
        >
            <ThemedView style={styles.roomHeader}>
                <ThemedText style={styles.roomName}>{room.name}</ThemedText>
                <ThemedView style={styles.capacityBadge}>
                    <ThemedText type="defaultSemiBold" style={styles.capacityText}>
                        {room.capacity - room.available}/{room.capacity}
                    </ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.roomInfo}>
                {/* color={room.available === 0 ? errorColor : tintColor} */}
                <FontAwesome5 name="users" size={20} color={tintColor} />
                <ThemedText style={[styles.availabilityText, (room.available === 0) && { color: errorColor }]}>
                    {room.available} posti disponibili
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.progressContainer}>
                <ThemedView
                    style={[
                        styles.progressBar,
                        { width: `${(room.available / room.capacity) * 100}%` }
                    ]}
                />
            </ThemedView>
            <ThemedView style={styles.infoContainer}>
                {/* {(room.available === 0) && (
                    <ThemedText style={[{ color: errorColor }]}>
                        Pieno 🔴
                    </ThemedText>
                )} */}
                {booked && (
                    <ThemedText style={[{ color: successColor }]}>
                        ✅ Prenotato
                    </ThemedText>
                )}
            </ThemedView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    roomCard: {
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 4,
        marginBottom: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    roomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    roomName: {
        fontSize: 18,
        fontWeight: '600',
    },
    capacityBadge: {
        backgroundColor: Colors.light.tint,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    capacityText: {
        color: Colors.light.whiteText,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    availabilityText: {
        color: Colors.light.text,
        fontSize: 16,
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#eee',
        borderRadius: 2,
        marginTop: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.light.tint,
        borderRadius: 2,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
    },
    booked: {},
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
    },
});