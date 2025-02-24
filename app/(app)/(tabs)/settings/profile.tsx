import { ThemedText } from "@/components/ThemedText";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useState, useEffect, useLayoutEffect } from "react";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useUser } from "@clerk/clerk-expo";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function SettingsProfile() {
    const router = useRouter();
    const { user } = useUser();
    const [firstName, setFirstName] = useState<string>(user?.firstName || '');
    const [lastName, setLastName] = useState<string>(user?.lastName || '');

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
                    <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
                    <ThemedText type="title" style={styles.title}>Profilo</ThemedText>
                </ThemedView>
                <ThemedView style={styles.form}>
                    {/* first name */}
                    <ThemedView style={styles.selector}>
                        <ThemedText type="default" >Nome</ThemedText>
                        <ThemedTextInput
                            // style={styles.selectorInput}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </ThemedView>
                    {/* last name */}
                    <ThemedView style={styles.selector}>
                        <ThemedText type="default" >Cognome</ThemedText>
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
                    <TouchableOpacity style={[styles.button]} onPress={handleSave}>
                        <ThemedText type="defaultSemiBold">Salva</ThemedText>
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
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
});