import React, { useContext } from 'react';
import { Redirect, Stack, usePathname } from 'expo-router';
import { AuthContext } from '@/utils/authContext';

export default function ProtectedLayout() {
  const authContext = useContext(AuthContext);

  const pathname = usePathname();
  console.log('ProtectedLayout pathname:', pathname);
  if (!authContext.isReady) {
    return null; // or a loading spinner
  }

  if (!authContext.isLoggedIn) {
    return <Redirect href={'/login'} />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* screens */}
      <Stack.Screen name="rooms" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'simple_push' }} />
      {/* modals */}
      <Stack.Screen name="modalDetailBooking" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modalDetailLocation" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modalRoomPeople" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modalAllPeople" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modalCreateSchedule" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
