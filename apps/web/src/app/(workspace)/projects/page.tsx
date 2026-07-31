import type { Metadata } from 'next';

import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Projects',
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Projects"
        description="Track the work in progress across your clients. Creating projects will be introduced in a later change."
      />
      <div className="border-border bg-surface text-muted rounded-lg border px-4 py-3 text-sm">
        Filtering by status and client will appear here once projects exist.
      </div>
      <EmptyState
        title="No projects yet"
        description="Project creation is not available yet. This is where your project list will appear."
      />
    </div>
  );
}
