import React, { useContext } from 'react';
// import { TabButton } from '@/components/TabButton';
// import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { SpecialTabButton } from '@/components/SpecialTabButton';
// import { StyleSheet } from 'react-native';
import { useAppStore } from '@/store/app-store';
import { AuthContext } from '@/utils/authContext';
import { Tabs, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SpecialTabButton } from '@/components/SpecialTabButton';
import { useThemeColor } from '@/hooks/useThemeColor';

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

  // return (
  //   <Tabs>
  //     <TabSlot />
  //     <TabList
  //       style={[styles.tabList, {
  //         backgroundColor: colorScheme === 'dark' ?
  //           'rgba(80, 185, 233, 0.15)' :
  //           'rgba(10, 126, 164, 0.15)',
  //         borderColor: colorScheme === 'dark' ?
  //           'rgba(80, 185, 233, 0.80)' :
  //           'rgba(10, 126, 164, 0.80)',
  //         shadowColor: colorScheme === 'dark' ? '#000' : '#fff',
  //       }]}
  //     >
  //       <TabTrigger asChild
  //         name="home"
  //         href="/(protected)/(tabs)/home"
  //       >
  //         <TabButton icon="home">Home</TabButton>
  //       </TabTrigger>
  //       <TabTrigger asChild
  //         name="reservations"
  //         href="/(protected)/(tabs)/reservations"
  //       >
  //         <TabButton icon="calendar">Prenotazioni</TabButton>
  //       </TabTrigger>
  //       {isAdmin && (
  //         <TabTrigger asChild
  //           name="admin"
  //           href={"/(protected)/(tabs)/admin"}
  //         >
  //           <TabButton icon="leaf">Admin</TabButton>
  //         </TabTrigger>
  //       )}
  //       <TabTrigger asChild
  //         name="settings"
  //         href="/(protected)/(tabs)/settings"
  //       >
  //         <TabButton icon="cog">Impostazioni</TabButton>
  //       </TabTrigger>
  //     </TabList>
  //     <SpecialTabButton />
  //   </Tabs>
  // );
  const tintColor = useThemeColor({}, 'tint');
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: tintColor }}
      backBehavior="order"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
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
          href: isAdmin ? "/(protected)/(tabs)/settings" : null,
          title: "Impostazioni",
          // headerShown: false,
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
      {/* modal */}
      {/* <Tabs.Screen
        name="add"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
          },
        })}
        options={{
          title: '',
          tabBarIcon({ focused }) {
            return <SpecialTabButton />
          },
        }}
      /> */}
    </Tabs>
  )
}

// const styles = StyleSheet.create({
//   tabList: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     zIndex: 1000,
//     marginHorizontal: 16,
//     marginBottom: 24,
//     borderRadius: 30,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 8,
//     borderWidth: 0.5,
//     backdropFilter: 'blur(2px) saturate(180%)',
//   },
// });