import 'dotenv/config';

import { defineConfig } from 'prisma/config';

const developmentDatabaseUrl = 'postgresql://clientflow:clientflow@localhost:5432/clientflow';

function getDatabaseUrl(): string {
  const configuredDatabaseUrl = process.env['DATABASE_URL'];

  if (configuredDatabaseUrl !== undefined && configuredDatabaseUrl.trim() !== '') {
    return configuredDatabaseUrl;
  }

  const nodeEnvironment = process.env['NODE_ENV'] ?? 'development';

  if (nodeEnvironment !== 'development') {
    throw new Error(`DATABASE_URL is required when NODE_ENV is ${nodeEnvironment}.`);
  }

  return developmentDatabaseUrl;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
