// create a simple react native page with login and register buttons

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';

export default function SignUp() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Sign Up</ThemedText>
      {/* input username */}
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername}/>
      {/* input type password */}
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword}/>
      {/* login button */}
      <Button
        title="Go to Login"
        onPress={() => 
          router.replace('/')}
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
