import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, ImageBackground, Alert, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { composeAsync } from 'expo-mail-composer';
import { canOpenURL } from 'expo-linking';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HeaderImage } from '@/components/HeaderImage';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/auth';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
    const { user, signIn } = useAuth();

    if (user) return <Redirect href="/(protected)/rooms" />

    const colorScheme = useColorScheme();
    const tintColor = useThemeColor({}, 'tint');
    const whiteTextColor = useThemeColor({}, 'whiteText');
    const textColor = useThemeColor({}, 'text');
    // const backgroundColor = useThemeColor({}, 'background');
    const cardBackground = useThemeColor({}, 'cardBackground');

    const router = useRouter();
    const handleLogin = () => {
        router.push('/login');
    };

    const handleContactSales = async () => {
        if (await canOpenURL('mailto:sales@postisede.it')) {
            composeAsync({
                recipients: ['sales@postisede.it'],
                subject: 'Contatto da postisede.it',
                body: 'Salve,\n vorrei informazioni sulla vostra soluzione per le postazioni di lavoro.',
            });
        } else {
            Alert.alert('Email non disponibile', 'Per favore, contattaci tramite il nostro numero di telefono');
        }
    };
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: tintColor, dark: tintColor }}
            headerTitle='posti sede'
            headerSubtitle='Gestisci gli spazi di lavoro in modo intelligente'
            headerImage={
                <HeaderImage>
                    <ImageBackground
                        source={{ uri: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/image-background.webp' }}
                        style={styles.headerImage}
                    >
                        <LinearGradient
                            colors={colorScheme === 'dark'
                                ? ['rgba(0,0,0,0.3)', 'rgba(21,23,24,0.7)']
                                : ['rgba(0,0,0,0.1)', tintColor]
                            }
                            style={styles.gradient}
                        >
                        </LinearGradient>
                    </ImageBackground>
                </HeaderImage>
            }>
            <ThemedView style={styles.content}>
                <ThemedView style={styles.featuresContainer}>
                    <ThemedView style={[styles.featureCard, { backgroundColor: cardBackground, borderColor: tintColor, borderWidth: 2 }]}>
                        <MaterialIcons style={{ position: 'absolute', right: 16, top: 16 }} name="location-city" size={24} color={tintColor} />
                        <ThemedText type="defaultSemiBold">Multi-sede</ThemedText>
                        <ThemedText>Gestisci più sedi aziendali da un'unica piattaforma</ThemedText>
                    </ThemedView>

                    <ThemedView style={[styles.featureCard, { backgroundColor: cardBackground, borderColor: tintColor, borderWidth: 2 }]}>
                        <MaterialIcons style={{ position: 'absolute', right: 16, top: 16 }} name="event-seat" size={24} color={tintColor} />
                        <ThemedText type="defaultSemiBold">Prenotazione Smart</ThemedText>
                        <ThemedText>Prenota la tua postazione in pochi click</ThemedText>
                    </ThemedView>

                    <ThemedView style={[styles.featureCard, { backgroundColor: cardBackground, borderColor: tintColor, borderWidth: 2 }]}>
                        <MaterialIcons style={{ position: 'absolute', right: 16, top: 16 }} name="meeting-room" size={24} color={tintColor} />
                        <ThemedText type="defaultSemiBold">Gestione Spazi</ThemedText>
                        <ThemedText>Organizza e monitora l'utilizzo degli spazi</ThemedText>
                    </ThemedView>
                </ThemedView>

                <TouchableOpacity style={[styles.loginButton, { backgroundColor: tintColor, borderColor: tintColor }]} onPress={handleLogin}>
                    <Ionicons name="log-in-outline" size={24} color={whiteTextColor} />
                    <ThemedText type="defaultSemiBold" style={[{ color: whiteTextColor, marginLeft: 8 }]}>Accedi</ThemedText>
                </TouchableOpacity>

                {/* oppure */}
                <ThemedText type='small' style={styles.or}>
                    Oppure
                </ThemedText>

                <TouchableOpacity style={[styles.salesButton, { backgroundColor: cardBackground, borderColor: tintColor }]} onPress={handleContactSales}>
                    <MaterialIcons name="business" size={24} color={tintColor} />
                    <ThemedText type="defaultSemiBold" style={[{ color: tintColor, marginTop: 8 }]}>Contattaci</ThemedText>
                    <ThemedText style={[{ color: textColor, marginTop: 4 }]}>Per registrare la tua azienda</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ParallaxScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    headerImage: {
        width: width,
        height: height * 0.4,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        justifyContent: 'flex-end',
    },
    headerContent: {
        padding: 16,
        paddingBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',

        marginBottom: 10,
    },
    or: {
        textAlign: 'center',
        marginVertical: 16,
        // textDecorationLine: 'underline',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    buttonContainer: {
        zIndex: 999,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginTop: 16,
    },
    loginButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,

        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    buttonText: {
        marginLeft: 8,
    },
    featuresContainer: {
        marginBottom: 8,
    },
    featureCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    salesButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: 16,
    },
});