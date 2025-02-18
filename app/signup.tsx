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
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useSignUp, useUser } from '@clerk/clerk-expo';
import { checkTenant, createEmployeeFromEmailAndPassword } from '@/db/api';


export default function SignUp() {
  const { user } = useUser();
  if (user) return <Redirect href="/(app)/rooms" />
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
          colors={Colors.light.gradient as [string, string, string]}
          style={styles.gradient}
        >
          <View style={styles.headerContainer}>
            <MaterialIcons name="email" size={60} color="white" />
            <Text style={styles.headerText}>
              Verify your email
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={24} color="#666" />
              <TextInput
                value={code}
                style={styles.input}
                placeholder="Enter your verification code"
                onChangeText={(code) => setCode(code)}
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button title="Verify" onPress={onVerifyPress} />

          </View>

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
        colors={Colors.light.gradient as [string, string, string]}
        style={styles.gradient}
      >
        <View style={styles.headerContainer}>
          <FontAwesome5 name="user-circle" size={60} color="white" />
          <Text style={styles.headerText}>
            Crea Account
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Cognome"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#666"
            />
          </View>
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
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>
              Registrati
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={() => router.navigate('/login')}>
            <Text style={styles.toggleText}>
              Hai già un account? Accedi
            </Text>
          </TouchableOpacity>
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 10,
  },
});