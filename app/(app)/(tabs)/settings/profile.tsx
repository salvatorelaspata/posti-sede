import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useState, useEffect, useLayoutEffect } from "react";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuthStore } from "@/store/auth-store";


// modifica profilo
// - emoji profilo
// - nome completo

export default function SettingsProfile() {
    const router = useRouter();
    const { user, updateProfile } = useAuthStore();
    const [emoji, setEmoji] = useState<string>(user?.emoji || '');
    const [fullname, setFullname] = useState<string>(user?.fullname || '');

    useLayoutEffect(() => {
        if (!user) return router.replace('/login');
    }, [user]);

    const handleEmojiChange = (text: string) => {
        // check if the emoji is valid with
        const isSingleEmoji = (str: string) => {
            const emojiPresentation = /\p{Emoji_Presentation}/gu;
            return emojiPresentation.test(str) && str.replace(emojiPresentation, '') === '' || str.length === 0;
        };

        if (isSingleEmoji(text)) {
            setEmoji(text);
        } else {
            Alert.alert('Emoji non valido', 'Per favore inserisci un emoji valido');
        }
    }

    const handleSave = async () => {
        if (!fullname || !emoji) {
            Alert.alert('Errore', 'Per favore inserisci un nome e un emoji');
            return;
        }
        try {
            await updateProfile(fullname, emoji);
            Alert.alert('Successo', 'Profilo modificato con successo');
            router.back();
        } catch (error) {
            Alert.alert('Errore', 'Si è verificato un errore durante la modifica del profilo');
        }
    }

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
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.tint} onPress={() => router.back()} />
                    <ThemedText type="title" style={styles.title}>Profilo</ThemedText>
                </ThemedView>
                <ThemedView style={styles.form}>
                    {/* emoji selector */}
                    <ThemedView style={[styles.selector, { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }]}>
                        <ThemedText type="default" >Emoji</ThemedText>

                        <TextInput
                            style={[styles.selectorInput, { width: 74, height: 74, fontSize: 64, padding: 0 }]}
                            value={emoji}
                            onChangeText={handleEmojiChange}
                        />

                    </ThemedView>
                    {/* fullname */}
                    <ThemedView style={styles.selector}>
                        <ThemedText type="default" >Fullname</ThemedText>
                        <TextInput
                            style={styles.selectorInput}
                            value={fullname}
                            onChangeText={setFullname}
                        />

                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.spacer} />
                <ThemedView style={styles.footer}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.text }]} onPress={() => router.back()}>
                        <ThemedText type="default" style={{ color: Colors.light.background }}>Annulla</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.tint }]} onPress={handleSave}>
                        <ThemedText type="defaultSemiBold" style={{ color: Colors.light.background }}>Salva</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </ParallaxScrollView >
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
        marginLeft: 16
    },
    form: {
        flexDirection: 'column',
    },
    selector: {
        flexDirection: 'column',
    },
    selectorInput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 16
    },
    spacer: {
        flex: 1
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
});