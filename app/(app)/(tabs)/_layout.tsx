import React, { useEffect, useState } from 'react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Tabs as ExpoTabs } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '@/store/app-store';
import { useUser } from '@clerk/clerk-expo';

export default function Tabs() {

  const colorScheme = useColorScheme();
  const { location, isAdmin, } = useAppStore();
  const { isLoaded } = useUser();

  // Gestione del caricamento
  if (!isLoaded) {
    return null; // O un componente di loading
  }

  return (
    <ExpoTabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].inactiveText,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        headerBackground: TabBarBackground,
        headerTitleStyle: {
          color: Colors[colorScheme ?? 'light'].text,
        },
      }}>
      <ExpoTabs.Screen
        name="home"
        options={{
          title: `Sede ${location?.name}`,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="reservations"
        options={{
          title: `Prenotazioni - Sede ${location?.name}`,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="calendar.and.person" color={color} />,
        }}
      />
      {/* {isAdmin && ( */}
      <ExpoTabs.Screen
        name="admin"
        options={{
          href: isAdmin ? '/admin' : null,
          title: `Admin Section - Sede ${location?.name}`,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      {/* )} */}
      <ExpoTabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Impostazioni',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </ExpoTabs>
  );
}
