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

export type RoomPerson = {
    id: string;
    employee: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string;
    };
    period: 'full' | 'morning' | 'afternoon';
    status: 'pending' | 'confirmed' | 'cancelled';
};

export type RoomWithPeople = {
    room: {
        id: string;
        name: string;
        capacity: number;
        image: string | null;
        reserved: boolean | null;
    };
    people: RoomPerson[];
    occupancy: number;
};