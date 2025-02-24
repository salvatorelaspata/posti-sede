import { create } from 'zustand';
import { Location, Room, Booking, Tenant, Employee } from '@/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTenantFromEmail, getEmployeeByClerkId, getBookingUserByDate } from '@/db/api';
import { UserResource } from '@clerk/types';

type AppState = {
    clerkUser: UserResource | null | undefined;
    isAdmin: boolean;
    employee: Employee | null;
    tenant: Tenant | null;
    location: Location | null;
    room: Room | null;
    booking: Booking | null;
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    setCurrentDay: (currentDay: number) => void;
    setClerkUser: (clerkUser: UserResource) => Promise<void>;
    fetchPersonalBooking: () => Promise<void>;
    setLocation: (location: Location) => void;
    setRoom: (room: Room | null) => void;
    setBooking: (booking: Booking) => void;
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            clerkUser: null,
            employee: null,
            isAdmin: false,
            tenant: null,
            location: null,
            room: null,
            booking: null,
            // home
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth(),
            currentDay: new Date().getDate(),
            setCurrentDay: (currentDay: number) => set({ currentDay }),
            // methods
            setClerkUser: async (clerkUser) => {
                // insert the user into the store
                set({ clerkUser })
                try {
                    const clerkId = get().clerkUser?.id || '';
                    // get the employee from the clerk id
                    const employee = await getEmployeeByClerkId(clerkId);
                    set({ employee });
                    // set the user role
                    set({ isAdmin: employee.role === 'admin' });
                    // get tanant from email
                    const tenant = await getTenantFromEmail(get().clerkUser?.emailAddresses[0].emailAddress || '');
                    // set the tenant in the store
                    set({ tenant });
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    set({ isAdmin: false });
                }
            },
            fetchPersonalBooking: async () => {
                if (get().location) {
                    const clerkId = get().clerkUser?.id || '';
                    try {
                        const employee = await getEmployeeByClerkId(clerkId);
                        const booking = await getBookingUserByDate(
                            employee?.id || '',
                            new Date(get().currentYear, get().currentMonth, get().currentDay)
                        );
                        set({ booking: booking[0] });
                    }
                    catch (error) {
                        console.error('Error fetching personal booking:', error);
                    }
                }
            },
            setLocation: (location) => set({ location }),
            setRoom: (room) => set({ room }),
            setBooking: (booking) => set({ booking })
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);