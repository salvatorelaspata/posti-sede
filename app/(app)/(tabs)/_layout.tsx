import React, { useEffect, useState } from 'react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Tabs as ExpoTabs } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '@/store/app-store';
import { useUser } from '@clerk/clerk-expo';
import { getUserRole } from '@/db/api';
// import { getUserRole } from '@/db/api';

export default function Tabs() {
  const colorScheme = useColorScheme();
  const { location } = useAppStore();
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const role = await getUserRole(user.id);
          console.log('User role:', role);
          setIsAdmin(role === 'admin');
        } catch (error) {
          console.error('Error fetching user role:', error);
          setIsAdmin(false);
        }
      }
    };

    checkUserRole();
  }, [user]);

  // Gestione del caricamento
  if (!isLoaded) {
    return null; // O un componente di loading
  }

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
