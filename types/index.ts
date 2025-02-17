import { users, tenants, locations, bookings, rooms } from '@/db/schema';

export type User = typeof users.$inferSelect;
export type Tenant = typeof tenants.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Booking = typeof bookings.$inferInsert;


export type ClerkError = {
    status: number,
    clerkError: boolean,
    errors: {
        code: string,
        message: string,
        longMessage: string,
        meta: {
            paramName: string,
        }
    }[]
}