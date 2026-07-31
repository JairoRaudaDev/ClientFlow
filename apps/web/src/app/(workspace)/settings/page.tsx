import type { Metadata } from 'next';

import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Settings',
};

const sections = [
  {
    title: 'Profile',
    description: 'Personal account details will be editable here in a later change.',
  },
  {
    title: 'Workspace',
    description:
      'Workspace name and membership management will be editable here in a later change.',
  },
  {
    title: 'Billing',
    description:
      'Billing is not connected yet. Plan and payment details will appear here once available.',
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Workspace and account configuration." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title}>
            <h2 className="text-foreground text-base font-semibold">{section.title}</h2>
            <p className="text-muted mt-2 text-sm">{section.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
