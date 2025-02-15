import {
    pgTable,
    varchar,
    integer,
    jsonb,
    uuid,
    timestamp,
    uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// export const bookingPeriodEnum = pgEnum('booking_period', ['FULL_DAY', 'MORNING', 'AFTERNOON']);
// Tabella principale per i tenant/organizzazioni
export const tenants = pgTable('tenants', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 256 }).notNull(),
    allowedDomains: jsonb('allowed_domains').$type<string[]>().notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Tabella utenti con autenticazione
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    email: varchar('email', { length: 256 }).notNull(),
    googleId: varchar('google_id', { length: 256 }),
    role: varchar('role', { length: 50 }).$type<'admin' | 'manager' | 'employee'>().default('employee'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Definizione separata dell'indice unico per email
// export const usersEmailUnique = uniqueIndex('email_unique').on(users.email);

// Tabella sedi (multi-tenant)
export const locations = pgTable('locations', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    name: varchar('name', { length: 256 }).notNull(),
    image: varchar('image', { length: 512 }),
});

// Tabella stanze con capacità
export const rooms = pgTable('rooms', {
    id: uuid('id').primaryKey().defaultRandom(),
    locationId: uuid('location_id').references(() => locations.id),
    name: varchar('name', { length: 256 }).notNull(),
    capacity: integer('capacity').notNull(),
    available: integer('available').notNull().default(0),
});

// Tabella dipendenti (legata al tenant)
export const employees = pgTable('employees', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    userId: uuid('user_id').references(() => users.id),
    name: varchar('name', { length: 256 }).notNull(),
    department: varchar('department', { length: 256 }).notNull(),
});

// Tabella prenotazioni
export const bookings = pgTable('bookings', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    roomId: uuid('room_id').references(() => rooms.id),
    employeeId: uuid('employee_id').references(() => employees.id),
    date: timestamp('date').notNull(),
    period: varchar('period', { length: 50 }).$type<'full' | 'morning' | 'afternoon'>(),
});

// Tabella presenze giornaliere
export const dailyAttendances = pgTable('daily_attendances', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    date: timestamp('date').notNull(),
    count: integer('count').notNull().default(0),
    people: jsonb('people').$type<string[]>().notNull(),
});

// Relazioni
export const tenantsRelations = relations(tenants, ({ many }) => ({
    locations: many(locations),
    users: many(users),
    employees: many(employees),
}));

export const usersRelations = relations(users, ({ one }) => ({
    tenant: one(tenants, {
        fields: [users.tenantId],
        references: [tenants.id]
    }),
    employee: one(employees)
}));

