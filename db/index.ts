import { drizzle } from 'drizzle-orm/neon-http';

const DATABASE_URL = process.env.EXPO_PUBLIC_DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = drizzle(DATABASE_URL);