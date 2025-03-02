import { ThemedText } from "@/components/ThemedText";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useState, useEffect, useLayoutEffect } from "react";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useUser } from "@clerk/clerk-expo";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import { HeaderImage } from "@/components/HeaderImage";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsProfile() {
    const router = useRouter();
    const { user } = useUser();
    const [firstName, setFirstName] = useState<string>(user?.firstName || '');
    const [lastName, setLastName] = useState<string>(user?.lastName || '');
    const tint = useThemeColor({}, 'tint');
    const whiteText = useThemeColor({}, 'whiteText');

    const handleSave = async () => {
        if (!firstName || !lastName) {
            Alert.alert('Errore', 'Per favore inserisci nome e cognome');
            return;
        }
        try {
            await user?.update({ firstName: firstName.toString(), lastName: lastName.toString() });
            Alert.alert('Successo', 'Profilo modificato con successo');
            router.back();
        } catch (error) {
            console.log(error);
            Alert.alert('Errore', 'Si è verificato un errore durante la modifica del profilo');
        }
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: tint, dark: tint }}
            headerImage={
                <HeaderImage>
                    {/* <ImageBackground
                    source={{ uri: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/image-background.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T020029Z&X-Amz-Expires=3600&X-Amz-Signature=50f79cc12871b5ed12d83a69ffb7756b34adca95dd37c7fa35a735e7cdf6c5d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' }}
                    style={styles.headerImage}
                > */}
                    <>
                        <FontAwesome5 name="user" size={100} color={whiteText} />
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', tint]}
                            style={styles.gradient}
                        >
                        </LinearGradient>
                    </>
                    {/* </ImageBackground> */}
                </HeaderImage>
            }>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
                    <ThemedText type="title" style={[styles.title, { color: tint }]}>Profilo</ThemedText>
                </ThemedView>
                <ThemedView style={styles.form}>
                    {/* first name */}
                    <ThemedView style={styles.selector}>
                        <ThemedText type="default" style={{ color: tint }}>Nome</ThemedText>
                        <ThemedTextInput
                            // style={styles.selectorInput}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </ThemedView>
                    {/* last name */}
                    <ThemedView style={styles.selector}>
                        <ThemedText type="default" style={{ color: tint }}>Cognome</ThemedText>
                        <ThemedTextInput
                            // style={styles.selectorInput}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.spacer} />
                <ThemedView style={styles.footer}>
                    <TouchableOpacity style={[styles.button]} onPress={() => router.back()}>
                        <ThemedText type="default">Annulla</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: tint }]} onPress={handleSave}>
                        <ThemedText type="defaultSemiBold" style={{ color: whiteText }}>Salva</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView >
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
    // selectorInput: {
    //     width: '100%',
    //     borderWidth: 1,
    //     borderRadius: 8,
    //     padding: 8,
    // },
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

    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        justifyContent: 'flex-end',
    },
    headerImage: {
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
});