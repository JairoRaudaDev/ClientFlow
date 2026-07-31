'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { ClientCardList } from '@/components/clients/client-card-list';
import { ClientDeleteDialog } from '@/components/clients/client-delete-dialog';
import { ClientErrorState } from '@/components/clients/client-error-state';
import { ClientNoClientsState, ClientNoResultsState } from '@/components/clients/client-empty-state';
import { ClientListToolbar } from '@/components/clients/client-list-toolbar';
import { ClientStatusNotice } from '@/components/clients/client-status-notice';
import { ClientTable } from '@/components/clients/client-table';
import { WorkspaceRequired } from '@/components/workspace/workspace-required';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useClients } from '@/hooks/use-clients';
import { useSession } from '@/hooks/use-session';
import { deleteClient } from '@/lib/api/clients';
import { ApiRequestError } from '@/lib/api/errors';
import { isAuthFailureCode } from '@/lib/clients/client-error-handling';
import { parseClientListQueryState, serializeClientListQueryState } from '@/lib/clients/client-query-state';
import type { Client } from '@/types/client';

export function ClientList() {
  return (
    <Suspense fallback={<ClientListSkeleton />}>
      <ClientListContent />
    </Suspense>
  );
}

function ClientListSkeleton() {
  return (
    <p role="status" aria-live="polite" className="text-muted text-sm">
      Loading clients...
    </p>
  );
}

function ClientListContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseClientListQueryState(searchParams);
  const { accessToken, handleAuthenticationFailure } = useSession();
  const { status, activeWorkspace, reportWorkspaceAccessDenied } = useActiveWorkspace();
  const { data, isLoading, errorMessage, retry } = useClients(query);
  const [pendingDelete, setPendingDelete] = useState<Client | null>(null);
  const previousWorkspaceIdRef = useRef<string | null>(null);
  const resolvedWorkspaceId = activeWorkspace?.id ?? null;

  useEffect(() => {
    if (
      previousWorkspaceIdRef.current !== null &&
      previousWorkspaceIdRef.current !== resolvedWorkspaceId &&
      query.page !== 1
    ) {
      const params = serializeClientListQueryState({ ...query, page: 1 });
      router.replace(params.toString().length > 0 ? `${pathname}?${params.toString()}` : pathname);
    }

    previousWorkspaceIdRef.current = resolvedWorkspaceId;
    // Only react to the resolved workspace changing, not to every query/pathname re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedWorkspaceId]);

  if (status !== 'ready' || activeWorkspace === null || accessToken === null) {
    return <WorkspaceRequired />;
  }

  const workspaceId = activeWorkspace.id;
  const currentAccessToken = accessToken;

  function handleClearSearchAndFilters() {
    router.replace(pathname);
  }

  function goToPage(nextPage: number) {
    const params = serializeClientListQueryState({ ...query, page: nextPage });
    router.push(params.toString().length > 0 ? `${pathname}?${params.toString()}` : pathname);
  }

  async function handleConfirmDelete(target: Client) {
    try {
      await deleteClient({ accessToken: currentAccessToken, workspaceId }, target.id);
      setPendingDelete(null);

      const remainingOnPage = (data?.clients.length ?? 1) - 1;

      if (remainingOnPage === 0 && query.page > 1) {
        goToPage(query.page - 1);
      } else {
        retry();
      }
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
          retry();
          return;
        }
      }

      throw error;
    }
  }

  const clients = data?.clients ?? [];
  const pagination = data?.pagination ?? null;
  const isFiltered = query.q.length > 0 || query.hasEmail !== 'any' || query.hasPhone !== 'any';

  return (
    <div className="flex flex-col gap-6">
      <ClientStatusNotice />

      <ClientListToolbar resultCount={pagination?.total} />

      {errorMessage !== null ? (
        <ClientErrorState message={errorMessage} onRetry={retry} />
      ) : (
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <p role="status" aria-live="polite" className="text-muted text-sm">
              Loading clients...
            </p>
          ) : null}

          {!isLoading && clients.length === 0 ? (
            isFiltered ? (
              <ClientNoResultsState onClear={handleClearSearchAndFilters} />
            ) : (
              <ClientNoClientsState createHref="/clients/new" />
            )
          ) : clients.length > 0 ? (
            <>
              <ClientTable clients={clients} onRequestDelete={setPendingDelete} />
              <ClientCardList clients={clients} onRequestDelete={setPendingDelete} />
            </>
          ) : null}
        </div>
      )}

      {pagination !== null && pagination.total > 0 ? (
        <nav aria-label="Client pagination" className="flex items-center justify-between gap-4 text-sm">
          <button
            type="button"
            onClick={() => goToPage(pagination.page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="border-border bg-surface text-foreground hover:bg-accent-muted focus-visible:ring-accent rounded-md border px-3 py-1.5 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-muted">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <button
            type="button"
            onClick={() => goToPage(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="border-border bg-surface text-foreground hover:bg-accent-muted focus-visible:ring-accent rounded-md border px-3 py-1.5 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      ) : null}

      <ClientDeleteDialog
        client={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
