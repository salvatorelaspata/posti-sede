import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTenants() {
    return db.select().from(tenants);
}

export async function getTenant(id: string) {
    return db.select().from(tenants).where(eq(tenants.id, id));
}