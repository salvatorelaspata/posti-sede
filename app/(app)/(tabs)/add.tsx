import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import HorizontalMonthSelector from "@/components/HorizontalMonthSelector";
import { formatDate, getDaysInMonth, getTotalWorkingDaysInMonth } from "@/constants/Calendar";
import StatBox from "@/components/StatBox";
import { getMonthStatus, isPast, isPastWithToday } from "@/hooks/useCalendar";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Book, useAppStore } from "@/store/app-store";

export default function Reservations() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Prenotazioni</ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        paddingHorizontal: 16,
        marginTop: 16,
    }
}); 