// un componente react che mostra solo il mese e l'anno e permetta tramite freccia di cambiare mese e anno

import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getMonthStringFromDate, getYearStringFromDate } from '@/constants/Calendar';

interface HorizontalMonthSelectorProps {
    selectedMonth: number;
    selectedYear: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
}

export default function HorizontalMonthSelector({ selectedMonth, selectedYear, onMonthChange, onYearChange }: HorizontalMonthSelectorProps) {

    const handleMonthChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            if (selectedMonth === 0) {
                onMonthChange(11);
                onYearChange(selectedYear - 1);
            } else {
                onMonthChange(selectedMonth - 1);
            }
        } else {
            if (selectedMonth === 11) {
                onMonthChange(0);
                onYearChange(selectedYear + 1);
            } else {
                onMonthChange(selectedMonth + 1);
            }
        }
    };

    useEffect(() => {
        onMonthChange(new Date().getMonth());
        onYearChange(new Date().getFullYear());
    }, []);

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity onPress={() => handleMonthChange('prev')}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <ThemedText type="default">{getYearStringFromDate(new Date(selectedYear, selectedMonth))}</ThemedText>
            <ThemedText type="defaultSemiBold">{getMonthStringFromDate(new Date(selectedYear, selectedMonth))}</ThemedText>

            <TouchableOpacity onPress={() => handleMonthChange('next')}>
                <Ionicons name="arrow-forward" size={24} color="black" />
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
    },
});
