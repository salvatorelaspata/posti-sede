import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="index" options={{ title: 'Impostazioni', headerShown: false }} />
            <Stack.Screen name="profile" options={{ title: 'Profilo', headerShown: false }} />
            <Stack.Screen name="change-password" options={{ title: 'Cambia Password', headerShown: false }} />
        </Stack>
    );
}
