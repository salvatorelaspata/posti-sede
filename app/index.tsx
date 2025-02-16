import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { getTenants } from '@/db/api';

import { ThemedView } from '@/components/ThemedView';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Tenant } from '@/types';
import { useAuthStore } from '@/store/auth-store';

export default function App() {
  const { setTenant } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantIndex, setSelectedTenantIndex] = useState<number>(0);
  useEffect(() => {
    getTenants().then((tenants) => {
      setTenants(tenants);
      setSelectedTenantIndex(0);
    });
  }, []);

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

          {/* development select tenant*/}
          <ThemedView>
            <SegmentedControl
              values={tenants.map((tenant) => tenant.name)}
              selectedIndex={selectedTenantIndex}
              onChange={(event) => {
                setSelectedTenantIndex(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </ThemedView>

          <TouchableOpacity style={styles.button}
            onPress={() => {
              console.log(tenants[selectedTenantIndex]);
              setTenant(tenants[selectedTenantIndex].id);
              router.replace('/(app)');
            }}>
            <Text style={styles.buttonText}>
              Accedi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={() => router.navigate('/signup')}>
            <Text style={styles.toggleText}>
              Non hai un account? Registrati
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
});