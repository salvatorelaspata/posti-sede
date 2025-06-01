import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Button,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { Colors, gradient } from '@/constants/Colors';
import { useSignUp, useUser } from '@clerk/clerk-expo';
import { checkTenant, createEmployeeFromEmailAndPassword } from '@/db/api';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


export default function SignUp() {
  const { user } = useUser();
  if (user) return <Redirect href="/(app)/rooms" />

  const colorScheme = useColorScheme();
  const tintColor = useThemeColor({}, 'tint');
  const whiteTextColor = useThemeColor({}, 'whiteText');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const inactiveTextColor = useThemeColor({}, 'inactiveText');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [pendingVerification, setPendingVerification] = useState<boolean>(false)
  const [code, setCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { isLoaded, signUp, setActive } = useSignUp()

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Errore', 'Tutti i campi sono obbligatori');
      return;
    }
    // check if the email (domain) is allowed
    const isAllowed = await checkTenant(email)
    if (!isAllowed) {
      Alert.alert('Errore', 'Il dominio dell\'email non è autorizzato');
      return;
    }
    if (!isLoaded) return
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
      setError('')
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      if (err.status === 422) {
        setError(`La password è stata trovata in una violazione dei dati online. Per la sicurezza dell'account, si prega di utilizzare una password diversa.`)
      } else {
        setError('Errore durante la registrazione')
      }
    }

  }
  const onVerifyPress = async () => {
    if (!isLoaded) return
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (signUpAttempt.status === 'complete') {
        const clerkId = signUpAttempt?.createdUserId || ""
        await createEmployeeFromEmailAndPassword(email, clerkId, firstName, lastName)
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(app)/rooms')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
        setError('Codice OTP errato')
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      setError('Codice OTP errato')
    }
  }

  if (pendingVerification) {
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
            <MaterialIcons name="email" size={60} color="white" />
            <ThemedText type="title" style={styles.headerText} lightColor="white" darkColor="white">
              Verifica la tua email
            </ThemedText>
          </ThemedView>

          <ThemedView style={[styles.form, { backgroundColor: cardBackground }]}>
            <ThemedView style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2B2B2B' : '#f8f9fa' }]}>
              <MaterialIcons name="vpn-key" size={24} color={inactiveTextColor} />
              <TextInput
                value={code}
                style={[styles.input, { color: textColor }]}
                placeholder="Inserisci il codice di verifica"
                onChangeText={(code) => setCode(code)}
                placeholderTextColor={inactiveTextColor}
              />
            </ThemedView>
            {error && <ThemedText style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].error }]}>{error}</ThemedText>}

            <TouchableOpacity style={[styles.button, { backgroundColor: tintColor }]} onPress={onVerifyPress}>
              <Ionicons name="checkmark-circle-outline" size={24} color={whiteTextColor} />
              <ThemedText style={[styles.buttonText, { color: whiteTextColor, marginLeft: 8 }]}>Verifica</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </LinearGradient>
      </KeyboardAvoidingView>
    )
  }


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
          <FontAwesome5 name="user-plus" size={60} color="white" />
          <ThemedText type="title" style={styles.headerText} lightColor="white" darkColor="white">
            Crea Account
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.form, { backgroundColor: cardBackground }]}>
          <ThemedView style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2B2B2B' : '#f8f9fa' }]}>
            <MaterialIcons name="person" size={24} color={inactiveTextColor} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Nome"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor={inactiveTextColor}
            />
          </ThemedView>

          <ThemedView style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2B2B2B' : '#f8f9fa' }]}>
            <MaterialIcons name="person-outline" size={24} color={inactiveTextColor} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Cognome"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor={inactiveTextColor}
            />
          </ThemedView>

          <ThemedView style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2B2B2B' : '#f8f9fa' }]}>
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

          <ThemedView style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2B2B2B' : '#f8f9fa' }]}>
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

          {error && <ThemedText style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].error }]}>{error}</ThemedText>}

          <TouchableOpacity style={[styles.button, { backgroundColor: tintColor }]} onPress={handleSignUp}>
            <Ionicons name="person-add-outline" size={24} color={whiteTextColor} />
            <ThemedText style={[styles.buttonText, { color: whiteTextColor, marginLeft: 8 }]}>
              Registrati
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={() => router.navigate('/login')}>
            <ThemedText style={[styles.toggleText, { color: tintColor }]}>
              Hai già un account? Accedi
            </ThemedText>
          </TouchableOpacity>
          <ThemedText type="small" >
            N.B. E' necessario che la mail aziendale sia configurata per poter accedere a posti sede.
          </ThemedText>
        </ThemedView>
      </LinearGradient>
    </KeyboardAvoidingView >
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    marginBottom: 16
  },
  errorText: {
    marginBottom: 10,
    fontSize: 14,
  },
});