// create a simple react native page with login and register buttons

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/auth';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';

export default function App() {
  const { signIn } = useSession();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Home Screen</ThemedText>
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername}/>
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword}/>
      <Button
        title="Login"
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/(app)');
        }}
      />
      <Button
        title="Go to Register"
        onPress={() => router.navigate('/signup')}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
