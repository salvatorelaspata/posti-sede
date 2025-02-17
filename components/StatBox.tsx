import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface StatBoxProps {
    number?: number | string;
    label?: string;
}

export default function StatBox({ number, label }: StatBoxProps) {

    return (
        <ThemedView style={styles.statBox}>
            {number !== undefined && <ThemedText style={styles.statNumber}>{number}</ThemedText>}
            {label !== undefined && <ThemedText style={styles.statLabel}>{label}</ThemedText>}
        </ThemedView>
    );
}

const styles = StyleSheet.create({

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
});