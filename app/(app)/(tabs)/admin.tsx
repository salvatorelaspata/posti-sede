import { ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useState } from 'react';
import Calendar from "@/components/admin/Calendar";
import Employee from "@/components/admin/Employee";

import { ThemedScrollView } from "@/components/ThemedScrollView";

export default function Admin() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <ThemedView style={styles.adminContainer}>
            <ThemedView>
                <SegmentedControl
                    values={['Calendario Presenze', 'Dettaglio Dipendenti']}
                    selectedIndex={selectedIndex}
                    onChange={(event) => {
                        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                    }}
                    style={styles.segmentedControl}
                />
            </ThemedView>
            <ThemedScrollView style={styles.adminContainer}>

                <ThemedView style={styles.statsContainer}>
                    <ThemedView style={styles.statBox}>
                        <ThemedText style={styles.statNumber}>85%</ThemedText>
                        <ThemedText style={styles.statLabel}>Occupazione</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.statBox}>
                        <ThemedText style={styles.statNumber}>45</ThemedText>
                        <ThemedText style={styles.statLabel}>Prenotazioni</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.statBox}>
                        <ThemedText style={styles.statNumber}>12</ThemedText>
                        <ThemedText style={styles.statLabel}>Sale</ThemedText>
                    </ThemedView>
                </ThemedView>

                {selectedIndex === 0 ? <Calendar /> : <Employee />}
            </ThemedScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    adminContainer: {
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: '#fff',

    },
    statBox: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    segmentedControl: {
        margin: 16,
    },
});
