import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';

import { Colors, gradient } from '@/constants/Colors';
// import { checkTenant } from '@/db/api';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/auth';
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton';
// import seed from '@/db/seed';


export default function Login() {
  const { user, signIn, isLoading } = useAuth();
  if (user) return <Redirect href="/(protected)/rooms" />

  const _signIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  const colorScheme = useColorScheme();
  const tintColor = useThemeColor({}, 'tint');
  // const whiteTextColor = useThemeColor({}, 'whiteText');
  // const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  // const inactiveTextColor = useThemeColor({}, 'inactiveText');
  // const inputBackground = useThemeColor({}, 'statBackground');

  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // const [email, setEmail] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  // const [error, setError] = useState<string>('');
  // const [validEmail, setValidEmail] = useState<boolean>(false);
  // const onSignEmailPress = React.useCallback(async () => {
  //   try {
  //     const tenant = await checkTenant(email);
  //     if (!tenant) {
  //       setError('Email non valida')
  //       return
  //     }
  //     setValidEmail(true);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error(JSON.stringify(err, null, 2))
  //     setError('Email non valida')
  //     setIsLoading(false);
  //   }
  // }, [isAuthLoading, email, password])


  // const onSignInPress = React.useCallback(async () => {
  //   if (!isAuthLoading) return

  //   if (!email || !password) {
  //     setError('Email e password sono obbligatori')
  //     setIsLoading(false);
  //     return
  //   }
  //   const tenant = await checkTenant(email);
  //   if (!tenant) {
  //     setError('Email non valida')
  //     setIsLoading(false);
  //     return
  //   }
  //   // Start the sign-in process using the email and password provided
  //   try {
  //     await signIn();
  //     router.replace('/(protected)/rooms');
  //     setIsLoading(false);
  //   } catch (err: any) {
  //     if (err.status === 422) setError('Account non trovato. Registrati!')
  //     else setError('Email o password errati')
  //     setIsLoading(false);
  //   }
  // }, [isAuthLoading, email, password])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={colorScheme === 'dark'
          ? ['#1a1a1a', '#2a2a2a', '#3a3a3a']
          : gradient as [string, string, string]
        }
        style={styles.gradient}
      >
        <ThemedView style={styles.headerContainer}>
          <FontAwesome5 name="user-circle" size={60} color="white" />
          <ThemedText type="title" style={styles.headerText} lightColor="white" darkColor="white">
            Bentornato!
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.form, { backgroundColor: cardBackground }]}>
          {/* <ThemedView style={[styles.inputContainer, { backgroundColor: inputBackground }]}>
            <MaterialIcons name="email" size={24} color={inactiveTextColor} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={inactiveTextColor}
            />
          </ThemedView>
          {validEmail && (
            <ThemedView style={[styles.inputContainer, { backgroundColor: inputBackground }]}>
              <MaterialIcons name="lock" size={24} color={inactiveTextColor} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={inactiveTextColor}
              />
            </ThemedView>
          )} */}

          {/* <TouchableOpacity style={[styles.loginButton, { backgroundColor: tintColor }]} onPress={() => {
            setIsLoading(true);
            if (validEmail) {
              onSignInPress()
            } else {
              onSignEmailPress()
            }
          }}>
            {isLoading ? <ActivityIndicator size="small" color={whiteTextColor} /> :
              <>
                <Ionicons name="log-in-outline" size={24} color={whiteTextColor} />
                <ThemedText style={[styles.buttonText, { color: whiteTextColor }]}>Accedi</ThemedText>
              </>
            }
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.toggleButton} onPress={() => router.navigate('/signup')}>
            <ThemedText style={[styles.toggleText, { color: tintColor }]}>
              Non hai un account? Registrati
            </ThemedText>
          </TouchableOpacity> */}

          {/* {error && <ThemedText style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].error }]}>{error}</ThemedText>} */}

          <SignInWithGoogleButton onPress={_signIn} disabled={isLoading} />

          <TouchableOpacity style={styles.toggleButton} onPress={() => router.navigate('/landing')}>
            <ThemedText style={[styles.toggleText, { color: tintColor }]}>
              Torna alla home
            </ThemedText>
          </TouchableOpacity>

        </ThemedView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  headerText: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  formsContainer: {
    flexDirection: 'row',
  },
  form: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
  },
});