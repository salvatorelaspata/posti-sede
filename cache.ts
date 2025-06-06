import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { TokenCache } from '@clerk/clerk-expo/dist/cache'

const createTokenCache = (): TokenCache => {
    return {
        getToken: async (key: string) => {
            console.log(`Getting token for key: ${key} 🔐`)
            try {
                const item = await SecureStore.getItemAsync(key)
                if (item) {
                    console.log(`${key} was used 🔐 \n`)
                } else {
                    console.log('No values stored under key: ' + key)
                }
                return item
            } catch (error) {
                console.error('secure store get item error: ', error)
                await SecureStore.deleteItemAsync(key)
                return null
            }
        },
        saveToken: (key: string, token: string) => {
            console.log(`Saving token for key: ${key} 🔐`)
            return SecureStore.setItemAsync(key, token)
        },
        clearToken: async (key: string) => {
            console.log(`Removing token for key: ${key} 🔐`)
            try {
                await SecureStore.deleteItemAsync(key)
                console.log(`${key} was removed 🔐 \n`)
            } catch (error) {
                console.error('secure store delete item error: ', error)
            }
        }
    }
}

// SecureStore is not supported on the web
export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined