'use client';

import Link from 'next/link';

import { ClientErrorState } from '@/components/clients/client-error-state';
import { ClientNoClientsState } from '@/components/clients/client-empty-state';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceRequired } from '@/components/workspace/workspace-required';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useDashboard } from '@/hooks/use-dashboard';
import { useSession } from '@/hooks/use-session';
import { formatDate } from '@/lib/format/date';
import type { Client } from '@/types/client';

export function DashboardView() {
  const { user } = useSession();
  const { status, activeWorkspace } = useActiveWorkspace();
  const { data, isLoading, errorMessage, retry } = useDashboard();

  if (status !== 'ready' || activeWorkspace === null || user === null) {
    return <WorkspaceRequired />;
  }

  const workspaceName = activeWorkspace.name;
  const totalClients = data?.pagination.total ?? 0;
  const recentClients = data?.clients ?? [];
  const givenName = user.name.trim().split(/\s+/)[0] ?? '';
  const welcome = givenName.length > 0 ? `Welcome back, ${givenName}` : 'Welcome back';

  if (errorMessage !== null) {
    return <ClientErrorState message={errorMessage} onRetry={retry} />;
  }

  if (isLoading && data === null) {
    return (
      <p role="status" aria-live="polite" className="text-muted text-sm">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title={welcome}
        description={`Here&apos;s what is happening in ${workspaceName}.`}
        actions={<ButtonLink href="/clients/new">Add client</ButtonLink>}
      />

      <section aria-labelledby="overview-heading" className="space-y-4">
        <h2 id="overview-heading" className="text-foreground text-lg font-semibold">
          Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-muted text-sm">Total clients</p>
            <p className="text-foreground mt-2 text-3xl font-semibold">{totalClients}</p>
          </Card>
          <Card>
            <p className="text-muted text-sm">Active workspace</p>
            <p className="text-foreground mt-2 text-base font-medium break-words">{workspaceName}</p>
          </Card>
          <Card>
            <p className="text-muted text-sm">Account email</p>
            <p className="text-foreground mt-2 text-base font-medium break-words">{user.email}</p>
          </Card>
        </div>
      </section>

      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="recent-heading" className="text-foreground text-lg font-semibold">
            Recently updated clients
          </h2>
          <Link
            href="/clients"
            className="text-accent focus-visible:ring-accent rounded text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            View all clients
          </Link>
        </div>

        {isLoading ? (
          <p role="status" aria-live="polite" className="text-muted text-sm">
            Loading clients...
          </p>
        ) : recentClients.length === 0 ? (
          <ClientNoClientsState createHref="/clients/new" />
        ) : (
          <ul className="border-border divide-border overflow-hidden rounded-lg border divide-y">
            {recentClients.map((client) => (
              <RecentClientRow key={client.id} client={client} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function RecentClientRow({ client }: { client: Client }) {
  const secondary = [client.company, client.email].filter(Boolean).join(' · ');

  return (
    <li className="bg-surface flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <Link
          href={`/clients/${client.id}`}
          className="text-foreground hover:text-accent focus-visible:ring-accent rounded font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          {client.name}
        </Link>
        <p className="text-muted truncate text-sm">{secondary.length > 0 ? secondary : 'No contact info'}</p>
      </div>
      <p className="text-muted shrink-0 text-xs">
        Updated <time dateTime={client.updatedAt}>{formatDate(client.updatedAt)}</time>
      </p>
    </li>
  );
}
