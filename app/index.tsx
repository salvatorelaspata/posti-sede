import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ImageBackground, Button, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { composeAsync } from 'expo-mail-composer';
import { canOpenURL } from 'expo-linking';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
    const router = useRouter();
    const handleLogin = () => {
        router.push('/login');
    };

    const handleRegister = () => {
        router.push('/signup');
    };

    const handleContactSales = async () => {
        // Gestione contatto vendite
        // send email to sales@postisede.it
        // check if mail is available
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
        <ScrollView style={styles.container} bounces={false}>
            <ImageBackground
                source={{ uri: 'https://api.a0.dev/assets/image?text=modern%20office%20space%20with%20minimalist%20design%20and%20clean%20workspace&aspect=16:9' }}
                style={styles.headerImage}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                >
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>posti sede</Text>
                        <Text style={styles.subtitle}>Gestisci gli spazi di lavoro in modo intelligente</Text>
                    </View>
                </LinearGradient>
            </ImageBackground>

            <View style={styles.content}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <MaterialIcons name="person-add" size={24} color={Colors.light.whiteText} />
                        <Text style={styles.buttonText}>Registrati</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Ionicons name="log-in-outline" size={24} color={Colors.light.whiteText} />
                        <Text style={styles.buttonText}>Accedi</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.featuresContainer}>
                    <View style={styles.featureCard}>
                        <MaterialIcons name="location-city" size={32} color={Colors.light.tint} />
                        <Text style={styles.featureTitle}>Multi-sede</Text>
                        <Text style={styles.featureText}>Gestisci più sedi aziendali da un'unica piattaforma</Text>
                    </View>

                    <View style={styles.featureCard}>
                        <MaterialIcons name="event-seat" size={32} color={Colors.light.tint} />
                        <Text style={styles.featureTitle}>Prenotazione Smart</Text>
                        <Text style={styles.featureText}>Prenota la tua postazione in pochi click</Text>
                    </View>

                    <View style={styles.featureCard}>
                        <MaterialIcons name="meeting-room" size={32} color={Colors.light.tint} />
                        <Text style={styles.featureTitle}>Gestione Spazi</Text>
                        <Text style={styles.featureText}>Organizza e monitora l'utilizzo degli spazi</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.salesButton} onPress={handleContactSales}>
                    <MaterialIcons name="business" size={24} color={Colors.light.tint} />
                    <Text style={styles.salesButtonText}>Contattaci</Text>
                    <Text style={styles.salesSubtext}>Per registrare la tua azienda</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
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
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#ffffff',
        opacity: 0.9,
    },
    content: {
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -50,
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: Colors.light.tint,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        width: '48%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    registerButton: {
        backgroundColor: Colors.light.text,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        width: '48%',
        elevation: 3,
        shadowColor: Colors.light.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: Colors.light.whiteText,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    featuresContainer: {
        marginBottom: 8,
    },
    featureCard: {
        backgroundColor: Colors.light.whiteText,
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 10,
        marginBottom: 5,
    },
    featureText: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 20,
    },
    salesButton: {
        backgroundColor: Colors.light.whiteText,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.light.tint,
        marginBottom: 20,
    },
    salesButtonText: {
        color: Colors.light.tint,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    salesSubtext: {
        color: Colors.light.text,
        fontSize: 14,
        marginTop: 4,
    },
});