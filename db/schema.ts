import {
    pgTable,
    varchar,
    boolean,
    integer,
    jsonb,
    uuid,
    timestamp
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

// Tabella dipendenti (legata al tenant)
export const employees = pgTable('employees', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    // userId: uuid('user_id').references(() => users.id),
    clerkId: varchar('clerk_id', { length: 256 }).notNull(),
    role: varchar('role', { length: 50 }).$type<'admin' | 'manager' | 'employee'>().default('employee'),
    email: varchar('email', { length: 256 }).notNull(),
    firstName: varchar('first_name', { length: 256 }).notNull(),
    lastName: varchar('last_name', { length: 256 }).notNull(),
    department: varchar('department', { length: 256 }),
    createdAt: timestamp('created_at').defaultNow()
});

// Tabella sedi (multi-tenant)
export const locations = pgTable('locations', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    name: varchar('name', { length: 256 }).notNull(),
    image: varchar('image', { length: 512 }),
    image_floorplan: varchar('image_floorplan', { length: 512 }),
});

// Tabella stanze con capacità
export const rooms = pgTable('rooms', {
    id: uuid('id').primaryKey().defaultRandom(),
    locationId: uuid('location_id').references(() => locations.id),
    name: varchar('name', { length: 256 }).notNull(),
    capacity: integer('capacity').notNull(),
    image: varchar('image', { length: 512 }),
    reserved: boolean('reserved').default(false),
});


// Tabella prenotazioni
export const bookings = pgTable('bookings', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    roomId: uuid('room_id').references(() => rooms.id),
    employeeId: uuid('employee_id').references(() => employees.id),
    date: timestamp('date').notNull(),
    period: varchar('period', { length: 50 }).$type<'full' | 'morning' | 'afternoon'>(),
    status: varchar('status', { length: 50 }).$type<'pending' | 'confirmed' | 'cancelled'>().default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    confirmedAt: timestamp('confirmed_at'),
    cancelledAt: timestamp('cancelled_at'),
});

// Relazioni
export const locationsRelations = relations(locations, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [locations.tenantId],
        references: [tenants.id],
    }),
    rooms: many(rooms),
}));

// Relazioni
export const tenantsRelations = relations(tenants, ({ many }) => ({
    employees: many(employees),
    locations: many(locations),
}));

// Relazioni
export const roomsRelations = relations(rooms, ({ one, many }) => ({
    location: one(locations, {
        fields: [rooms.locationId],
        references: [locations.id],
    }),
    bookings: many(bookings),
}));

// Relazioni
export const employeesRelations = relations(employees, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [employees.tenantId],
        references: [tenants.id],
    }),
    employee: one(employees, {
        fields: [employees.id],
        references: [employees.id],
    }),
    bookings: many(bookings),
}));

// Relazioni
export const bookingsRelations = relations(bookings, ({ one }) => ({
    tenant: one(tenants, {
        fields: [bookings.tenantId],
        references: [tenants.id],
    }),
    employee: one(employees, {
        fields: [bookings.employeeId],
        references: [employees.id],
    }),
    room: one(rooms, {
        fields: [bookings.roomId],
        references: [rooms.id],
    }),
}));