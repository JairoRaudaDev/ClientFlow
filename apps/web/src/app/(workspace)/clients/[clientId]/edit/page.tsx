import type { Metadata } from 'next';

import { EditClientView } from '@/components/clients/edit-client-view';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Edit client',
};

interface EditClientPageProps {
  params: Promise<{ clientId: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { clientId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit client" description="Update this client's information." />
      <EditClientView clientId={clientId} />
    </div>
  );
}
