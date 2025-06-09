import React from 'react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import HeaderBackground from '@/components/ui/HeaderBackground';
import { Tabs as ExpoTabs } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '@/store/app-store';
import { useUser } from '@clerk/clerk-expo';
import { SpecialTabButton } from '@/components/SpecialTabButton';

export default function Tabs() {

  const colorScheme = useColorScheme();
  const { location, isAdmin } = useAppStore();
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ExpoTabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.inactiveText,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        headerBackground: HeaderBackground, // Usiamo il nostro header personalizzato
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
        headerTintColor: colors.tint,
        headerShadowVisible: false, // Disabilitiamo l'ombra di default per usare la nostra
      }}>
      <ExpoTabs.Screen
        name="home"
        options={{
          title: `Sede ${location?.name}`,
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <IconSymbol size={size} name="house.fill" color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="reservations"
        options={{
          title: `Prenotazioni - Sede ${location?.name}`,
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <IconSymbol size={size} name="calendar.and.person" color={color} />,
        }}
      />

      <ExpoTabs.Screen
        name="add"
        options={{
          tabBarButton: SpecialTabButton
        }}
      />
      <ExpoTabs.Screen
        name="admin"
        options={{
          href: isAdmin ? '/admin' : null,
          title: `Admin Section - Sede ${location?.name}`,
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <IconSymbol size={size} name="person.fill" color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Impostazioni',
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <IconSymbol size={size} name="gearshape.fill" color={color} />,
        }}
      />
    </ExpoTabs>
  );
}
