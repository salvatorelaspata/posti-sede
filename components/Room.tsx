import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Room } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { getBookingsForRoom } from "@/db/api";

interface RoomComponentProps {
    room: Room;
    selectedRoom: Room | null;
    switchSelectedRoom: (room: Room) => void;
    selectedDate: Date;
    booked: boolean;
}

export const RoomComponent = ({ room, selectedRoom, switchSelectedRoom, selectedDate, booked }: RoomComponentProps) => {
    const { available, capacity } = room;
    const [availability, setAvailability] = useState<number>(0);
    const [isFull, setIsFull] = useState<boolean>(false);
    useEffect(() => {
        const fetchAvailability = async () => {
            const bookings = await getBookingsForRoom(room.id, selectedDate);
            setAvailability(bookings.length);
            setIsFull(bookings.length >= capacity);
        }
        fetchAvailability();
    }, [room, selectedDate]);
    return (
        <TouchableOpacity
            key={room.id}
            style={[
                styles.roomCard,
                selectedRoom?.id === room.id && styles.selectedRoom,
                booked && styles.booked
            ]}
            onPress={() => switchSelectedRoom(room)}
            disabled={booked}
        >
            <ThemedView style={styles.roomHeader}>
                <ThemedText style={styles.roomName}>{room.name}</ThemedText>
                <ThemedView style={styles.capacityBadge}>
                    <ThemedText type="defaultSemiBold" style={styles.capacityText}>
                        {availability}/{available}
                    </ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.roomInfo}>
                <FontAwesome5 name="users" size={20} color="#666" />
                <ThemedText style={styles.availabilityText}>
                    {available - availability} posti disponibili
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
            {booked && (
                <ThemedText style={styles.bookedText}>
                    Prenotato
                </ThemedText>
            )}
            {isFull && (
                <ThemedText style={styles.fullText}>
                    Pieno
                </ThemedText>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    roomCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 4,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedRoom: {
        borderColor: Colors.light.tint,
        borderWidth: 2,
        // shadow
        shadowColor: Colors.light.tint,
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
    bookedText: {
        color: 'green',
        fontSize: 16,
        textAlign: 'right',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    fullText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'right',
        textDecorationLine: 'underline',
        fontWeight: '600',
    }
});