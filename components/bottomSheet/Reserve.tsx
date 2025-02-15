import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Room } from '@/types';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import Checkbox from 'expo-checkbox';

interface ReserveBottomSheetProps {
    selectedRoom: Room;
    onClose: () => void;
}

export default function ReserveBottomSheet({ selectedRoom, onClose }: ReserveBottomSheetProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isChecked, setChecked] = useState<boolean>(true);
    const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handlePrenota = () => {
        bottomSheetRef.current?.expand();
        console.log('prenota');
    }


    const handleChiudi = () => {
        bottomSheetRef.current?.close();
        onClose();
    }

    return (
        <BottomSheet
            onChange={handleSheetChanges}
            onClose={onClose}
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            style={styles.bottomSheet}
            enablePanDownToClose={true}
        >
            <BottomSheetView style={styles.contentContainer}>
                <ThemedText type="defaultSemiBold" style={styles.title}>Prenota {selectedRoom.name}</ThemedText>

                <ThemedView style={styles.formContainer}>
                    <ThemedView style={styles.formRow}>
                        <ThemedText>Intera giornata</ThemedText>
                        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handlePrenota} style={[styles.button, { backgroundColor: 'green', width: '70%' }]}>
                        <ThemedText type="defaultSemiBold" style={styles.buttonText}>Prenota</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleChiudi} style={[styles.button, { backgroundColor: 'gray' }]}>
                        <ThemedText type="defaultSemiBold" style={styles.buttonText}>Annulla</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    bottomSheet: {
        zIndex: 1000,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
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