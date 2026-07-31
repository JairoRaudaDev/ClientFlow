import type { Metadata } from 'next';

import { CreateClientView } from '@/components/clients/create-client-view';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'New client',
};

export default function NewClientPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New client" description="Add a new client to your workspace." />
      <CreateClientView />
    </div>
  );
}
