import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

import ParallaxScrollView from "@/components/ParallaxScrollView";


import { useState } from "react";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { HeaderImage } from "@/components/HeaderImage";
import { LinearGradient } from "expo-linear-gradient";

export default function ChangePassword() {
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    // Theme colors
    const tint = useThemeColor({}, 'tint');
    const whiteText = useThemeColor({}, 'whiteText');
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const iconColor = useThemeColor({}, 'icon');

    const handleResetPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Errore', 'Le password non corrispondono');
            return;
        }
        try {
            // TODO: Implementa la logica per cambiare la password

            Alert.alert('Successo', 'Password cambiata con successo');
            router.back();
        } catch (error) {
            Alert.alert('Errore', 'Errore durante il cambio password');
        }
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: tint, dark: tint }}
            headerImage={
                <HeaderImage>
                    <>
                        <FontAwesome5 name="key" size={100} color={whiteText} />
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', tint]}
                            style={styles.gradient}
                        >
                        </LinearGradient>
                    </>
                </HeaderImage>
            }>

            <ThemedView style={[styles.container]}>
                <ThemedView style={styles.header}>
                    <Ionicons name="arrow-back" size={24} color={iconColor} onPress={() => router.back()} />
                    <ThemedText type="title" style={styles.title}>Cambia password</ThemedText>
                </ThemedView>
                <ThemedView style={styles.form}>
                    <ThemedText type="default" style={{ color: tint }} >Password corrente</ThemedText>
                    <ThemedTextInput
                        placeholder="Password corrente"
                        secureTextEntry={true}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />

                    <ThemedText type="default" style={{ color: tint }}>Nuova password</ThemedText>
                    <ThemedTextInput
                        placeholder="Nuova password"
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    {/* repeat new password
                 */}
                    <ThemedText type="default" style={{ color: tint }}>Ripeti nuova password</ThemedText>
                    <ThemedTextInput
                        placeholder="Ripeti nuova password"
                        secureTextEntry={true}
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                    />
                </ThemedView>
                <ThemedView style={styles.spacer} />
                <ThemedView style={styles.footer}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: textColor }]} onPress={() => router.back()}>
                        <ThemedText type="default" style={{ color: backgroundColor }}>Annulla</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: tint }]} onPress={handleResetPassword}>
                        <ThemedText type="defaultSemiBold" style={{ color: backgroundColor }}>Salva</ThemedText>
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
    },

    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        justifyContent: 'flex-end',
    },
});
