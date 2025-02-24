import { create } from 'zustand';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { Location, Room, Booking } from '@/types';
import { locations, rooms } from '@/db/schema';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvailabilityForLocation } from '@/db/api';

type AvailabilityRooms = Room & { bookings: any[], available: number };
type TenantState = {
    locations: Location[];
    rooms: AvailabilityRooms[];
    bookings: Booking[];
    fetchLocations: (tenantId: string) => Promise<void>;
    fetchRooms: (locationId: string, date: Date) => Promise<void>;
};

export const useTenantStore = create<TenantState>()(
    persist(
        (set, get) => ({
            locations: [],
            rooms: [],
            bookings: [],
            fetchLocations: async (tenantId) => {
                const result = await db
                    .select()
                    .from(locations)
                    .where(eq(locations.tenantId, tenantId));
                set({ locations: result });
            },
            fetchRooms: async (locationId, date) => {
                if (!locationId) return;
                if (date) {
                    const availability = await getAvailabilityForLocation(locationId, date);
                    set({ rooms: availability });
                }
            },
        }),
        {
            name: 'tenant-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);