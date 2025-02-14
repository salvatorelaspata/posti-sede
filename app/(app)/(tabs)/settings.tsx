import { StyleSheet, Image, Platform, Button, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSession } from '@/context/auth';
import { useRouter } from 'expo-router';

export default function Settings() {
  const { signOut } = useSession();
  const router = useRouter()
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <Collapsible title="Dangerous actions">
        <TouchableOpacity style={styles.logoutButton} onPress={() => {
          signOut();
          router.replace('/');
        }}>
          <ThemedText type="defaultSemiBold" style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#FF0000',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF'
  },
});
