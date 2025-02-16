import { db } from '../db';
import { tenants, locations, rooms, users, employees, bookings } from '@/db/schema';

// Dati di esempio per il multi-tenant
const seedTenants = async () => {
    const [companyA, companyB] = await db
        .insert(tenants)
        .values([
            {
                name: 'Azienda gotonext',
                allowedDomains: ['gotonext.it']
            },
            {
                name: 'Azienda cubeconsultants',
                allowedDomains: ['cubeconsultants.it']
            }
        ])
        .returning();

    return { companyA, companyB };
};

const seedLocationsGotonext = async (tenantId: string) => {
    const [rome, milan, bergamo] = await db
        .insert(locations)
        .values([
            {
                tenantId,
                name: 'Roma HQ',
                image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20rome%20sunset&aspect=16:9',
            },
            {
                tenantId,
                name: 'Milano Office',
                image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20milan%20business%20district&aspect=16:9',
            },
            {
                tenantId,
                name: 'Bergamo Office',
                image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20bergamo%20with%20mountains&aspect=16:9',
            },
        ])
        .returning();

    return { rome, milan, bergamo };
};

const seedLocationsCubeconsultants = async (tenantId: string) => {
    const [rome] = await db
        .insert(locations)
        .values([
            {
                tenantId,
                name: 'Roma HQ',
                image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20rome%20sunset&aspect=16:9',
            },
        ])
        .returning();

    return { rome };
};
const seedRooms = async (locationId: string) => {
    return db
        .insert(rooms)
        .values([
            {
                locationId,
                name: 'Open Space',
                capacity: 10,
                available: 10
            },
            {
                locationId,
                name: 'Sala Vetro',
                capacity: 4,
                available: 4
            },
            {
                locationId,
                name: 'Acquario',
                capacity: 6,
                available: 6
            }
        ]);
};

const seedAdminUserGotonext = async (tenantId: string) => {
    const user = await db.insert(users).values({
        tenantId,
        email: 'admin@gotonext.it',
        password: 'admin',
        role: 'admin',
        emoji: '👨‍💻',
        fullname: 'Admin'
    }).returning();

    const employee = await db.insert(employees).values({
        tenantId,
        userId: user[0].id,
        name: 'Admin',
        department: 'Admin'
    }).returning();

    return { user, employee };
};

const seedAdminUserCubeconsultants = async (tenantId: string) => {
    const user = await db.insert(users).values({
        tenantId,
        email: 'admin@cubeconsultants.it',
        password: 'admin',
        role: 'admin',
        emoji: '👨‍💻',
        fullname: 'Admin'
    }).returning();

    const employee = await db.insert(employees).values({
        tenantId,
        userId: user[0].id,
        name: 'Admin',
        department: 'Admin'
    }).returning();

    return { user, employee };
};

const seedBookingsGotonext = async (employeeId: string) => {
    const randomDateInFiveDays = new Date(Date.now() + Math.random() * (Date.now() - new Date('2024-01-01').getTime()));
    return db.insert(bookings).values({
        employeeId,
        date: randomDateInFiveDays,
        period: 'morning'
    });
};

const seedBookingsCubeconsultants = async (employeeId: string) => {
    const randomDateInFiveDays = new Date(Date.now() + Math.random() * (Date.now() - new Date('2024-01-01').getTime()));
    return db.insert(bookings).values({
        employeeId,
        date: randomDateInFiveDays,
        period: 'morning'
    });
};

const seed = async () => {
    // Reset database (solo per sviluppo!)
    try {
        await Promise.all([
            db.delete(bookings),
            db.delete(rooms),
            db.delete(locations),
            db.delete(employees),
            db.delete(users),
            db.delete(tenants)
        ]);

        console.log('Seeding tenants...');
        const { companyA, companyB } = await seedTenants();
        console.log('Seeding locations...');
        const { rome } = await seedLocationsGotonext(companyA.id);
        const { rome: romeCubeconsultants } = await seedLocationsCubeconsultants(companyB.id);
        console.log('Seeding rooms...');
        await seedRooms(rome.id);
        await seedRooms(romeCubeconsultants.id);
        console.log('Seeding admin users...');
        const { user: adminUserGotonext, employee: adminEmployeeGotonext } = await seedAdminUserGotonext(companyA.id);
        const { user: adminUserCubeconsultants, employee: adminEmployeeCubeconsultants } = await seedAdminUserCubeconsultants(companyB.id);
        console.log('Seeding bookings...');
        await seedBookingsGotonext(adminEmployeeGotonext[0].id);
        await seedBookingsCubeconsultants(adminEmployeeCubeconsultants[0].id);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};


export default seed;