import React from 'react';
import { Stack } from 'expo-router';
export default function App() {
  return (<Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="modalDetailBooking" options={{ presentation: 'modal' }} />
  </Stack>);
}
