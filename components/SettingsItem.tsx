import { StyleSheet, View, Text, TouchableOpacity, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
    value?: boolean;
    isSwitch?: boolean;
    color?: string;
    disabled?: boolean;
}

export default function SettingItem({ icon, title, value, onPress, isSwitch, color, disabled }: SettingItemProps) {
    const colorScheme = useColorScheme();
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');
    const iconColor = useThemeColor({}, 'icon');
    const tintColor = useThemeColor({}, 'tint');
    const inactiveColor = useThemeColor({}, 'inactiveText');

    const finalTextColor = color || textColor;

    return (
        <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: borderColor }]}
            onPress={onPress}
            disabled={isSwitch}
        >
            <View style={styles.settingItemLeft}>
                {icon}
                <Text style={[styles.settingItemText, { color: finalTextColor }]}>{title}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    disabled={disabled}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    trackColor={{ false: inactiveColor, true: tintColor }}
                    thumbColor={value ? tintColor : inactiveColor}
                    // ios_backgroundColor={inactiveColor}
                    value={value}
                    onValueChange={onPress}
                />
            ) : (
                <MaterialIcons name="chevron-right" size={24} color={iconColor} />
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
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingItemText: {
        marginLeft: 10,
    },
}); 