import { StyleSheet, View, Text, TouchableOpacity, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
    value?: boolean;
    isSwitch?: boolean;
    color?: string;
}

export default function SettingItem({ icon, title, value, onPress, isSwitch, color = "#333" }: SettingItemProps) {

    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={isSwitch}
        >
            <View style={styles.settingItemLeft}>
                {icon}
                <Text style={[styles.settingItemText, { color }]}>{title}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    value={value}
                    onValueChange={onPress}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={value ? '#2196F8' : '#f4f3f4'}
                />
            ) : (
                <MaterialIcons name="chevron-right" size={24} color="#666" />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingItemText: {
        marginLeft: 10,
    },
}); 