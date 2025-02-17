import React from 'react';
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
  const { location } = useAppStore();
  const { user } = useUser();
  return (
    <ExpoTabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
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

      <ExpoTabs.Screen
        name="admin"
        options={{
          href: user?.publicMetadata.role === 'admin' ? '/admin' : null,
          title: `Admin Section - Sede ${location?.name}`,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
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
