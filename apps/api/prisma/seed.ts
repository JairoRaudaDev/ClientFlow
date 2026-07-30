import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '../src/config/env.js';
import { MembershipRole, PrismaClient } from '../src/generated/prisma/client.js';

const demoUserId = '11111111-1111-4111-8111-111111111111';
const demoWorkspaceId = '22222222-2222-4222-8222-222222222222';
const demoMembershipId = '33333333-3333-4333-8333-333333333333';
const nonAuthenticatablePasswordHash =
  '$clientflow$authentication-not-configured$non-authenticatable';

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
});
const prisma = new PrismaClient({ adapter });

async function seed(): Promise<void> {
  const user = await prisma.user.upsert({
    where: { email: 'demo@clientflow.local' },
    update: {
      name: 'Demo User',
      passwordHash: nonAuthenticatablePasswordHash,
    },
    create: {
      id: demoUserId,
      name: 'Demo User',
      email: 'demo@clientflow.local',
      passwordHash: nonAuthenticatablePasswordHash,
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

  process.stdout.write('Development seed completed.\n');
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
