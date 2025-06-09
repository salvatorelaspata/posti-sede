import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function App() {
  const { isSignedIn } = useAuth()
  if (!isSignedIn) {
    return <Redirect href={'/'} />
  }
  return (<Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="rooms" options={{ headerShown: false }} />
    <Stack.Screen name="modalDetailBooking" options={{ presentation: 'modal' }} />
    <Stack.Screen name="modalDetailLocation" options={{ presentation: 'modal' }} />
    <Stack.Screen name="modalRoomPeople" options={{ presentation: 'modal' }} />
    <Stack.Screen name="modalAllPeople" options={{ presentation: 'modal' }} />
  </Stack>);
}
