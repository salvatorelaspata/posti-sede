import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Animated } from 'react-native';
import CheckBox from 'expo-checkbox';
import { MaterialIcons, Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SettingItem from '@/components/SettingsItem';
import { ThemedView } from '@/components/ThemedView';
import { Colors, gradientHeader } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { HeaderImage } from '@/components/HeaderImage';
import { useThemeColor } from '@/hooks/useThemeColor';

const SettingsScreen = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [biometric, setBiometric] = useState(true);
    const [notificationTypesVisible, setNotificationTypesVisible] = useState(false);
    const notificationTypesOpacity = useState(new Animated.Value(0))[0];
    const { user } = useUser();
    const { signOut } = useAuth();

    type NotificationTypes = {
        dayBefore: boolean;
        currentDay: boolean;
        weeklySummary: boolean;
        monthlySummary: boolean;
    };

    const [notificationTypes, setNotificationTypes] = useState<NotificationTypes>({
        dayBefore: false,
        currentDay: false,
        weeklySummary: false,
        monthlySummary: false,
    });

    const handleDeleteAccount = () => {
        Alert.alert(
            "Elimina Account",
            "Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.",
            [
                { text: "Annulla", style: "cancel" },
                {
                    text: "Elimina",
                    style: "destructive",
                    onPress: () => Alert.alert("Account eliminato", "Il tuo account è stato eliminato con successo.")
                }
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Sei stato disconnesso con successo.", [
            { text: "Annulla", style: "cancel" },
            {
                text: "Logout", style: "destructive",
                onPress: () => {
                    // logout from clerk
                    signOut();
                    // navigate to login screen
                    router.replace('/');
                }
            }
        ]);
    }

    const toggleNotificationType = (type: keyof NotificationTypes) => {
        setNotificationTypes(prevState => ({
            ...prevState,
            [type]: !prevState[type],
        }));
    };

    useEffect(() => {
        if (notifications) {
            setNotificationTypesVisible(true);
            Animated.timing(notificationTypesOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(notificationTypesOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setNotificationTypesVisible(false));
        }
    }, [notifications]);

    const tint = useThemeColor({}, 'tint');
    const whiteText = useThemeColor({}, 'whiteText');

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: tint, dark: tint }}
            headerImage={
                <HeaderImage>
                    <>
                        {/* <ThemedView style={styles.profileImagePlaceholder}>
                            <Text style={styles.profileInitials}>{user?.imageUrl}</Text>
                        </ThemedView> */}
                        <Text style={styles.profileName}>{user?.fullName}</Text>
                        <Text style={styles.profileEmail}>{user?.emailAddresses[0].emailAddress}</Text>
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', tint]}
                            style={styles.gradient}
                        />
                    </>
                </HeaderImage>
            }>
            <ThemedView style={styles.container}>
                <ScrollView style={styles.container}>

                    {/* Location Settings */}
                    <ThemedView style={styles.section}>
                        <Text style={styles.sectionTitle}>Sede</Text>
                        <SettingItem
                            icon={<Ionicons name="location-outline" size={24} color="#333" />}
                            title="Cambia Sede"
                            onPress={() => router.replace('/(app)/rooms')}
                        />
                    </ThemedView>
                    {/* Profile Settings */}
                    <ThemedView style={styles.section}>
                        <Text style={styles.sectionTitle}>Profilo</Text>
                        <SettingItem
                            icon={<Ionicons name="person-outline" size={24} color="#333" />}
                            title="Modifica Profilo"
                            onPress={() => router.push('/settings/profile')}
                        />
                        <SettingItem
                            icon={<Ionicons name="lock-closed-outline" size={24} color="#333" />}
                            title="Cambia Password"
                            onPress={() => router.push('/settings/change-password')}
                        />
                    </ThemedView>

                    {/* General Settings */}
                    <ThemedView style={styles.section}>
                        <Text style={styles.sectionTitle}>Impostazioni Generali</Text>
                        <SettingItem
                            icon={<Ionicons name="notifications-outline" size={24} color="#333" />}
                            title="Notifiche"
                            value={notifications}
                            onPress={() => setNotifications(!notifications)}
                            isSwitch
                        />
                        {notificationTypesVisible && (
                            <Animated.View style={{ opacity: notificationTypesOpacity, margin: 16 }}>

                                <ThemedView style={styles.checkboxContainer}>
                                    <CheckBox
                                        value={notificationTypes.dayBefore}
                                        onValueChange={() => toggleNotificationType('dayBefore')}

                                    />
                                    <Text style={styles.checkboxLabel}>Ricordami il giorno prima</Text>
                                </ThemedView>
                                <ThemedView style={styles.checkboxContainer}>
                                    <CheckBox
                                        value={notificationTypes.currentDay}
                                        onValueChange={() => toggleNotificationType('currentDay')}
                                    />
                                    <Text style={styles.checkboxLabel}>Ricordami il giorno corrente</Text>
                                </ThemedView>
                                <ThemedView style={styles.checkboxContainer}>
                                    <CheckBox
                                        value={notificationTypes.weeklySummary}
                                        onValueChange={() => toggleNotificationType('weeklySummary')}
                                    />
                                    <Text style={styles.checkboxLabel}>Resoconto settimanale</Text>
                                </ThemedView>
                                <ThemedView style={styles.checkboxContainer}>
                                    <CheckBox
                                        value={notificationTypes.monthlySummary}
                                        onValueChange={() => toggleNotificationType('monthlySummary')}
                                    />
                                    <Text style={styles.checkboxLabel}>Resoconto mensile</Text>
                                </ThemedView>
                            </Animated.View>
                        )}
                        <SettingItem
                            icon={<Ionicons name="moon-outline" size={24} color="#333" />}
                            title="Modalità Scura"
                            value={darkMode}
                            onPress={() => setDarkMode(!darkMode)}
                            isSwitch
                        />
                        {/* <SettingItem
                        icon={<Ionicons name="finger-print-outline" size={24} color="#333" />}
                        title="Autenticazione Biometrica"
                        value={biometric}
                        onPress={() => setBiometric(!biometric)}
                        isSwitch
                    /> */}
                    </ThemedView>

                    {/* Danger Zone */}
                    <ThemedView style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: '#DC3545' }]}>Danger Zone</Text>
                        <SettingItem
                            icon={<Feather name="log-out" size={24} color="#DC3545" />}
                            title="Logout"
                            color="#DC3545"
                            onPress={handleLogout}
                        />
                        <SettingItem
                            icon={<MaterialIcons name="delete-outline" size={24} color="#DC3545" />}
                            title="Elimina Account"
                            color="#DC3545"
                            onPress={handleDeleteAccount}
                        />
                    </ThemedView>

                    <ThemedView style={styles.footer}>
                        <Text style={styles.version}>Versione 1.0.0</Text>
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        justifyContent: 'flex-end',
    },
    profileHeader: {
        padding: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    profileImagePlaceholder: {
        marginTop: 50,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileInitials: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    profileName: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    profileEmail: {
        color: 'white',
        fontSize: 14,
        opacity: 0.8,
    },
    section: {
        backgroundColor: 'white',
        margin: 8,
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 10,
        color: '#333',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingItemText: {
        marginLeft: 8,
        fontSize: 16,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    version: {
        color: '#666',
        fontSize: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default SettingsScreen;