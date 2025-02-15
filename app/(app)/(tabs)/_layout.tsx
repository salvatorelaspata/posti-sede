import React from 'react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Tabs as ExpoTabs, useLocalSearchParams } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Tabs() {
  const colorScheme = useColorScheme();
  const { location } = useLocalSearchParams();
  return (
    <ExpoTabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground
      }}>
      <ExpoTabs.Screen
        name="index"
        options={{
          title: `Sede ${location as string}`,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="admin"
        options={{
          title: 'Admin Section',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </ExpoTabs>
  );
}
