import { tenants, locations, rooms, bookings, employees } from './db/schema';
import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
dotenv.config();
const DATABASE_URL = process.env.EXPO_PUBLIC_DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = drizzle(DATABASE_URL);
const seedTenants = async () => {
    const tenantData = await db
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

    return {
        companyA: tenantData[0],
        companyB: tenantData[1]
    };
};

const seedLocationsGotonext = async (tenantId: string) => {
    const locationData = [
        {
            name: 'Roma HQ',
            image: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/gotonext/gotonext---rome.jpg',
            image_floorplan: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/gotonext/gotonext---roma-floorplan.svg'
        },
        {
            name: 'Milano Office',
            image: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/gotonext/gotonext---milan.jpg',
            image_floorplan: null
        },
        {
            name: 'Bergamo Office',
            image: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/gotonext/gotonext---bergamo.jpg',
            image_floorplan: null
        }
    ].map(loc => ({ ...loc, tenantId }));

    return await db.insert(locations).values(locationData).returning();
};

const seedLocationsCubeconsultants = async (tenantId: string) => {
    const locationData = [
        {
            name: 'Roma HQ',
            image: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/cubeconsultants/cubeconsultants---rome.jpg',
            image_floorplan: null
        }
    ].map(loc => ({ ...loc, tenantId }));

    return await db.insert(locations).values(locationData).returning();
};

const seedRooms = async (locationId: string) => {
    const roomsData = [
        {
            name: 'Open Space',
            capacity: 10,
            available: 10,
            reserved: false,
            image: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/gotonext/gotonext---roma-openspace.jpg'
        },
        {
            name: 'Vetro',
            capacity: 4,
            available: 4,
            reserved: false,
            image: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/gotonext/gotonext---roma-vetro.jpg'
        },
        {
            name: 'Acquario',
            capacity: 4,
            available: 4,
            reserved: false,
            image: 'https://pub-4fc4901ce07d4a338511e46a34800ee0.r2.dev/gotonext/gotonext---roma-acquario.jpg'
        },
        {
            name: 'Admin',
            capacity: 2,
            available: 2,
            reserved: true
        },
        {
            name: 'Alessandro',
            capacity: 1,
            available: 1,
            reserved: true
        },
        {
            name: 'Dario',
            capacity: 2,
            available: 2,
            reserver: true
        }

    ].map(room => ({ ...room, locationId }));

    return await db.insert(rooms).values(roomsData).returning();
};

const seed = async () => {
    try {
        // Reset database
        console.log('Cleaning database...');

        await db.delete(bookings)
        await db.delete(rooms)
        await db.delete(employees)
        await db.delete(locations)
        await db.delete(tenants)

        console.log('Seeding tenants...');
        const { companyA, companyB } = await seedTenants();

        if (!companyA?.id || !companyB?.id) {
            throw new Error('Failed to create tenants');
        }

        console.log('Seeding locations...');
        const gotonextLocations = await seedLocationsGotonext(companyA.id);
        const cubeconsultantsLocations = await seedLocationsCubeconsultants(companyB.id);

        if (!gotonextLocations.length || !cubeconsultantsLocations.length) {
            throw new Error('Failed to create locations');
        }

        console.log('Seeding rooms...');
        const gotonextRome = gotonextLocations.find(loc => loc.name === 'Roma HQ')
        if (gotonextRome)
            await seedRooms(gotonextRome.id);

        const cubeconsultantsRome = cubeconsultantsLocations.find(loc => loc.name === 'Roma HQ')
        if (cubeconsultantsRome)
            await seedRooms(cubeconsultantsRome.id);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

export default seed;
