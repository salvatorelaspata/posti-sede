import { create } from 'zustand';
import { Location, Room, Booking, Tenant, Employee } from '@/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTenantFromEmail, getEmployeeByClerkId, getBookingUserByDate, getBookingUserByMonth, insertBooking, deleteBooking } from '@/db/api';
import { UserResource } from '@clerk/types';

export type Book = {
    id: string;
    date: Date;
    roomId: string;
    roomName: string;
}

type AppState = {
    clerkUser: UserResource | null | undefined;
    isAdmin: boolean;
    employee: Employee | null;
    tenant: Tenant | null;
    location: Location | null;
    room: Room | null;
    booked: Book | null;
    booking: Book[] | null;
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    setCurrentDay: (currentDay: number) => void;
    setCurrentDate: (date: Date) => void;
    setClerkUser: (clerkUser: UserResource) => Promise<void>;
    fetchPersonalBooking: () => Promise<void>;
    setLocation: (location: Location) => void;
    setRoom: (room: Room | null) => void;
    addBooking: () => Promise<void>;
    removeBooking: (bookingId: string) => Promise<void>;
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
            booked: null,
            booking: [],
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth(),
            currentDay: new Date().getDate(),
            setCurrentDay: (currentDay: number) => set({ currentDay }),
            setCurrentDate: (date) => {
                const currentYear = date.getFullYear();
                const currentMonth = date.getMonth();
                const currentDay = date.getDate();
                const booking = get().booking;
                const booked = booking?.find(b => b.date.getDate() === currentDay);
                set({ currentYear, currentMonth, currentDay, booked })
            },
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
                    try {
                        const employee = get().employee;
                        const booking = await getBookingUserByMonth(
                            employee?.id || '',
                            get().currentYear,
                            get().currentMonth
                        );
                        set({
                            booking: booking.map(b => ({
                                id: b.id,
                                date: b.date,
                                roomId: b.roomId || '',
                                roomName: b.roomName || ''
                            }))
                        });
                    }
                    catch (error) {
                        console.error('Error fetching personal booking:', error);
                    }
                }
            },
            setLocation: (location) => set({ location }),
            setRoom: (room) => set({ room }),
            addBooking: async () => {
                if (get().location) {
                    try {
                        const employee = get().employee;
                        const id = await insertBooking(
                            {
                                tenantId: get().tenant?.id || '',
                                roomId: get().room?.id || '',
                                employeeId: employee?.id || '',
                                date: new Date(get().currentYear, get().currentMonth, get().currentDay),
                                period: 'full',
                                status: 'pending',
                            }
                        );
                        const newBooking = get().booking;
                        newBooking?.push({
                            id,
                            date: new Date(get().currentYear, get().currentMonth, get().currentDay),
                            roomId: get().room?.id || '',
                            roomName: get().room?.name || ''
                        });
                        set({ booking: newBooking });
                    }
                    catch (error) {
                        console.error('Error fetching personal booking:', error);
                    }
                }
            },
            removeBooking: async (bookingId) => {
                if (get().location) {
                    try {
                        await deleteBooking(bookingId);
                        const newBooking = get().booking?.filter(b => b.date.getDate() !== get().currentDay);
                        set({ booking: newBooking });
                    }
                    catch (error) {
                        console.error('Error fetching personal booking:', error);
                    }
                }
            }
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);