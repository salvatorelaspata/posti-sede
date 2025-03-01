import { db } from '@/db';
import { eq, sql, and, gte, lt, inArray } from 'drizzle-orm';
import { employees, rooms, tenants, bookings, locations } from './schema';
import { formatDate } from '@/constants/Calendar';
import { Booking, Employee } from '@/types';
import { Book } from '@/store/app-store';


export const getTenantFromEmail = async (email: string) => {
    const tenant = email.split('@')[1];
    const tenantId = await db.select().from(tenants).where(sql`${tenants.allowedDomains} @> ${JSON.stringify([tenant])}`).limit(1);

    if (tenantId.length === 0) {
        throw new Error('Tenant non trovato');
    }
    return tenantId[0];
}


export const checkTenant = async (email: string) => {
    const tenant = email.split('@')[1];
    const tenantId = await db.select().from(tenants).where(sql`${tenants.allowedDomains} @> ${JSON.stringify([tenant])}`)
    return tenantId.length > 0;
}


export const createEmployeeFromEmailAndPassword = async (email: string, clerkId: string, firstname: string, lastname: string) => {
    // get tenant from email
    const tenant = email.split('@')[1];
    const tenantId = await db.select().from(tenants).where(sql`${tenants.allowedDomains} @> ${JSON.stringify([tenant])}`)
    if (tenantId.length === 0) {
        throw new Error('Tenant non trovato');
    }

    const employee = await db.insert(employees).values({
        tenantId: tenantId[0].id,
        clerkId: clerkId,
        email: email,
        firstName: firstname,
        lastName: lastname,
    }).returning();

    return employee[0];
}

export const getEmployeeByClerkId = async (clerkId: string) => {
    const employee = await db.select().from(employees).where(eq(employees.clerkId, clerkId));
    return employee[0];
}

export const getAvailabilityForLocation = async (locationId: string, date: Date) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    // Prima query: ottieni tutte le stanze per la location
    const allRooms = await db
        .select()
        .from(rooms)
        .where(eq(rooms.locationId, locationId));

    // Se non ci sono stanze, restituisci un array vuoto
    if (allRooms.length === 0) {
        return [];
    }

    // Raccogliere tutti gli ID delle stanze
    const roomIds = allRooms.map(room => room.id);

    // Seconda query: ottieni tutte le prenotazioni per le stanze in quella data
    const allBookings = await db
        .select()
        .from(bookings)
        .where(
            and(
                inArray(bookings.roomId, roomIds),
                // eq(bookings.date, date)
                gte(bookings.date, startDate),
                lt(bookings.date, endDate)
            )
        );

    // Organizza le prenotazioni per roomId per un facile accesso
    const bookingsByRoomId = allBookings.reduce((acc, booking) => {
        if (booking.roomId !== null && !acc[booking.roomId]) {
            acc[booking.roomId] = [];
        }
        if (booking.roomId !== null) {
            acc[booking.roomId].push(booking);
        }
        return acc;
    }, {} as Record<string, typeof allBookings>);

    // Crea l'array di disponibilità
    return allRooms.map(room => {
        const roomBookings = bookingsByRoomId[room.id] || [];
        return {
            ...room,
            bookings: roomBookings,
            // Se room.available è usato per altro, manteniamo la logica originale che calcola available
            available: room.capacity - roomBookings.length
        };
    });
};

export const getMonthEmployeeBookings = async (employeeId: string, month: number, year: number) => {
    const firstDate = new Date(year, month, 1);
    firstDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(year, month + 1, 0);
    lastDate.setHours(23, 59, 59, 999);
    const _bookings = await db.select().from(employees)
        .leftJoin(bookings, eq(employees.id, bookings.employeeId))
        .leftJoin(rooms, eq(bookings.roomId, rooms.id))
        .where(and(eq(employees.id, employeeId),
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

export const insertBooking = async (booking: Booking): Promise<string> => {
    try {
        return (await db.insert(bookings).values(booking).returning())[0].id;
    } catch (error) {
        console.error("Errore nell'API insertBooking:", error);
        throw error;
    }
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
        employee: Employee
    }>();
    try {
        for (let i = 0; i < bookingsData.length; i++) {
            const booking = bookingsData[i];
            const employeeId = booking.employees?.id || booking.employeeId;

            if (!employeeId) continue;

            if (!attendanceMap.has(employeeId)) {
                attendanceMap.set(employeeId, {
                    id: employeeId,
                    employeeName: booking.employees?.firstName || 'Sconosciuto',
                    employeeDepartment: booking.employees?.department || 'Sconosciuto',
                    userId: booking.employees?.clerkId || 'Sconosciuto',
                    employee: booking.employees,
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

export const getBookingUserByDate: (employeeId: string, date: Date) => Promise<Book[]> = async (employeeId: string, date: Date) => {
    const firstDate = new Date(date);
    firstDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(date);
    lastDate.setHours(23, 59, 59, 999);
    const booking = await db.select().from(bookings)
        .leftJoin(rooms, eq(bookings.roomId, rooms.id))
        .where(and(eq(bookings.employeeId, employeeId),
            gte(bookings.date, firstDate),
            lt(bookings.date, lastDate)
        ));
    return booking.map(b => ({
        id: b.bookings.id,
        date: b.bookings.date,
        roomId: b.bookings.roomId || '',
        roomName: b.rooms?.name || ''
    }));
}

export const getBookingUserByMonth:
    (employeeId: string, year: number, month: number) => Promise<Book[]> =
    async (employeeId, year, month) => {
        const firstDate = new Date(year, month, 1)
        firstDate.setHours(6, 0, 0, 0)
        const lastDate = new Date(year, firstDate.getMonth() + 1, 0)
        lastDate.setHours(23, 59, 59, 0)

        const booking = await db.select().from(bookings)
            .leftJoin(rooms, eq(bookings.roomId, rooms.id))
            .where(and(eq(bookings.employeeId, employeeId),
                gte(bookings.date, firstDate),
                lt(bookings.date, lastDate)
            ));
        return booking.map(b => ({
            id: b.bookings.id,
            date: b.bookings.date,
            roomId: b.bookings.roomId || '',
            roomName: b.rooms?.name || ''
        }));
    }