import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client.js';
import { env } from './env.js';

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
});

export const prisma = new PrismaClient({ adapter });

export async function checkDatabaseConnection(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  await checkDatabaseConnection();
  process.stdout.write('clientflow-api connected to PostgreSQL.\n');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
