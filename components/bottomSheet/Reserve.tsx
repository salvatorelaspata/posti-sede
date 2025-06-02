import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Room } from '@/types';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatDate } from '@/constants/Calendar';
import { useAppStore } from '@/store/app-store';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface ReserveBottomSheetProps {
    handleBooking: () => Promise<void>;
    bottomSheetRef: React.RefObject<BottomSheetMethods>
}

export default function ReserveBottomSheet({ handleBooking, bottomSheetRef }: ReserveBottomSheetProps) {

    const { location, room, currentYear, currentMonth, currentDay, setRoom } = useAppStore();

    // Theme colors
    const colorScheme = useColorScheme();
    const tintColor = useThemeColor({}, 'tint');
    const iconColor = useThemeColor({}, 'icon');
    const whiteTextColor = useThemeColor({}, 'whiteText');
    const borderColor = useThemeColor({}, 'border');
    const backgroundColor = useThemeColor({}, 'background');
    const cardBackground = useThemeColor({}, 'cardBackground');

    // const bottomSheetRef = useRef<BottomSheet>(null);
    const [isChecked, setChecked] = useState<boolean>(true);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const snapPoints = useMemo(() => [350], []);
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
        // Close the sheet if dragged down completely
        if (index === -1) {
            setRoom(null);
        }
    }, [setRoom]);

    const handleInteraGiornata = useCallback(() => {
        setChecked(!isChecked);
        // expand the bottom sheet
        if (isChecked) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.snapToIndex(0);
        }
    }, [isChecked]);

    const handlePrenota = async () => {
        if (isLoading) return; // Prevent double booking

        setIsLoading(true);
        try {
            await handleBooking();
            Alert.alert('Successo', 'Prenotazione effettuata con successo', [
                {
                    text: 'OK',
                    onPress: () => {
                        bottomSheetRef.current?.close();
                        setRoom(null);
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('Errore', 'Si è verificato un errore durante la prenotazione. Riprova.');
            console.error('Booking error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleChiudi = useCallback(() => {
        bottomSheetRef.current?.close();
        setRoom(null);
    }, [setRoom]);

    // Reset state when room changes
    useEffect(() => {
        if (room) {
            setChecked(true);
            setSelectedIndex(0);
            setIsLoading(false);
            // Show the bottom sheet when a room is selected
            bottomSheetRef.current?.snapToIndex(0);
        }
    }, [room]);

    return (
        <BottomSheet
            onChange={handleSheetChanges}
            onClose={() => setRoom(null)}
            ref={bottomSheetRef}
            // snapPoints={[200, '50%']}
            // enableDynamicSizing={true}
            // detached={false}
            style={[styles.bottomSheet, { borderTopColor: borderColor }]}
            enablePanDownToClose={true}
            backgroundStyle={{ backgroundColor: cardBackground }}
            handleIndicatorStyle={{ backgroundColor: tintColor }}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} enableTouchThrough={false} disappearsOnIndex={-1} appearsOnIndex={0} />
            )}
        >
            <BottomSheetView style={styles.contentContainer}>
                <ThemedText type="defaultSemiBold" style={styles.title}>
                    {location?.name} - {room?.name} - {formatDate(new Date(currentYear, currentMonth, currentDay), 'short')}
                </ThemedText>
                <ThemedView style={styles.formContainer}>
                    <ThemedView style={styles.formRow}>
                        <ThemedText onPress={handleInteraGiornata} style={{ flex: 1 }}>
                            Prenota intera giornata
                        </ThemedText>
                        <Checkbox
                            style={styles.checkbox}
                            value={isChecked}
                            onValueChange={handleInteraGiornata}
                            color={isChecked ? tintColor : undefined}
                            accessibilityLabel="Prenota intera giornata"
                        />
                    </ThemedView>
                    {!isChecked && (
                        <ThemedView style={styles.formRow}>
                            <ThemedView style={styles.segmentedContainer}>
                                <SegmentedControl
                                    onChange={(event) => {
                                        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                                    }}
                                    values={['Mattina (9:00-13:00)', 'Pomeriggio (14:00-18:00)']}
                                    selectedIndex={selectedIndex}
                                    style={styles.segmentedControl}
                                    tintColor={tintColor}
                                    backgroundColor={cardBackground}
                                    fontStyle={{ color: iconColor }}
                                    activeFontStyle={{ color: whiteTextColor }}
                                />
                            </ThemedView>
                        </ThemedView>
                    )}
                </ThemedView>
                <ThemedView style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handlePrenota}
                        disabled={isLoading}
                        accessibilityLabel={isLoading ? 'Prenotazione in corso' : 'Conferma prenotazione'}
                        accessibilityRole="button"
                        style={[
                            styles.button,
                            styles.primaryButton,
                            {
                                backgroundColor: isLoading ? iconColor : tintColor,
                                opacity: isLoading ? 0.6 : 1
                            }
                        ]}
                    >
                        <ThemedText type="defaultSemiBold" style={[{ color: whiteTextColor }]}>
                            {isLoading ? 'Prenotando...' : 'Prenota'}
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleChiudi}
                        disabled={isLoading}
                        accessibilityLabel="Annulla prenotazione"
                        accessibilityRole="button"
                        style={[
                            styles.button,
                            styles.secondaryButton,
                            {
                                backgroundColor: iconColor,
                                opacity: isLoading ? 0.6 : 1
                            }
                        ]}
                    >
                        <ThemedText style={[{ color: whiteTextColor }]}>Annulla</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    bottomSheet: {
        borderTopWidth: 0.5,
        flex: 1,
    },
    contentContainer: {
        alignItems: 'center',
        margin: 8
    },
    button: {
        borderRadius: 8,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        flex: 2,
        marginRight: 8,
    },
    secondaryButton: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 8,
        marginBottom: 20
    },
    buttonText: {
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    formRow: {
        backgroundColor: 'transparent',
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    segmentedContainer: {
        width: '100%',
        marginVertical: 8,
    },
    segmentedControl: {
        width: '100%',
        height: 40,
    },
    checkbox: {
        margin: 8,
        transform: [{ scale: 1.2 }],
    },
    title: {
        textAlign: 'center',
        paddingHorizontal: 16,
    },
}); 