import { create } from 'zustand';
import { db } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { Location, Room, Booking, Tenant, Employee } from '@/types';
import { locations, tenants } from '@/db/schema';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkEmployee, getAvailabilityForLocation, getTenantFromEmail, insertEmployee } from '@/db/api';
import { AuthUser } from '@/utils/middleware';
import { randomUUID } from 'expo-crypto';

type AvailabilityRooms = Room & { bookings: any[], available: number };
type TenantState = {
    tenant: Tenant | null;
    locations: Location[];
    rooms: AvailabilityRooms[];
    setTenantFromUser: (user: AuthUser) => Promise<{ employee: Employee | null; tenant: Tenant | null } | null>;
    fetchLocations: (tenantId: string) => Promise<void>;
    fetchRooms: (locationId: string, date: Date) => Promise<void>;
    reset: () => void;
};

export const useTenantStore = create<TenantState>()(
    persist(
        (set, get) => ({
            tenant: null,
            locations: [],
            rooms: [],
            setTenantFromUser: async (user: AuthUser) => {
                // Check if the tenant exists based on the allowed domains
                const tenant = await getTenantFromEmail(user.email);
                if (!tenant) {
                    console.error('No tenant found for user:', user.email);
                    set({ tenant: null, locations: [], rooms: [] });
                    return null;
                }
                console.log('Tenant found:', tenant.name);
                set({ tenant });

                console.log('Setting tenant for user:', user.email, 'Tenant:', tenant.name);
                const e = await checkEmployee(user.email);
                console.log('Checking employee for user:', user.email, 'Result:', e);
                let employee: Employee | null = null;
                // check if user --> employee is defined
                console.log('Employee insertion for user:', user.email);
                if (!e) {
                    employee = await insertEmployee({
                        id: randomUUID(),
                        createdAt: new Date(),
                        email: user.email,
                        firstName: user.given_name || '',
                        lastName: user.family_name || '',
                        department: null,
                        tenantId: tenant.id,
                        role: "employee"
                    });
                    console.log('Employee inserted:', employee);
                    if (!employee) {
                        console.error('Failed to insert employee:', user.email);
                        return null;
                    }
                } else {
                    employee = e;
                    console.log('Employee already exists:', employee);
                }
                if (tenant) {
                    get().fetchLocations(tenant.id);
                } else {
                    set({ locations: [], rooms: [] }); // Reset if no tenant found
                }
                return { employee, tenant };
            },
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
            reset: () => set({ tenant: null, locations: [], rooms: [] }),
        }),
        {
            name: 'tenant-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);