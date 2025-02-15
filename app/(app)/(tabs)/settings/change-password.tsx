import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";

export default function ChangePassword() {
    const router = useRouter();
    return (
        <ThemedSafeAreaView style={styles.container}>
            <ThemedView style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()} />
                <ThemedText type="title" style={styles.title}>Change Password</ThemedText>
            </ThemedView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 16
    },
    title: {
        margin: 16
    }
});