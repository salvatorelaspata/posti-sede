import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAppStore } from "@/store/app-store";
// import { SvgUri } from 'react-native-svg';
import { Image } from "expo-image";
export default function ModalDetailLocation() {
    const { location: locationFromStore } = useAppStore();

    const colorScheme = useColorScheme();
    const tintColor = useThemeColor({}, 'tint');
    const whiteTextColor = useThemeColor({}, 'whiteText');
    const borderColor = useThemeColor({}, 'border');

    return <ThemedSafeAreaView style={{ flex: 1 }}  >
        <ThemedView style={{ flex: 1 }}>
            <ThemedText type="title" style={{ margin: 16 }}>
                Dettagli Sede
            </ThemedText>
            <ThemedText type="subtitle" style={{ margin: 16 }}>
                {locationFromStore?.name}
            </ThemedText>
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                {locationFromStore?.image_floorplan &&
                    <ThemedView style={{ flex: 1, width: "100%", padding: 16 }}>
                        <ThemedText>Mappa della sede</ThemedText>
                        <Image style={{ width: "100%", height: 450, }} source={{ uri: locationFromStore?.image_floorplan }} />
                    </ThemedView>
                }
            </ThemedView>
            {/* close button */}
            <Pressable onPress={() => router.back()}>
                <ThemedText type="link" style={{ textAlign: 'center' }}>
                    Chiudi
                </ThemedText>
            </Pressable>
        </ThemedView>
    </ThemedSafeAreaView >
}

const styles = StyleSheet.create({
    date: {
        borderWidth: 1,
        paddingVertical: 8,
        borderRadius: 4,
        paddingHorizontal: 16,
        marginBottom: 8
    }
})