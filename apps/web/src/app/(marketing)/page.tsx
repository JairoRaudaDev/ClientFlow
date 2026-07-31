import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Client and project workspace for freelancers and agencies',
};

const productAreas = [
  {
    title: 'Clients',
    description: 'Keep every client relationship in one organized, shared place.',
  },
  {
    title: 'Projects',
    description: 'Track the work you have committed to, from kickoff to delivery.',
  },
  {
    title: 'Workspace visibility',
    description: 'See what matters across your clients and projects without digging.',
  },
];

export default function MarketingHomePage() {
  return (
    <Container className="flex flex-col gap-16 py-16 sm:py-24">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          A calmer way to run client work.
        </h1>
        <p className="text-muted text-lg">
          ClientFlow is a lightweight client and project management workspace built for freelancers
          and small agencies who want a clear picture of their work without overbuilt tooling.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/register">Create an account</ButtonLink>
          <ButtonLink href="/login" variant="secondary">
            Log in
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {productAreas.map((area) => (
          <Card key={area.title}>
            <h2 className="text-foreground text-base font-semibold">{area.title}</h2>
            <p className="text-muted mt-2 text-sm">{area.description}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
