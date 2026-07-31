import type { Metadata } from 'next';

import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Clients',
};

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clients"
        description="Keep track of the people and organizations you work with. Adding clients will be introduced in a later change."
      />
      <div className="border-border bg-surface text-muted rounded-lg border px-4 py-3 text-sm">
        Search and filtering controls will appear here once clients exist.
      </div>
      <EmptyState
        title="No clients yet"
        description="Client creation is not available yet. This is where your client list will appear."
      />
    </div>
  );
}
