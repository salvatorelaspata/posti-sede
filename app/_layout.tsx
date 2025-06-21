
import { AuthProvider } from '@/context/auth';
import { Stack, usePathname } from 'expo-router'
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  initialRouteName: 'landing',
};

export default function RootLayout() {

  const pathname = usePathname();
  console.log('RootLayout pathname:', pathname);


  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="login"
          options={{ animation: "none", headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          options={{ animation: "none", headerShown: false }}
        />
        <Stack.Screen
          name="landing"
          options={{ animation: "none", headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  )
}