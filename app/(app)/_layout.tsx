import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useAuthStore } from '@/store/auth-store';

export default function App() {
  const { user } = useAuthStore();

  // if (!user) return <Redirect href="/" />;

  return (<Stack screenOptions={{
    headerShown: false
  }} />);
}
