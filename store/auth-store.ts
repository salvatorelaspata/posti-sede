import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { User } from '@/types';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { tenants, users } from '@/db/schema';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// const secureStoreAdapter = {
//     getItem: async (name: string): Promise<string | null> => {
//         return await getItemAsync(name);
//     },
//     setItem: async (name: string, value: string): Promise<void> => {
//         await setItemAsync(name, value);
//     },
//     removeItem: async (name: string): Promise<void> => {
//         await deleteItemAsync(name);
//     },
// };

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
                    await setItemAsync('authToken', token);
                } catch (error) {
                    set({ error: 'Failed to save session', isLoading: false });
                }

                set({ user: user, token, isLoading: false });

            },

            signOut: () => {
                deleteItemAsync('authToken');
                set({ user: null, token: null, tenant: null });
            },

            hydrateAuth: async () => {
                set({ isLoading: true });
                try {
                    const token = await getItemAsync('authToken');
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

                // retrieve user and tenant in one query
                const user = await db.select()
                    .from(users)
                    .leftJoin(tenants, eq(users.tenantId, tenants.id))
                    .where(eq(users.email, email) && eq(users.password, password))
                    .limit(1);

                if (user.length === 0) {
                    throw new Error('Credenziali non valide');
                }
                const tenant = user[0].tenants ? user[0].tenants.id : null;
                try {
                    await setItemAsync('authToken', user[0].users.id);
                } catch (error) {
                    throw error;
                }
                set({ user: user[0].users, tenant: tenant, isLoading: false });
            },

            resetPassword: async (email) => {
                // Implementa logica di reset password
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state: AuthState) => ({
                token: state.token,
                user: state.user,
                tenant: state.tenant
            })
        }
    )
);