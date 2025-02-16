import { create } from 'zustand';
import { Location, Room, Booking } from '@/types';
type AppState = {
    location: Location | null;
    room: Room | null;
    booking: Booking | null;
    setLocation: (location: Location) => void;
    setRoom: (room: Room) => void;
    setBooking: (booking: Booking) => void;
};

export const useAppStore = create<AppState>((set: any) => ({
    location: null,
    room: null,
    booking: null,
    setLocation: (location: Location) => set({ location }),
    setRoom: (room: Room) => set({ room }),
    setBooking: (booking: Booking) => set({ booking }),
}));