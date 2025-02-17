import { create } from 'zustand';
import { Location, Room, Booking, Tenant, User } from '@/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppState = {
    user: User | null;
    tenant: Tenant | null;
    location: Location | null;
    room: Room | null;
    booking: Booking | null;
    setUser: (user: User) => void;
    setTenant: (tenant: Tenant) => void;
    setLocation: (location: Location) => void;
    setRoom: (room: Room) => void;
    setBooking: (booking: Booking) => void;
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            tenant: null,
            location: null,
            room: null,
            booking: null,
            setUser: (user: User) => set({ user }),
            setTenant: (tenant: Tenant) => set({ tenant }),
            setLocation: (location: Location) => set({ location }),
            setRoom: (room: Room) => set({ room }),
            setBooking: (booking: Booking) => set({ booking }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);