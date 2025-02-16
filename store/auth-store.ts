import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import SecureStore from 'expo-secure-store';
import { User } from '@/types';

type AuthState = {
    user: Partial<User> | null;
    tenant: string | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    setTenant: (tenant: string | null) => void;
    signIn: (user: Partial<User>, token: string) => Promise<void>;
    signOut: () => void;
    hydrateAuth: () => Promise<void>;
    signInBasic: (email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
};

const secureStoreAdapter = {
    getItem: async (name: string): Promise<string | null> => {
        return await SecureStore.getItemAsync(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await SecureStore.deleteItemAsync(name);
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            tenant: null,
            token: null,
            isLoading: false,
            error: null,

            setTenant: (tenant: string | null) => set({ tenant }),
            signIn: async (user: Partial<User>, token: string) => {
                set({ isLoading: true });
                try {
                    await SecureStore.setItemAsync('authToken', token);
                    set({ user, token, isLoading: false });
                } catch (error) {
                    set({ error: 'Failed to save session', isLoading: false });
                }
            },

            signOut: () => {
                SecureStore.deleteItemAsync('authToken');
                set({ user: null, token: null, tenant: null });
            },

            hydrateAuth: async () => {
                set({ isLoading: true });
                try {
                    const token = await SecureStore.getItemAsync('authToken');
                    if (token) {
                        // Aggiungi qui una chiamata API per verificare il token
                        // e ottenere user/tenant aggiornati
                    }
                    set({ isLoading: false });
                } catch (error) {
                    set({ error: 'Failed to hydrate auth', isLoading: false });
                }
            },

            signInBasic: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    // Simula chiamata API al backend
                    const response = await fetch('/api/auth/basic', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) throw new Error('Credenziali non valide');

                    const { user, token } = await response.json();

                    await SecureStore.setItemAsync('authToken', token);
                    set({ user, token, isLoading: false });

                } catch (error: any) {
                    set({ error: error.message || 'Login failed', isLoading: false });
                }
            },

            resetPassword: async (email) => {
                // Implementa logica di reset password
            }
        }),
        {
            name: 'auth-storage',
            // storage: secureStoreAdapter, // FIXME: remove this
            partialize: (state: AuthState) => ({
                token: state.token,
                user: state.user,
                tenant: state.tenant
            })
        }
    )
);