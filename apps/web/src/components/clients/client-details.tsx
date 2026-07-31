'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

import { ClientDeleteDialog } from '@/components/clients/client-delete-dialog';
import { ClientErrorState } from '@/components/clients/client-error-state';
import { ClientNotFoundState } from '@/components/clients/client-not-found-state';
import { ClientStatusNotice } from '@/components/clients/client-status-notice';
import { WorkspaceRequired } from '@/components/workspace/workspace-required';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useClient } from '@/hooks/use-client';
import { useSession } from '@/hooks/use-session';
import { deleteClient } from '@/lib/api/clients';
import { ApiRequestError } from '@/lib/api/errors';
import { isAuthFailureCode } from '@/lib/clients/client-error-handling';
import { isValidClientId } from '@/lib/clients/client-validation';
import { formatDate } from '@/lib/format/date';
import type { Client } from '@/types/client';

interface ClientDetailsProps {
  clientId: string;
}

export function ClientDetails({ clientId }: ClientDetailsProps) {
  const router = useRouter();
  const { accessToken, handleAuthenticationFailure } = useSession();
  const { status, activeWorkspace, reportWorkspaceAccessDenied } = useActiveWorkspace();
  const isValidId = isValidClientId(clientId);
  const { client, isLoading, errorMessage, notFound, retry } = useClient(
    isValidId ? clientId : null,
  );
  const [pendingDelete, setPendingDelete] = useState<Client | null>(null);

  if (!isValidId || notFound) {
    return <ClientNotFoundState />;
  }

  if (status !== 'ready' || activeWorkspace === null || accessToken === null) {
    return <WorkspaceRequired />;
  }

  if (errorMessage !== null) {
    return <ClientErrorState message={errorMessage} onRetry={retry} backHref="/clients" />;
  }

  if (isLoading || client === null) {
    return (
      <p role="status" aria-live="polite" className="text-muted text-sm">
        Loading client...
      </p>
    );
  }

  const workspaceId = activeWorkspace.id;
  const currentAccessToken = accessToken;

  async function handleConfirmDelete(target: Client) {
    try {
      await deleteClient({ accessToken: currentAccessToken, workspaceId }, target.id);
      setPendingDelete(null);
      router.push('/clients?status=deleted');
    } catch (error) {
      if (error instanceof ApiRequestError && error.kind === 'api') {
        if (isAuthFailureCode(error.code)) {
          handleAuthenticationFailure(error.code);
          setPendingDelete(null);
          return;
        }

        if (error.code === 'WORKSPACE_ACCESS_DENIED') {
          reportWorkspaceAccessDenied();
          setPendingDelete(null);
          return;
        }

        if (error.code === 'CLIENT_NOT_FOUND') {
          setPendingDelete(null);
          router.push('/clients');
          return;
        }
      }

      throw error;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={null}>
        <ClientStatusNotice />
      </Suspense>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/clients" className="text-muted hover:text-foreground text-sm font-medium">
          ← Back to clients
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/clients/${client.id}/edit`}
            className="border-border bg-surface text-foreground hover:bg-accent-muted focus-visible:ring-accent inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setPendingDelete(client)}
            className="focus-visible:ring-accent inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:outline-none"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="border-border bg-surface rounded-lg border p-6">
        <h1 className="text-foreground text-2xl font-semibold break-words">{client.name}</h1>
        {client.company !== null ? <p className="text-muted mt-1 text-sm">{client.company}</p> : null}

        <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted text-xs font-medium tracking-wide uppercase">Email</dt>
            <dd className="text-foreground mt-1 text-sm break-words">
              {client.email !== null ? (
                <a href={`mailto:${client.email}`} className="hover:text-accent">
                  {client.email}
                </a>
              ) : (
                <span className="text-muted">Not provided</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-medium tracking-wide uppercase">Phone</dt>
            <dd className="text-foreground mt-1 text-sm">
              {client.phone !== null ? (
                <a href={`tel:${client.phone}`} className="hover:text-accent">
                  {client.phone}
                </a>
              ) : (
                <span className="text-muted">Not provided</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-medium tracking-wide uppercase">Created</dt>
            <dd className="text-foreground mt-1 text-sm">
              <time dateTime={client.createdAt}>{formatDate(client.createdAt)}</time>
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-medium tracking-wide uppercase">Updated</dt>
            <dd className="text-foreground mt-1 text-sm">
              <time dateTime={client.updatedAt}>{formatDate(client.updatedAt)}</time>
            </dd>
          </div>
        </dl>

        <dl className="mt-6">
          <dt className="text-muted text-xs font-medium tracking-wide uppercase">Notes</dt>
          {client.notes !== null ? (
            <dd className="text-foreground mt-1 text-sm whitespace-pre-line">{client.notes}</dd>
          ) : (
            <dd className="text-muted mt-1 text-sm">No notes</dd>
          )}
        </dl>
      </div>

      <ClientDeleteDialog
        client={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
