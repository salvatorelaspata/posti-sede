import { create } from 'zustand';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { Location, Room, Booking } from '@/types';
import { locations, rooms } from '@/db/schema';
type TenantState = {
    locations: Location[];
    rooms: Room[];
    bookings: Booking[];
    fetchLocations: (tenantId: string) => Promise<void>;
    fetchRooms: (locationId: string) => Promise<void>;
};

export const useTenantStore = create<TenantState>((set: any) => ({
    locations: [],
    rooms: [],
    bookings: [],

    fetchLocations: async (tenantId: string) => {
        const result = await db
            .select()
            .from(locations)
            .where(eq(locations.tenantId, tenantId));
        set({ locations: result });
    },

    fetchRooms: async (locationId: string) => {
        const result = await db
            .select()
            .from(rooms)
            .where(eq(rooms.locationId, locationId));
        set({ rooms: result });
    },
}));