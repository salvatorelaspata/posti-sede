import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Room } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
// import { useColorScheme } from "@/hooks/useColorScheme";
import { useAppStore } from "@/store/app-store";
import { Image, ImageBackground } from "expo-image";
// import { LinearGradient } from "expo-linear-gradient";
import { isDayDisabled } from "@/hooks/useCalendar";

interface RoomComponentProps {
    room: Room & { available: number; capacity: number };
}

export const RoomComponent = ({ room }: RoomComponentProps) => {
    // const colorScheme = useColorScheme();
    const bgColor = useThemeColor({}, 'cardBackground');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'border');
    const successColor = useThemeColor({}, 'success');
    const errorColor = useThemeColor({}, 'error');
    const textWhite = useThemeColor({}, 'whiteText');
    const cardShadow = useThemeColor({}, 'cardShadow');

    const { room: _room, setRoom, booked, currentYear, currentMonth, currentDay } = useAppStore();

    const currentDate = new Date(currentYear, currentMonth, currentDay);
    const isBookedByUser = booked?.roomId === room.id;
    const isCurrentDayDisabled = isDayDisabled(currentDate);

    // Determina se l'utente può prenotare questa stanza
    const canBook = !booked && !room.reserved && room.available > 0 && !isCurrentDayDisabled;

    // Determina se la stanza è disabilitata
    const isDisabled = booked && !isBookedByUser;

    const handleRoomPress = (_room: Room) => {
        if (isCurrentDayDisabled) {
            return Alert.alert(
                'Giorno Non Disponibile',
                'Non è possibile prenotare una stanza per questo giorno. I giorni nei weekend o passati non sono disponibili per le prenotazioni.',
                [
                    { text: 'OK', style: 'default' }
                ]
            );
        } else if (isBookedByUser) {
            return Alert.alert(
                'Prenotazione Esistente',
                `Hai già prenotato questa stanza (${booked?.roomName}) per questo giorno.`,
                [
                    { text: 'OK', style: 'default' }
                ]
            );
        } else if (booked && !isBookedByUser) {
            return Alert.alert(
                'Prenotazione Non Disponibile',
                `Hai già una prenotazione per questo giorno nella stanza: ${booked.roomName}. Non puoi prenotare più di una stanza per giorno.`,
                [
                    { text: 'OK', style: 'default' }
                ]
            );
        } else if (room.reserved) {
            return Alert.alert(
                'Stanza Riservata',
                'Questa stanza è riservata e non è disponibile per la prenotazione.',
                [
                    { text: 'OK', style: 'default' }
                ]
            );
        } else if (room.available === 0) {
            return Alert.alert(
                'Stanza Al Completo',
                'Questa stanza non ha posti disponibili per questo giorno.',
                [
                    { text: 'OK', style: 'default' }
                ]
            );
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
                // Evidenzia la stanza selezionata per la prenotazione
                room.id === _room?.id && { borderColor: tintColor, borderWidth: 2 },
                // Evidenzia in verde la stanza già prenotata dall'utente
                isBookedByUser && {
                    borderColor: successColor,
                    borderWidth: 2,
                    shadowColor: successColor,
                    backgroundColor: `${successColor}10` // Sfondo leggermente colorato
                },
                // Stile per stanze non disponibili o disabilitate
                isDisabled && {
                    opacity: 0.5,
                    borderColor: '#ccc'
                },
                room.reserved && !isBookedByUser && {
                    opacity: 0.6,
                    borderColor: errorColor
                },
                room.available === 0 && !isBookedByUser && {
                    opacity: 0.6,
                    borderColor: errorColor
                },
                // Stile per giorni disabilitati
                isCurrentDayDisabled && {
                    opacity: 0.4,
                    borderColor: '#ccc'
                }
            ]}
            onPress={() => handleRoomPress(room)}
            disabled={isDisabled || (room.reserved && !isBookedByUser) || (room.available === 0 && !isBookedByUser) || isCurrentDayDisabled}
            activeOpacity={canBook || isBookedByUser ? 0.7 : 1}
        >
            <ThemedView style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 12 }}>
                <ThemedView style={{ flex: 1, padding: 8, borderRadius: 12 }}>
                    <ThemedView style={styles.roomHeader}>
                        <ThemedText type="defaultSemiBold" style={[
                            isBookedByUser && { color: successColor }
                        ]}>
                            {room.name}
                            {isBookedByUser && ' ⭐'}
                        </ThemedText>
                        <ThemedView style={[
                            styles.capacityBadge,
                            {
                                backgroundColor: isBookedByUser ? successColor :
                                    room.available === 0 ? errorColor :
                                        tintColor
                            }
                        ]}>
                            <ThemedText type="smallSemiBold" style={{ color: textWhite }}>
                                {room.capacity - room.available}/{room.capacity}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <ThemedView style={styles.roomInfo}>
                        <FontAwesome5 name="users" size={15} color={tintColor} />
                        <ThemedText type="small" style={[
                            (room.available === 0 && !isBookedByUser) && { color: errorColor },
                            isBookedByUser && { color: successColor, fontWeight: '600' }
                        ]}>
                            {isBookedByUser ? (
                                '✅ Prenotata da te'
                            ) : room.reserved ? (
                                '🛑 Stanza riservata'
                            ) : room.available === 0 ? (
                                '❌ Nessun posto disponibile'
                            ) : (
                                `${room.available} posti disponibili`
                            )}
                            {isDisabled && !isBookedByUser && ' (Non disponibile)'}
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.progressContainer}>
                        <ThemedView
                            style={[
                                styles.progressBar,
                                {
                                    width: `${(room.available / room.capacity) * 100}%`,
                                    backgroundColor: isBookedByUser ? successColor :
                                        room.available === 0 ? errorColor :
                                            tintColor
                                },
                            ]}
                        />
                    </ThemedView>
                </ThemedView>
                {/* <ThemedView style={{ position: 'relative' }}> */}
                <Image source={{ uri: room.image }} style={[
                    {
                        width: 100, height: 100,
                        borderRadius: 12,
                        margin: 8,
                        backgroundColor: tintColor
                    },
                    isBookedByUser && { opacity: 0.9 }
                ]} />

                {/* Overlay per stanza prenotata */}
                {isBookedByUser && (
                    <ThemedView style={styles.bookedOverlay}>
                        <FontAwesome5 name="check-circle" size={24} color={textWhite} />
                    </ThemedView>
                )}
                {/* </ThemedView> */}

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
    },
    bookedOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});