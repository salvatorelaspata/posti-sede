import React from 'react';
import { TabButton } from '@/components/TabButton';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import HeaderBackground from '@/components/ui/HeaderBackground';
// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '@/store/app-store';
import { useUser } from '@clerk/clerk-expo';
import { SpecialTabButton } from '@/components/SpecialTabButton';

export default function Layout() {
  const colorScheme = useColorScheme();
  const { location, isAdmin } = useAppStore();
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  // const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
    // screenOptions={{
    //   tabBarActiveTintColor: colors.tint,
    //   tabBarInactiveTintColor: colors.inactiveText,
    //   headerShown: true,
    //   tabBarButton: HapticTab,
    //   tabBarBackground: TabBarBackground,
    //   headerBackground: HeaderBackground,
    //   tabBarStyle: {
    //     backgroundColor: colors.background,
    //     borderTopColor: colors.border,
    //     shadowColor: colors.cardShadow,
    //     shadowOffset: { width: 0, height: -2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 5,
    //   },
    //   headerStyle: {
    //     backgroundColor: colors.background,
    //     shadowColor: colors.cardShadow,
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 5,
    //     borderBottomWidth: 1,
    //     borderBottomColor: colors.border,
    //   },
    //   headerTitleStyle: {
    //     color: colors.text,
    //     fontWeight: '600',
    //   },
    //   headerTintColor: colors.tint,
    //   headerShadowVisible: false,
    // }}
    >
      <TabSlot />
      <TabList
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          marginHorizontal: 16,
          marginBottom: 34,
          borderRadius: 24,
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <TabTrigger
          name="home"
          href="/home"
          asChild
        // screenOptions={{
        //   title: `Sede ${location?.name}`,
        //   tabBarIcon: ({ color, size }: { color: string, size: number }) => 
        //     <IconSymbol size={size} name="house.fill" color={color} />,
        // }}
        >
          <TabButton icon="home">Home</TabButton>
        </TabTrigger>
        <TabTrigger
          name="reservations"
          href="/reservations"
          asChild
        // screenOptions={{
        //   title: `Prenotazioni - Sede ${location?.name}`,
        //   tabBarIcon: ({ color, size }: { color: string, size: number }) => 
        //     <IconSymbol size={size} name="calendar.and.person" color={color} />,
        // }}
        >
          <TabButton icon="calendar">Prenotazioni</TabButton>
        </TabTrigger>
        {isAdmin && (
          <TabTrigger
            name="admin"
            href={"/admin"}
            asChild
          // screenOptions={{
          //   title: 'Amministrazione',
          //   tabBarIcon: ({ color, size }: { color: string, size: number }) =>
          //     <IconSymbol size={size} name="gear" color={color} />,
          // }}
          >
            <TabButton icon="leaf">Admin</TabButton>
          </TabTrigger>
        )}
        <TabTrigger
          name="settings"
          href="/settings"
          asChild
        // screenOptions={{
        //   title: 'Impostazioni',
        //   tabBarIcon: ({ color, size }: { color: string, size: number }) =>
        //     <IconSymbol size={size} name="gearshape" color={color} />,
        // }}
        >
          <TabButton icon="cog">Impostazioni</TabButton>
        </TabTrigger>
      </TabList>
      <SpecialTabButton />
    </Tabs>
  );
}