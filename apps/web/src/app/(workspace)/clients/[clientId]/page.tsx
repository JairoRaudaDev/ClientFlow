import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ClientDetails } from '@/components/clients/client-details';

export const metadata: Metadata = {
  title: 'Client details',
};

interface ClientDetailPageProps {
  params: Promise<{ clientId: string }>;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { clientId } = await params;

  return (
    <Suspense fallback={<p className="text-muted text-sm">Loading client...</p>}>
      <ClientDetails clientId={clientId} />
    </Suspense>
  );
}
