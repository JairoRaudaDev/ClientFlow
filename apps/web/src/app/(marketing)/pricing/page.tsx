import type { Metadata } from 'next';

import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Pricing',
};

const plans = [
  {
    name: 'FREE',
    price: '$0',
    description: 'For getting a workspace set up and exploring the basics.',
    features: ['Core workspace access', 'A single member', 'Community support'],
  },
  {
    name: 'PRO',
    price: '$—',
    description: 'For freelancers and small agencies running client work day to day.',
    features: ['Everything in Free', 'Additional workspace members', 'Priority support'],
  },
];

export default function PricingPage() {
  return (
    <Container className="flex flex-col gap-10 py-16 sm:py-24">
      <PageHeader
        title="Pricing"
        description="Plan details are still being finalized. Billing is not enabled yet, so these cards are for preview only."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Badge>{plan.name}</Badge>
              <p className="text-foreground text-2xl font-semibold">{plan.price}</p>
            </div>
            <p className="text-muted text-sm">{plan.description}</p>
            <ul className="text-foreground flex flex-col gap-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <ButtonLink href="/register" variant="secondary" className="mt-auto">
              Get started
            </ButtonLink>
          </Card>
        ))}
      </div>
    </Container>
  );
}
