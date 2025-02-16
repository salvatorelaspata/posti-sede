import { db } from '../db';
import { tenants, locations, rooms, users, employees, bookings } from '@/db/schema';
// import { eq } from 'drizzle-orm';

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
    return db.insert(users).values({
        tenantId,
        email: 'admin@gotonext.it',
        password: 'admin',
        role: 'admin'
    });
};

const seedAdminUserCubeconsultants = async (tenantId: string) => {
    return db.insert(users).values({
        tenantId,
        email: 'admin@cubeconsultants.it',
        password: 'admin',
        role: 'admin'
    });
};

const seed = async () => {
    // Reset database (solo per sviluppo!)
    await Promise.all([
        db.delete(bookings),
        db.delete(rooms),
        db.delete(locations),
        db.delete(employees),
        db.delete(users),
        db.delete(tenants)
    ]);

    const { companyA, companyB } = await seedTenants();
    const { rome } = await seedLocationsGotonext(companyA.id);
    const { rome: romeCubeconsultants } = await seedLocationsCubeconsultants(companyB.id);
    await seedRooms(rome.id);
    await seedRooms(romeCubeconsultants.id);
    await seedAdminUserGotonext(companyA.id);
    await seedAdminUserCubeconsultants(companyB.id);

    console.log('Database seeded successfully!');
};

export default seed;