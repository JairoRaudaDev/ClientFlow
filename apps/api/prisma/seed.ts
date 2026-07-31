import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '../src/config/env.js';
import { MembershipRole, PrismaClient } from '../src/generated/prisma/client.js';
import { hashPassword } from '../src/services/password.service.js';

const demoUserId = '11111111-1111-4111-8111-111111111111';
const demoWorkspaceId = '22222222-2222-4222-8222-222222222222';
const demoMembershipId = '33333333-3333-4333-8333-333333333333';
const demoUserEmail = 'demo@clientflow.local';

// Fixed UUIDs make the seed deterministic: re-running it updates in place instead of duplicating.
interface DemoClient {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
}

const demoClients: DemoClient[] = [
  {
    id: '44444444-4444-4444-8444-444444444444',
    name: 'Northstar Creative',
    company: null,
    email: 'hello@northstar.example',
    phone: '+1 555 0101',
    notes: 'Brand identity and web design. Prefers updates on Fridays.',
  },
  {
    id: '55555555-5555-5555-8555-555555555555',
    name: 'Acme Consulting',
    company: 'Acme',
    email: 'contact@acme.example',
    phone: null,
    notes: null,
  },
  {
    id: '66666666-6666-6666-8666-666666666666',
    name: 'Rivera Photography',
    company: 'Rivera',
    email: 'studio@rivera.example',
    phone: '+1 555 0102',
    notes: 'Event photography. Prefers email scheduling.',
  },
];

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

  for (const client of demoClients) {
    await prisma.client.upsert({
      where: { id: client.id },
      update: {
        workspaceId: workspace.id,
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        notes: client.notes,
      },
      create: {
        id: client.id,
        workspaceId: workspace.id,
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        notes: client.notes,
      },
    });
  }

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
