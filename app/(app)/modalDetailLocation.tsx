import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useAppStore } from "@/store/app-store";
// import { SvgUri } from 'react-native-svg';
import { Image } from "expo-image";
export default function ModalDetailLocation() {
    const { location: locationFromStore } = useAppStore();
    return <ThemedSafeAreaView style={{ flex: 1 }}  >
        <ThemedView style={{ flex: 1 }}>
            <ThemedText type="title" style={{ margin: 16 }}>
                Dettagli Sede
            </ThemedText>
            <ThemedText type="subtitle" style={{ margin: 16 }}>
                {locationFromStore?.name}
            </ThemedText>
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Image style={{ width: "100%", height: 450, }} source={require('@/assets/Sede - Gotonext.svg')} />
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
        backgroundColor: Colors.light.tint,
        color: Colors.light.whiteText,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 8,
        borderRadius: 4,
        paddingHorizontal: 16,
        marginBottom: 8
    }
})