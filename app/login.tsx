import React, { useEffect, useLayoutEffect, useState } from 'react';
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

import { Colors } from '@/constants/Colors';
import { useSignIn, useUser } from '@clerk/clerk-expo';
import { checkTenant } from '@/db/api';
// import seed from '@/db/seed';


export default function Login() {
  const { user } = useUser();
  if (user) return <Redirect href="/(app)/rooms" />

  const { signIn, setActive, isLoaded } = useSignIn()
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const onSignEmailPress = React.useCallback(async () => {
    try {
      const tenant = await checkTenant(email);
      if (!tenant) {
        setError('Email non valida')
        return
      }
      setValidEmail(true);
      setIsLoading(false);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
      setError('Email non valida')
      setIsLoading(false);
    }
  }, [isLoaded, email, password])


  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return


    if (!email || !password) {
      setError('Email e password sono obbligatori')
      setIsLoading(false);
      return
    }
    const tenant = await checkTenant(email);
    if (!tenant) {
      setError('Email non valida')
      setIsLoading(false);
      return
    }
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })

        router.replace('/(app)/rooms')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
      setIsLoading(false);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      setError('Email o password errati')
      setIsLoading(false);
    }
  }, [isLoaded, email, password])
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={Colors.light.gradient as [string, string, string]}
        style={styles.gradient}
      >
        <View style={styles.headerContainer}>
          <FontAwesome5 name="user-circle" size={60} color="white" />
          <Text style={styles.headerText}>
            Bentornato!
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
          </View>
          {validEmail && (
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={24} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#666"
              />
            </View>
          )}

          <TouchableOpacity style={styles.loginButton} onPress={() => {
            setIsLoading(true);
            if (validEmail) {
              onSignInPress()
            } else {
              onSignEmailPress()
            }
          }}>
            {isLoading ? <ActivityIndicator size="small" color={Colors.light.whiteText} /> :
              <>
                <Ionicons name="log-in-outline" size={24} color={Colors.light.whiteText} />
                <Text style={styles.buttonText}>Accedi</Text>
              </>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={() => router.navigate('/signup')}>
            <Text style={styles.toggleText}>
              Non hai un account? Registrati
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton} onPress={() => router.navigate('/')}>
            <Text style={styles.toggleText}>
              Torna alla home
            </Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
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
  },
  headerText: {
    fontSize: 28,
    color: 'white',
    marginTop: 20,
    fontWeight: 'bold',
  },
  formsContainer: {
    flexDirection: 'row',
  },
  form: {
    width: "100%",
    backgroundColor: 'white',
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
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: Colors.light.tint,
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
    color: Colors.light.whiteText,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#4c669f',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});