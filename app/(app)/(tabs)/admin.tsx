import { ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useState } from 'react';
import Calendar from "@/components/admin/Calendar";
import Employee from "@/components/admin/Employee";
import StatBox from "@/components/StatBox";
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
                    <StatBox number={85} label="Occupazione" />
                    <StatBox number={45} label="Prenotazioni" />
                    <StatBox number={12} label="Sale" />
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
    segmentedControl: {
        margin: 16,
    },
});
