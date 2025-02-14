import { Tabs, Redirect, Stack } from 'expo-router';
import React from 'react';
// import { Platform } from 'react-native';

// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { useSession } from '@/context/auth';

export default function App() {
  // const colorScheme = useColorScheme();

  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/" />;
  }


  // This layout can be deferred because it's not the root layout.

  return (<Stack screenOptions={{
    headerShown: false
  }} />);
  // <Tabs
  //   screenOptions={{
  //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
  //     headerShown: false,
  //     tabBarButton: HapticTab,
  //     tabBarBackground: TabBarBackground,
  //     tabBarStyle: Platform.select({
  //       ios: {
  //         // Use a transparent background on iOS to show the blur effect
  //         position: 'absolute',
  //       },
  //       default: {},
  //     }),
  //   }}>
  //   <Tabs.Screen
  //     name="index"
  //     options={{
  //       title: 'Home',
  //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
  //     }}
  //   />
  //   <Tabs.Screen
  //     name="explore"
  //     options={{
  //       title: 'Explore',
  //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
  //     }}
  //   />
  // </Tabs>
  // );
}
