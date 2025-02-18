import {
    pgTable,
    varchar,
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

// Tabella utenti con autenticazione
// export const users = pgTable('users', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     tenantId: uuid('tenant_id').references(() => tenants.id),
//     emoji: varchar('emoji', { length: 256 }),
//     fullname: varchar('fullname', { length: 256 }),
//     email: varchar('email', { length: 256 }).notNull(),
//     password: varchar('password', { length: 256 }),
//     googleId: varchar('google_id', { length: 256 }),
//     role: varchar('role', { length: 50 }).$type<'admin' | 'manager' | 'employee'>().default('employee'),
//     createdAt: timestamp('created_at').defaultNow(),
// });

// Definizione separata dell'indice unico per email
// export const usersEmailUnique = uniqueIndex('email_unique').on(users.email);

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
});

// Tabella stanze con capacità
export const rooms = pgTable('rooms', {
    id: uuid('id').primaryKey().defaultRandom(),
    locationId: uuid('location_id').references(() => locations.id),
    name: varchar('name', { length: 256 }).notNull(),
    capacity: integer('capacity').notNull(),
    available: integer('available').notNull().default(0),
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

// Tabella presenze giornaliere
// export const dailyAttendances = pgTable('daily_attendances', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     tenantId: uuid('tenant_id').references(() => tenants.id),
//     date: timestamp('date').notNull(),
//     count: integer('count').notNull().default(0),
//     people: jsonb('people').$type<string[]>().notNull(),
// });

export const locationsRelations = relations(locations, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [locations.tenantId],
        references: [tenants.id],
    }),
    rooms: many(rooms),
}));

// Relazioni
export const tenantsRelations = relations(tenants, ({ many }) => ({
    locations: many(locations),
    // users: many(users),
    employees: many(employees),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
    location: one(locations, {
        fields: [rooms.locationId],
        references: [locations.id],
    }),
    bookings: many(bookings),
}));

// export const usersRelations = relations(users, ({ one }) => ({
//     tenant: one(tenants, {
//         fields: [users.tenantId],
//         references: [tenants.id]
//     }),
//     employee: one(employees)
// }));

export const employeesRelations = relations(employees, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [employees.tenantId],
        references: [tenants.id],
    }),
    // user: one(users, {
    //     fields: [employees.userId],
    //     references: [users.id],
    // }),
    employee: one(employees, {
        fields: [employees.id],
        references: [employees.id],
    }),
    bookings: many(bookings),
}));


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