import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Client management workspace for freelancers and small service businesses',
  description:
    'Organize your clients in one secure workspace. ClientFlow keeps client information organized, searchable, and easy to maintain.',
};

const features = [
  {
    title: 'Secure account access',
    description: 'Registration and login protected by password hashing and short-lived JWT tokens.',
  },
  {
    title: 'Workspace-scoped client records',
    description: 'Every client belongs to a workspace, and access is verified against the database.',
  },
  {
    title: 'Search and filters',
    description: 'Find clients by name, company, email, or phone, and filter on what you track.',
  },
  {
    title: 'Responsive client management',
    description: 'Create, edit, and delete client records from any device.',
  },
];

export default function MarketingHomePage() {
  return (
    <Container className="flex flex-col gap-16 py-16 sm:py-24">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          Organize your clients in one secure workspace.
        </h1>
        <p className="text-muted text-lg">
          ClientFlow helps freelancers and small service businesses keep client information
          organized, searchable, and easy to maintain.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/register">Create an account</ButtonLink>
          <ButtonLink href="/login" variant="secondary">
            Log in
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title}>
            <h2 className="text-foreground text-base font-semibold">{feature.title}</h2>
            <p className="text-muted mt-2 text-sm">{feature.description}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
