import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserFromEmailAndPassword, getTenantFromEmail, getUserByEmailAndPassword, updateUser } from '@/db/api';

type AuthState = {
    user: Partial<User> | null;
    tenant: string | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    setTenant: (tenant: string | null) => void;
    hydrateAuth: () => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInBasic: (email: string, password: string) => Promise<void>;
    signInGoogle: (user: Partial<User>, token: string) => Promise<void>;
    signOut: () => void;
    resetPassword: (email: string, oldPassword: string, newPassword: string) => Promise<void>;
    updateProfile: (name: string, emoji: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            tenant: null,
            token: null,
            isLoading: false,
            error: null,
            // Start of Selection
            signUp: async (email: string, password: string, name: string) => {
                // insert into user table using drizzle
                try {
                    const user = await createUserFromEmailAndPassword(email, password, name);
                    set({ user: user[0], isLoading: false });
                    await setItemAsync('authToken', user[0].id);
                } catch (error) {
                    throw error;
                }
            },
            setTenant: (tenant: string | null) => set({ tenant }),
            signInGoogle: async (user: Partial<User>, token: string) => {
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
                const user = await getUserByEmailAndPassword(email, password);
                if (user.length === 0) {
                    throw new Error('Credenziali non valide');
                }

                console.log({ user });

                const tenant = await getTenantFromEmail(email);
                try {
                    await setItemAsync('authToken', user[0].id);
                } catch (error) {
                    throw error;
                }
                set({ user: user[0], tenant: tenant.id, isLoading: false });
            },
            updateProfile: async (name: string, emoji: string) => {
                const userId = get().user?.id;
                if (!userId) {
                    throw new Error('Utente non trovato');
                }
                const updatedUser = await updateUser(userId, { fullname: name, emoji });
                set({ user: updatedUser });
            },
            resetPassword: async (email, oldPassword, newPassword) => {
                // TODO: send email to user with reset password link
                // for the moment just log the email
                console.log({ email, oldPassword, newPassword });
                // check if old password is correct
                const user = await getUserByEmailAndPassword(email, oldPassword);
                if (user.length === 0) {
                    throw new Error('Password non valida');
                }
                // update password
                const updatedUser = await updateUser(user[0].id, { password: newPassword });
                set({ user: updatedUser });
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