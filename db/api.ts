
import { db } from '@/db';
import { eq, sql, and } from 'drizzle-orm';
import { tenants, users } from './schema';

export const getUserByEmailAndPassword = async (email: string, password: string) => {
    console.log(email, password);
    const user = await db.select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.password, password)))
        .limit(1);
    console.log(user);
    return user;
}

export const getTenantFromEmail = async (email: string) => {
    const tenant = email.split('@')[1];
    const tenantId = await db.select().from(tenants).where(sql`${tenants.allowedDomains} @> ${JSON.stringify([tenant])}`).limit(1);
    console.log(tenantId);
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
    console.log(updatedUser);
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
    return user;
}