import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Room } from '@/types';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { formatDate } from '@/constants/Calendar';
import { useAppStore } from '@/store/app-store';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface ReserveBottomSheetProps {
    handleBooking: () => Promise<void>;
    bottomSheetRef: React.RefObject<BottomSheetMethods>

}

export default function ReserveBottomSheet({ handleBooking, bottomSheetRef }: ReserveBottomSheetProps) {

    const { location, room, currentYear, currentMonth, currentDay, setRoom } = useAppStore();

    // const bottomSheetRef = useRef<BottomSheet>(null);
    const [isChecked, setChecked] = useState<boolean>(true);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const snapPoints = useMemo(() => ['40%', '60%'], []);
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handleInteraGiornata = () => {
        setChecked(!isChecked);
        // expand the bottom sheet
        if (isChecked) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.collapse();
        }
    }

    const handlePrenota = async () => {
        await handleBooking();
        Alert.alert('Successo', 'Prenotazione effettuata con successo');
        bottomSheetRef.current?.close();
        setRoom(null);
    }

    const handleChiudi = () => {
        bottomSheetRef.current?.close();
        setRoom(null);
    }

    return (
        <BottomSheet
            onChange={handleSheetChanges}
            onClose={() => setRoom(null)}
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            style={styles.bottomSheet}
            enablePanDownToClose={true}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} enableTouchThrough={true} />
            )}
        >
            <BottomSheetView style={styles.contentContainer}>
                <ThemedText type="defaultSemiBold" style={styles.title}>{location?.name} - {room?.name} - {formatDate(new Date(currentYear, currentMonth, currentDay)
                    , 'short')}</ThemedText>
                <ThemedView style={styles.formContainer}>
                    {/* <ThemedText type="defaultSemiBold" style={styles.title}>Data: {selectedDate.toLocaleDateString()}</ThemedText> */}
                    <ThemedView style={styles.formRow}>
                        <ThemedText onPress={handleInteraGiornata}>Prenota intera giornata</ThemedText>
                        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={handleInteraGiornata} />
                    </ThemedView>
                    <ThemedView style={styles.formRow}>
                        {!isChecked && (
                            <ThemedView style={styles.formRow}>
                                <SegmentedControl
                                    onChange={(event) => {
                                        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                                    }}
                                    values={['Mattina', 'Pomeriggio']}
                                    selectedIndex={selectedIndex}
                                    style={{ width: '100%', height: 40, marginVertical: 8 }}
                                />
                            </ThemedView>
                        )}
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handlePrenota} style={[styles.button, { backgroundColor: Colors.light.tint, width: '70%' }]}>
                        <ThemedText type="defaultSemiBold" style={styles.buttonText}>Prenota</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleChiudi} style={[styles.button, { backgroundColor: Colors.light.icon }]}>
                        <ThemedText style={styles.buttonText}>Annulla</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    bottomSheet: {
        zIndex: 1000,
        borderTopWidth: 0.5,
        borderTopColor: Colors.light.tint,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        margin: 8
    },
    button: {
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    formRow: {
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    checkbox: {
        margin: 8,
    },
    title: {
        marginBottom: 16,
    },
}); 