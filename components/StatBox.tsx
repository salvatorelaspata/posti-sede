import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface StatBoxProps {
    number?: number | string;
    label?: string;
}

export default function StatBox({ number, label }: StatBoxProps) {
    const statBackground = useThemeColor({}, 'statBackground');
    const statPrimaryText = useThemeColor({}, 'statPrimaryText');
    const statText = useThemeColor({}, 'statText');
    const statShadow = useThemeColor({}, 'statShadow');

    return (
        <ThemedView style={[styles.statBox, { backgroundColor: statBackground, shadowColor: statShadow }]}>
            {number !== undefined && <ThemedText type="subtitle" style={{ color: statPrimaryText }}>{number}</ThemedText>}
            {label !== undefined && <ThemedText type="small" style={[styles.statLabel, { color: statText }]}>{label}</ThemedText>}
        </ThemedView>
    );
}

const styles = StyleSheet.create({

    statBox: {
        flex: 1,
        borderRadius: 12,
        padding: 8,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statLabel: {
        marginTop: 4,
    },
});