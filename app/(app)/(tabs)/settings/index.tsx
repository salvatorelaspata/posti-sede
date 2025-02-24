import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Animated } from 'react-native';
import CheckBox from 'expo-checkbox';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SettingItem from '@/components/SettingsItem';
import { ThemedView } from '@/components/ThemedView';
import { Colors, gradientHeader } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';

const SettingsScreen = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
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

    return (
        <ThemedView style={styles.container}>
            {/* Header Profile Section */}
            <LinearGradient
                colors={gradientHeader as [string, string]}
                style={styles.profileHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.profileImagePlaceholder}>
                    <Text style={styles.profileInitials}>{user?.imageUrl}</Text>
                </View>
                <Text style={styles.profileName}>{user?.fullName}</Text>
                <Text style={styles.profileEmail}>{user?.emailAddresses[0].emailAddress}</Text>
            </LinearGradient>
            <ScrollView style={styles.container}>

                {/* Location Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sede</Text>
                    <SettingItem
                        icon={<Ionicons name="location-outline" size={24} color="#333" />}
                        title="Cambia Sede"
                        onPress={() => router.replace('/(app)/rooms')}
                    />
                </View>
                {/* Profile Settings */}
                <View style={styles.section}>
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
                </View>

                {/* General Settings */}
                <View style={styles.section}>
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

                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    value={notificationTypes.dayBefore}
                                    onValueChange={() => toggleNotificationType('dayBefore')}

                                />
                                <Text style={styles.checkboxLabel}>Ricordami il giorno prima</Text>
                            </View>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    value={notificationTypes.currentDay}
                                    onValueChange={() => toggleNotificationType('currentDay')}
                                />
                                <Text style={styles.checkboxLabel}>Ricordami il giorno corrente</Text>
                            </View>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    value={notificationTypes.weeklySummary}
                                    onValueChange={() => toggleNotificationType('weeklySummary')}
                                />
                                <Text style={styles.checkboxLabel}>Resoconto settimanale</Text>
                            </View>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    value={notificationTypes.monthlySummary}
                                    onValueChange={() => toggleNotificationType('monthlySummary')}
                                />
                                <Text style={styles.checkboxLabel}>Resoconto mensile</Text>
                            </View>
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
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
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
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>Versione 1.0.0</Text>
                </View>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        margin: 10,
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
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingItemText: {
        marginLeft: 10,
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