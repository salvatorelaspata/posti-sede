
import { db } from '@/db';
import { eq, sql, and } from 'drizzle-orm';
import { employees, rooms, tenants, users } from './schema';

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

export const getAvailabilityForLocation = async (locationId: string) => {
    const availability = await db.select().from(rooms).where(eq(rooms.locationId, locationId));
    return availability;
}

export const getAvailabilityForRoom = async (roomId: string) => {
    const availability = await db.select().from(rooms).where(eq(rooms.id, roomId));
    return availability;
}

