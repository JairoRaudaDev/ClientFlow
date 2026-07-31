'use client';

import { useRouter } from 'next/navigation';

import { ClientErrorState } from '@/components/clients/client-error-state';
import { ClientForm } from '@/components/clients/client-form';
import { ClientNotFoundState } from '@/components/clients/client-not-found-state';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { WorkspaceRequired } from '@/components/workspace/workspace-required';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useClient } from '@/hooks/use-client';
import { useSession } from '@/hooks/use-session';
import { updateClient } from '@/lib/api/clients';
import { ApiRequestError } from '@/lib/api/errors';
import { isAuthFailureCode } from '@/lib/clients/client-error-handling';
import { isValidClientId } from '@/lib/clients/client-validation';
import type { NormalizedClientInput } from '@/lib/clients/client-validation';

interface EditClientViewProps {
  clientId: string;
}

export function EditClientView({ clientId }: EditClientViewProps) {
  const router = useRouter();
  const { accessToken, handleAuthenticationFailure } = useSession();
  const { status, activeWorkspace, reportWorkspaceAccessDenied } = useActiveWorkspace();
  const isValidId = isValidClientId(clientId);
  const { client, isLoading, errorMessage, notFound, retry } = useClient(
    isValidId ? clientId : null,
  );

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

  async function handleSubmit(values: NormalizedClientInput) {
    try {
      await updateClient({ accessToken: currentAccessToken, workspaceId }, clientId, values);
      router.push(`/clients/${clientId}?status=updated`);
    } catch (error) {
      if (error instanceof ApiRequestError && error.kind === 'api') {
        if (isAuthFailureCode(error.code)) {
          handleAuthenticationFailure(error.code);
          throw error;
        }

        if (error.code === 'WORKSPACE_ACCESS_DENIED') {
          reportWorkspaceAccessDenied();
          throw error;
        }

        if (error.code === 'CLIENT_NOT_FOUND') {
          router.push('/clients');
          throw error;
        }
      }

      throw error;
    }
  }

  return (
    <div className="max-w-2xl">
      <ClientForm
        mode="edit"
        initialValues={{
          name: client.name,
          email: client.email ?? '',
          company: client.company ?? '',
          phone: client.phone ?? '',
          notes: client.notes ?? '',
        }}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
      <div className="mt-6">
        <ButtonLink href={`/clients/${clientId}`} variant="secondary">
          Cancel
        </ButtonLink>
      </div>
    </div>
  );
}
