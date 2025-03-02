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
            image: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/gotonext/gotonext---rome.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T011907Z&X-Amz-Expires=3600&X-Amz-Signature=9d24b3fc75ca91513909c42c9eba13de065381cd01fc56a88b084567be54eecd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject',
            image_floorplan: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/gotonext/gotonext---roma-floorplan.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T013511Z&X-Amz-Expires=3600&X-Amz-Signature=7995b5f1fe23aa705bf085a3ae62a44702da62c168168ef706e5f24df6a32228&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'
        },
        {
            name: 'Milano Office',
            image: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/gotonext/gotonext---milan.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T011915Z&X-Amz-Expires=3600&X-Amz-Signature=86ac532ae4f6d0cd1cee2797fe23364041463e2ef41067fb5687597560524eb5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject',
            image_floorplan: null
        },
        {
            name: 'Bergamo Office',
            image: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/gotonext/gotonext---bergamo.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T011922Z&X-Amz-Expires=3600&X-Amz-Signature=aa1d57b79a70641e5a697211068ed969f7fadc471720da0ecbb5659b70a48da6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject',
            image_floorplan: null
        }
    ].map(loc => ({ ...loc, tenantId }));

    return await db.insert(locations).values(locationData).returning();
};

const seedLocationsCubeconsultants = async (tenantId: string) => {
    const locationData = [
        {
            name: 'Roma HQ',
            image: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/cubeconsultants/cubeconsultants---rome.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T011824Z&X-Amz-Expires=3600&X-Amz-Signature=ea38cf64b3e5ac1bed7549d93f5155786dcf291e53d8417f49638e551c8ee2a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject',
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
            image: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/gotonext/gotonext---roma-openspace.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T013555Z&X-Amz-Expires=3600&X-Amz-Signature=19be1230eafbb757e2208f1756a0a3e18e966f94722334e457b5d295edb942dd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'
        },
        {
            name: 'Vetro',
            capacity: 4,
            available: 4,
            reserved: false,
            image: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/gotonext/gotonext---roma-vetro.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T013616Z&X-Amz-Expires=3600&X-Amz-Signature=83d1ad251b9704a773648e13a1029ec2f27e5ee2b2653383e37cacaa018ec9d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'
        },
        {
            name: 'Acquario',
            capacity: 4,
            available: 4,
            reserved: false,
            image: 'https://posti-sede.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com/gotonext/gotonext---roma-acquario.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=35c6431c6b5ec358564f5cde2612bef0%2F20250302%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250302T013630Z&X-Amz-Expires=3600&X-Amz-Signature=3f22af6360d06659306eb6e4d1de45032f965138db0057f40dac94dfb4973bec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'
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
