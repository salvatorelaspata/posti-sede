import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function ChangePassword() {
    const router = useRouter();
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color={Colors.light.text}
                    name="person.circle"
                    style={styles.headerImage}
                />
            }>

            <ThemedView style={[styles.container]}>
                <ThemedView style={styles.header}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.tint} onPress={() => router.back()} />
                    <ThemedText type="title" style={styles.title}>Cambia password</ThemedText>
                </ThemedView>
                <ThemedView style={styles.form}>
                    <ThemedText type="default" >Password corrente</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Password corrente"
                        secureTextEntry={true}
                    />

                    <ThemedText type="default" >Nuova password</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Nuova password"
                        secureTextEntry={true}
                    />

                    {/* repeat new password
                 */}
                    <ThemedText type="default" >Ripeti nuova password</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Ripeti nuova password"
                        secureTextEntry={true}
                    />
                </ThemedView>
                <ThemedView style={styles.spacer} />
                <ThemedView style={styles.footer}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.text }]}>
                        <ThemedText type="default" style={{ color: Colors.light.background }}>Annulla</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.tint }]}>
                        <ThemedText type="defaultSemiBold" style={{ color: Colors.light.background }}>Salva</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </ParallaxScrollView>
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

    },
    title: {
        marginLeft: 16,
    },
    form: {
        flexDirection: 'column',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginVertical: 8
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        gap: 16
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8
    },
    spacer: {
        flex: 1
    },
    headerImage: {
        bottom: -90,
        left: -35,
        position: 'absolute',
    }
});
