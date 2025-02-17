import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdminStats, getAttendance } from '@/db/api';

type AdminState = {
    mode: 'calendar' | 'detail';
    setMode: (mode: 'calendar' | 'detail') => void;
    selectedMonth: number;
    setSelectedMonth: (selectedMonth: number) => void;
    selectedYear: number;
    setSelectedYear: (selectedYear: number) => void;
    fetchStats: (locationId: string, month: number, year: number) => void;
    stats: {
        occupancy: number | string;
        bookings: number;
        rooms: number;
    };
    attendance: any[];
    fetchAttendance: (locationId: string, month: number, year: number) => void;
};

export const useAdminStore = create<AdminState>()(
    persist(
        (set, get) => ({
            mode: 'calendar',
            setMode: (mode: 'calendar' | 'detail') => set({ mode }),
            selectedMonth: new Date().getMonth(),
            setSelectedMonth: (selectedMonth: number) => set({ selectedMonth }),
            selectedYear: new Date().getFullYear(),
            setSelectedYear: (selectedYear: number) => set({ selectedYear }),
            stats: {
                occupancy: 0,
                bookings: 0,
                rooms: 0,
            },
            fetchStats: async (locationId: string, month: number, year: number) => {
                const stats = await getAdminStats(locationId, month, year);
                set({ stats });
            },
            attendance: [],
            fetchAttendance: async (locationId: string, month: number, year: number) => {
                const attendance = await getAttendance(locationId, month, year);
                set({ attendance });
            },
        }),
        {
            name: 'admin-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);