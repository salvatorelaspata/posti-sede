import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";

export default function SettingsProfile() {
    const router = useRouter();

    return (
        <ThemedSafeAreaView style={styles.container}>
            <ThemedView style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()} />
                <ThemedText type="title" style={styles.title}>Profile</ThemedText>
            </ThemedView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        margin: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 16
    }
});