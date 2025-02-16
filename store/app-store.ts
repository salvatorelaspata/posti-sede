import { create } from 'zustand';
import { Location, Room, Booking } from '@/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
type AppState = {
    location: Location | null;
    room: Room | null;
    booking: Booking | null;
    setLocation: (location: Location) => void;
    setRoom: (room: Room) => void;
    setBooking: (booking: Booking) => void;
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            location: null,
            room: null,
            booking: null,
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