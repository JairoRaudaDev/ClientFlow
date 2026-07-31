import type { Metadata } from 'next';

import { ClientList } from '@/components/clients/client-list';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Clients',
};

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clients"
        description="Manage the people and organizations connected to your workspace."
        actions={<ButtonLink href="/clients/new">Add client</ButtonLink>}
      />
      <ClientList />
    </div>
  );
}
