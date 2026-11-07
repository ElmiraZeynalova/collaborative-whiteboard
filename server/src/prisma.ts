import "dotenv/config";
import { rdsCa } from "./lib/rds-ca.js";

import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    ssl: process.env.NODE_ENV === "production" ? { ca: rdsCa } : undefined,
});

export const prisma = new PrismaClient({
    adapter,
});