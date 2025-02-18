import { db } from '@/db';
import { tenants, locations, rooms, employees, bookings } from '@/db/schema';

// Array di nomi casuali per generare dati più realistici
const firstNames = [
    'Marco', 'Giuseppe', 'Alessandro', 'Andrea', 'Luigi', 'Paolo', 'Francesco', 'Roberto',
    'Laura', 'Giulia', 'Sofia', 'Martina', 'Chiara', 'Anna', 'Elena', 'Maria'
];

const lastNames = [
    'Rossi', 'Bianchi', 'Ferrari', 'Romano', 'Gallo', 'Costa', 'Fontana', 'Conti',
    'Esposito', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Colombo', 'Rizzo', 'Lombardi'
];

const departments = [
    'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations',
    'Customer Support', 'Product', 'Legal', 'Research'
];

const emojis = ['👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '👨‍🏫', '👩‍🏫'];
const roles = ['admin', 'manager', 'employee'];

// Funzione per generare un nome casuale
const getRandomName = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return { firstName, lastName, fullName: `${firstName} ${lastName}` };
};

// Funzione per generare un elemento casuale da un array
const getRandomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Funzione per generare una data casuale compresa tra due date
const randomDateBetween = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

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
            image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20rome%20sunset&aspect=16:9',
        },
        {
            name: 'Milano Office',
            image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20milan%20business%20district&aspect=16:9',
        },
        {
            name: 'Bergamo Office',
            image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20bergamo%20with%20mountains&aspect=16:9',
        },
        {
            name: 'Torino Office',
            image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20turin%20with%20alps&aspect=16:9',
        },
        {
            name: 'Firenze Office',
            image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20florence%20with%20dome&aspect=16:9',
        }
    ].map(loc => ({ ...loc, tenantId }));

    return await db.insert(locations).values(locationData).returning();
};

const seedLocationsCubeconsultants = async (tenantId: string) => {
    const locationData = [
        {
            name: 'Roma HQ',
            image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20rome%20sunset&aspect=16:9',
        },
        {
            name: 'Napoli Office',
            image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20naples%20with%20vesuvius&aspect=16:9',
        },
        {
            name: 'Palermo Office',
            image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20palermo%20with%20sea&aspect=16:9',
        }
    ].map(loc => ({ ...loc, tenantId }));

    return await db.insert(locations).values(locationData).returning();
};

const seedRooms = async (locationId: string) => {
    const roomsData = [
        {
            name: 'Open Space A',
            capacity: 20,
            available: 20
        },
        {
            name: 'Open Space B',
            capacity: 15,
            available: 15
        },
        {
            name: 'Sala Vetro',
            capacity: 4,
            available: 4
        },
        {
            name: 'Acquario',
            capacity: 6,
            available: 6
        },
        {
            name: 'Sala Riunioni Grande',
            capacity: 12,
            available: 12
        },
        {
            name: 'Sala Focus',
            capacity: 2,
            available: 2
        },
        {
            name: 'Sala Brainstorming',
            capacity: 8,
            available: 8
        }
    ].map(room => ({ ...room, locationId }));

    return await db.insert(rooms).values(roomsData).returning();
};

// const seedUsers = async (tenantId: string, domain: string, count: number) => {
//     const employeeData = [];

//     // Creiamo sempre un admin
//     const adminName = getRandomName();
//     employeeData.push({
//         tenantId: tenantId,
//         // userId: ,
//         clerkId: `clerk_1`,
//         role: 'admin',
//         email: `${adminName.firstName.toLowerCase()}.${adminName.lastName.toLowerCase()}@${domain}`,
//         firstName: adminName.firstName,
//         lastName: adminName.lastName,
//         department: getRandomElement(departments),
//         createdAt: new Date(),
//     });

//     // Creiamo gli altri employees
//     for (let i = 0; i < count - 1; i++) {
//         const name = getRandomName();
//         const role = getRandomElement(roles) as 'admin' | 'manager' | 'employee';
//         employeeData.push({
//             tenantId,
//             clerkId: `clerk_${i + 2}`,
//             email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@${domain}`,
//             role: role,
//             firstName: name.firstName,
//             lastName: name.lastName,
//             department: getRandomElement(departments),
//             createdAt: new Date(),
//         });
//     }

//     const insertedEmployees = await db.insert(employees).values(employeeData).returning();

//     return insertedEmployees;

//     // Creiamo i corrispondenti dipendenti
//     // const employeesData = insertedEmployees.map(employee => ({
//     //     tenantId,
//     //     clerkId: employee.clerkId,
//     //     role: employee.role,
//     //     email: employee.email,
//     //     firstName: employee.firstName,
//     //     lastName: employee.lastName,
//     //     department: employee.department,
//     //     createdAt: employee.createdAt,
//     // }));

//     // return await db.insert(employees).values(employeesData).returning();
// };

// Funzione esistente per generare prenotazioni (su un range di giorni "relativo")
// const seedBookings = async (tenantId: string, employees: any[], rooms: any[], count: number) => {
//     if (!employees.length || !rooms.length) {
//         console.log('No employees or rooms available for bookings');
//         return [];
//     }

