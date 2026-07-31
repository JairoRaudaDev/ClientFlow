import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '../src/config/env.js';
import { MembershipRole, PrismaClient } from '../src/generated/prisma/client.js';
import { hashPassword } from '../src/services/password.service.js';

const demoUserId = '11111111-1111-4111-8111-111111111111';
const demoWorkspaceId = '22222222-2222-4222-8222-222222222222';
const demoMembershipId = '33333333-3333-4333-8333-333333333333';
const demoUserEmail = 'demo@clientflow.local';

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
});
const prisma = new PrismaClient({ adapter });

async function seed(): Promise<void> {
  if (env.seedUserPassword === undefined) {
    throw new Error('SEED_USER_PASSWORD must be set when running the seed in production.');
  }

  const passwordHash = await hashPassword(env.seedUserPassword);
  const user = await prisma.user.upsert({
    where: { email: demoUserEmail },
    update: {
      name: 'Demo User',
      passwordHash,
    },
    create: {
      id: demoUserId,
      name: 'Demo User',
      email: demoUserEmail,
      passwordHash,
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: demoWorkspaceId },
    update: { name: 'Demo Workspace' },
    create: {
      id: demoWorkspaceId,
      name: 'Demo Workspace',
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    },
    update: { role: MembershipRole.OWNER },
    create: {
      id: demoMembershipId,
      userId: user.id,
      workspaceId: workspace.id,
      role: MembershipRole.OWNER,
    },
  });

  process.stdout.write(`Development seed completed for ${demoUserEmail}.\n`);
}

seed()
  .catch(() => {
    process.stderr.write('Development seed failed.\n');
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch {
      process.stderr.write('Development seed database cleanup failed.\n');
      process.exitCode = 1;
    }
  });
