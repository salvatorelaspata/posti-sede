import React, { useContext } from 'react';
import { useAppStore } from '@/store/app-store';
import { AuthContext } from '@/utils/authContext';
import { Tabs, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

// Blur background per iOS, colore per altri
const TabBarBackground = Platform.OS === 'ios' ? require('@/components/ui/TabBarBackground.ios').default : undefined;

export default function TabLayout() {
  const pathname = usePathname();
  console.log('TabLayout pathname:', pathname);

  // const colorScheme = useColorScheme();
  const { isAdmin } = useAppStore();
  const authContext = useContext(AuthContext);

  if (!authContext.isReady) {
    return null;
  }

  if (!authContext.isLoggedIn) {
    return null; // or a loading spinner
  }

  // Colori coerenti con il tema
  const activeTintColor = useThemeColor({}, 'tabIconSelected');
  const inactiveTintColor = useThemeColor({}, 'tabIconDefault');
  const tabBarBg = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: 60,
        },
        tabBarBackground: TabBarBackground ? () => <TabBarBackground /> : undefined,
        headerShown: false,
      }}
      backBehavior="order"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="numeric-1-box-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Prenotazioni",
          tabBarLabel: "Prenotazioni",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          href: isAdmin ? "/(protected)/(tabs)/admin" : null,
          tabBarLabel: "Admin",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="leaf"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          href: isAdmin ? "/(protected)/(tabs)/(settings)" : null,
          title: "Impostazioni",
          tabBarLabel: "Impostazioni",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}