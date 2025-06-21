import { Pressable } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAppStore } from "@/store/app-store";

export default function ModalDetailLocation() {
    const { location } = useAppStore();

    return <ThemedSafeAreaView style={{ flex: 1 }}  >
        <ThemedView style={{ flex: 1 }}>
            <ThemedText type="title" style={{ margin: 16 }}>
                Dettagli Sede
            </ThemedText>
            <ThemedText type="subtitle" style={{ margin: 16 }}>
                {location?.name}
            </ThemedText>
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                {location?.image_floorplan &&
                    <ThemedView style={{ flex: 1, width: "100%", padding: 16 }}>
                        <ThemedText>Mappa della sede</ThemedText>
                        <Image style={{ width: "100%", height: 450, }} source={{ uri: location?.image_floorplan }} />
                    </ThemedView>
                }
            </ThemedView>
            <Pressable onPress={() => router.back()}>
                <ThemedText type="link" style={{ textAlign: 'center' }}>
                    Chiudi
                </ThemedText>
            </Pressable>
        </ThemedView>
    </ThemedSafeAreaView >
}