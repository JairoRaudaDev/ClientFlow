import type { Metadata } from 'next';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const metrics = ['Active clients', 'Active projects', 'Upcoming deadlines'];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Dashboard"
        description="An overview of your workspace. Data will populate here as clients and projects are added."
      />

      <section aria-labelledby="overview-heading" className="space-y-4">
        <h2 id="overview-heading" className="text-foreground text-lg font-semibold">
          Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric}>
              <p className="text-muted text-sm">{metric}</p>
              <p className="text-foreground mt-2 text-3xl font-semibold">—</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="deadlines-heading" className="space-y-4">
        <h2 id="deadlines-heading" className="text-foreground text-lg font-semibold">
          Upcoming deadlines
        </h2>
        <EmptyState
          title="No upcoming deadlines"
          description="Project deadlines will appear here once projects are created."
        />
      </section>

      <section aria-labelledby="activity-heading" className="space-y-4">
        <h2 id="activity-heading" className="text-foreground text-lg font-semibold">
          Recent activity
        </h2>
        <EmptyState
          title="No recent activity"
          description="Activity from your workspace will show up here."
        />
      </section>
    </div>
  );
}
