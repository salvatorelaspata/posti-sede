import React from 'react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Tabs as ExpoTabs, useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
// import { ThemedText } from '@/components/ThemedText';
// import { useSession } from '@/context/auth';

export default function Tabs() {
  const colorScheme = useColorScheme();
  // get params 
  const { location } = useLocalSearchParams();
  // const { session, isLoading } = useSession();
  // if (isLoading) return <ThemedText>Loading...</ThemedText>;
  // if (!session) return <Redirect href="/" />;

  return (
    <ExpoTabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
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
