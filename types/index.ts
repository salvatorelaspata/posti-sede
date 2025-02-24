import { tenants, locations, rooms, bookings, employees } from '@/db/schema';

export type Tenant = typeof tenants.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Booking = typeof bookings.$inferInsert;
export type Employee = typeof employees.$inferSelect;


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