//     const bookingsData = [];
//     const periods = ['full', 'morning', 'afternoon'];
//     const statuses = ['pending', 'confirmed', 'cancelled'];

//     // Genera prenotazioni per i prossimi 30 giorni
//     for (let i = 0; i < count; i++) {
//         const randomDate = new Date();
//         randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30));

//         bookingsData.push({
//             tenantId,
//             employeeId: getRandomElement(employees).id,
//             roomId: getRandomElement(rooms).id,
//             date: randomDate,
//             period: getRandomElement(periods),
//             status: getRandomElement(statuses),
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             confirmedAt: getRandomElement(statuses) === 'confirmed' ? new Date() : null,
//             cancelledAt: getRandomElement(statuses) === 'cancelled' ? new Date() : null
//         });
//     }

//     if (bookingsData.length === 0) return [];

//     return await db.insert(bookings).values(bookingsData).returning();
// };

// Nuova funzione per generare prenotazioni in un periodo specifico (es. Gen-Feb-Mar 2025)
// con più prenotazioni per ciascun dipendente e con stanze scelte casualmente.
// const seedBookingsForPeriod = async (
//     tenantId: string,
//     employees: any[],
//     rooms: any[],
//     minBookingsPerEmployee: number,
//     maxBookingsPerEmployee: number,
//     start: Date,
//     end: Date
// ) => {
//     if (!employees.length || !rooms.length) {
//         console.log('No employees or rooms available for bookings');
//         return [];
//     }

//     const bookingsData = [];
//     const periods = ['full', 'morning', 'afternoon'];
//     const statuses = ['pending', 'confirmed', 'cancelled'];

//     for (const employee of employees) {
//         const bookingsCount = Math.floor(Math.random() * (maxBookingsPerEmployee - minBookingsPerEmployee + 1)) + minBookingsPerEmployee;
//         for (let i = 0; i < bookingsCount; i++) {
//             const bookingDate = randomDateBetween(start, end);
//             bookingsData.push({
//                 tenantId,
//                 employeeId: employee.id,
//                 roomId: getRandomElement(rooms).id,
//                 date: bookingDate,
//                 period: getRandomElement(periods),
//                 status: getRandomElement(statuses),
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//                 confirmedAt: getRandomElement(statuses) === 'confirmed' ? new Date() : null,
//                 cancelledAt: getRandomElement(statuses) === 'cancelled' ? new Date() : null
//             });
//         }
//     }

//     if (bookingsData.length === 0) return [];

//     return await db.insert(bookings).values(bookingsData).returning();
// };

const seed = async () => {
    try {
        // Reset database
        console.log('Cleaning database...');
        await Promise.all([
            db.delete(tenants),
            db.delete(rooms),
            db.delete(locations),
            // db.delete(bookings),
            // db.delete(employees),
        ]);

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
        const gotonextRoomsPromises = gotonextLocations.map(loc => seedRooms(loc.id));
        const cubeconsultantsRoomsPromises = cubeconsultantsLocations.map(loc => seedRooms(loc.id));

        const [gotonextRooms, cubeconsultantsRooms] = await Promise.all([
            Promise.all(gotonextRoomsPromises),
            Promise.all(cubeconsultantsRoomsPromises)
        ]);

        console.log('Seeding users and employees...');
        // const gotonextEmployees = await seedUsers(companyA.id, 'gotonext.it', 50);
        // const cubeconsultantsEmployees = await seedUsers(companyB.id, 'cubeconsultants.it', 30);

        // console.log('Seeding standard bookings...');
        // Prenotazioni standard (su 30 giorni relativi)
        // await seedBookings(
        //     companyA.id,
        //     gotonextEmployees,
        //     gotonextRooms.flat(),
        //     100
        // );
        // await seedBookings(
        //     companyB.id,
        //     cubeconsultantsEmployees,
        //     cubeconsultantsRooms.flat(),
        //     60
        // );

        // Prenotazioni per i mesi di Gennaio, Febbraio e Marzo 2025
        // const startPeriod = new Date('2025-01-01');
        // const endPeriod = new Date('2025-03-31');

        // console.log('Seeding bookings for Jan-Feb-Mar 2025 for Gotonext...');
        // await seedBookingsForPeriod(
        //     companyA.id,
        //     gotonextEmployees,
        //     gotonextRooms.flat(),
        //     5,  // minimo prenotazioni per dipendente
        //     10, // massimo prenotazioni per dipendente
        //     startPeriod,
        //     endPeriod
        // );

        // console.log('Seeding bookings for Jan-Feb-Mar 2025 for Cubeconsultants...');
        // await seedBookingsForPeriod(
        //     companyB.id,
        //     cubeconsultantsEmployees,
        //     cubeconsultantsRooms.flat(),
        //     5,
        //     10,
        //     startPeriod,
        //     endPeriod
        // );

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

export default seed;
