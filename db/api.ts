import { db } from '@/db';
import { eq, sql, and, gte, lt } from 'drizzle-orm';
import { employees, rooms, tenants, users, bookings, locations } from './schema';
import { User } from '@/types';
import { formatDate } from '@/constants/Calendar';
export const getUserByEmailAndPassword = async (email: string, password: string) => {

    const user = await db.select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.password, password)))
        .limit(1);

    return user;
}

export const getTenantFromEmail = async (email: string) => {
    const tenant = email.split('@')[1];
    const tenantId = await db.select().from(tenants).where(sql`${tenants.allowedDomains} @> ${JSON.stringify([tenant])}`).limit(1);

    if (tenantId.length === 0) {
        throw new Error('Tenant non trovato');
    }
    return tenantId[0];
}

export const updateUser = async (id: string, data: any) => {
    const updatedUser = await db.update(users).set({
        fullname: data.fullname,
        emoji: data.emoji,
    }).where(eq(users.id, id)).returning();

    return updatedUser[0];
}

export const createUserFromEmailAndPassword = async (email: string, password: string, name: string) => {
    // get tenant from email
    const tenant = email.split('@')[1];
    const tenantId = await db.select().from(tenants).where(sql`${tenants.allowedDomains} @> ${JSON.stringify([tenant])}`)
    if (tenantId.length === 0) {
        throw new Error('Tenant non trovato');
    }

    // check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email))
    if (existingUser.length > 0) {
        throw new Error('Utente già esistente');
    }

    const user = await db.insert(users).values({
        tenantId: tenantId[0].id,
        emoji: '👤 ',
        fullname: name,
        email,
        password,
        googleId: null,
        role: 'employee',
        createdAt: new Date(),
    }).returning();

    await db.insert(employees).values({
        tenantId: tenantId[0].id,
        userId: user[0].id,
        name: name,
        department: 'Employee',
    });

    return user;
}

export const updateUserPassword = async (id: string, password: string) => {
    const updatedUser = await db.update(users).set({
        password,
    }).where(eq(users.id, id)).returning();
    return updatedUser[0];
}

// direct api call
export const getAvailabilityForLocation = async (locationId: string, date: Date) => {
    // get all bookings for the location and date (join?)
    const availability = [];
    const _rooms = await db.select().from(rooms).where(eq(rooms.locationId, locationId));

    for (const room of _rooms) {
        const _bookings = await db.select().from(bookings).where(and(eq(bookings.roomId, room.id), eq(bookings.date, date)));
        const _capacity = await db.select().from(rooms).where(eq(rooms.id, room.id));
        availability.push({
            roomId: room.id,
            roomName: room.name,
            bookings: _bookings,
            capacity: _capacity[0].capacity,
            available: _capacity[0].capacity - _bookings.length,
        });
    }
    return availability;
}

export const getBookingsForRoom = async (roomId: string, date: Date) => {
    const firstDate = new Date(date);
    firstDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(date);
    lastDate.setHours(23, 59, 59, 999);
    const _bookings = await db.select().from(bookings)
        .where(and(eq(bookings.roomId, roomId),
            gte(bookings.date, firstDate),
            lt(bookings.date, lastDate)
        ));
    return _bookings;
}

export const getMonthUserBookings = async (userId: string, month: number, year: number) => {
    const firstDate = new Date(year, month, 1);
    firstDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(year, month + 1, 0);
    lastDate.setHours(23, 59, 59, 999);
    const _bookings = await db.select().from(users)
        .leftJoin(employees, eq(users.id, employees.userId))
        .leftJoin(bookings, eq(employees.id, bookings.employeeId))
        .leftJoin(rooms, eq(bookings.roomId, rooms.id))
        .where(and(eq(users.id, userId),
            gte(bookings.date, firstDate),
            lt(bookings.date, lastDate)
        ));
    return _bookings;
}

export const deleteBooking = async (bookingId: string): Promise<void> => {
    try {
        await db.delete(bookings).where(eq(bookings.id, bookingId));
    } catch (error) {
        console.error("Errore nell'API deleteBooking:", error);
        throw error;
    }
};

export const insertBooking = async (tenantId: string, employeeId: string, roomId: string, date: Date, period: string, status: string) => {
    // const newBooking = await db.insert(bookings).values({
    //     tenantId,
    //     roomId,
    //     employeeId,
    //     date,
    //     period,
    //     status,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     confirmedAt: null,
    //     cancelledAt: null
    // }).returning();
    // return newBooking[0];
}

export const getAttendance = async (locationId: string, month: number, year: number) => {
    // Calcola il primo e l'ultimo giorno del mese (con orari settati a inizio/fine giornata)
    const firstDate = new Date(year, month, 1);
    firstDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(year, month + 1, 0);
    lastDate.setHours(23, 59, 59, 999);

    // Recupera tutte le prenotazioni nel range del mese
    const bookingsData: any[] = await db
        .select()
        .from(bookings)
        .leftJoin(employees, eq(bookings.employeeId, employees.id))
        .leftJoin(users, eq(employees.userId, users.id))
        .leftJoin(rooms, eq(bookings.roomId, rooms.id))
        .leftJoin(locations, eq(rooms.locationId, locations.id))
        .leftJoin(tenants, eq(locations.tenantId, tenants.id))
        .where(and(gte(bookings.date, firstDate), lt(bookings.date, lastDate), eq(rooms.locationId, locationId)));

    // Raggruppa le prenotazioni per dipendente, contando i giorni unici in cui è avvenuta una prenotazione.
    const attendanceMap = new Map<string, {
        id: string,
        employeeName: string,
        employeeDepartment: string,
        userId: string,
        days: string[],
        users: User
    }>();
    try {
        for (let i = 0; i < bookingsData.length; i++) {
            const booking = bookingsData[i];
            const employeeId = booking.employees?.id || booking.employeeId;

            if (!employeeId) continue;

            if (!attendanceMap.has(employeeId)) {
                attendanceMap.set(employeeId, {
                    id: employeeId,
                    employeeName: booking.users?.fullname || 'Sconosciuto',
                    employeeDepartment: booking.employees?.department || 'Sconosciuto',
                    userId: booking.users?.id || 'Sconosciuto',
                    users: booking.users,
                    days: []
                });
            }
            const _employee = attendanceMap.get(employeeId);
            // format date
            const formattedDate = formatDate(booking.bookings.date, 'full');
            if (_employee) _employee.days.push(formattedDate ?? 'Nessuna prenotazione');
        }
        if (attendanceMap.size === 0) return [];
        return Array.from(attendanceMap.values());
    } catch (error) {
        console.error("Errore nell'API getAttendance:", error);
        throw error;
    }
}

export const getAdminStats = async (locationId: string, month: number, year: number) => {
    const firstDate = new Date(year, month, 1);
    firstDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(year, month + 1, 0);
    lastDate.setHours(23, 59, 59, 999);
    // calcola occupazione prenotazioni e sale
    const _rooms = await db.select().from(rooms).where(eq(rooms.locationId, locationId));
    const stats = await db.select()
        .from(bookings)
        .leftJoin(rooms, eq(bookings.roomId, rooms.id))
        .where(
            and(
                gte(bookings.date, firstDate),
                lt(bookings.date, lastDate)
            )
        );
    const occupancy = (stats.length / _rooms.length).toFixed(1);
    return { occupancy, bookings: stats.length, rooms: _rooms.length };
}   