// un componente react che mostra solo il mese e l'anno e permetta tramite freccia di cambiare mese e anno

import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getMonthStringFromDate, getYearStringFromDate } from '@/constants/Calendar';

interface HorizontalMonthSelectorProps {
    selectedMonth: number;
    selectedYear: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    handleNextMonth: () => void;
    handlePreviousMonth: () => void;
}

export default function HorizontalMonthSelector({ selectedMonth, selectedYear, onMonthChange, onYearChange, handleNextMonth, handlePreviousMonth }: HorizontalMonthSelectorProps) {
    const colorScheme = useColorScheme();
    const iconColor = useThemeColor({}, 'icon');
    const tintColor = useThemeColor({}, 'tint');

    // deprecated
    const handleMonthChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            handlePreviousMonth();
        } else {
            handleNextMonth();
        }
    };

    useEffect(() => {
        onMonthChange(new Date().getMonth());
        onYearChange(new Date().getFullYear());
    }, []);

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity onPress={() => handleMonthChange('prev')} style={styles.arrowButton}>
                <Ionicons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
            <ThemedView style={styles.dateContainer}>
                <ThemedText type="default" style={styles.yearText}>{getYearStringFromDate(new Date(selectedYear, selectedMonth))}</ThemedText>
                <ThemedText type="defaultSemiBold" style={[styles.monthText, { color: tintColor }]}>
                    {getMonthStringFromDate(new Date(selectedYear, selectedMonth))}
                </ThemedText>
            </ThemedView>
            <TouchableOpacity onPress={() => handleMonthChange('next')} style={styles.arrowButton}>
                <Ionicons name="arrow-forward" size={24} color={iconColor} />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    arrowButton: {
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
    },
    yearText: {
        fontSize: 14,
        opacity: 0.7,
    },
    monthText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 2,
    },
});
