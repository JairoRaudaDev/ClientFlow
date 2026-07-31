'use client';

import { useRouter } from 'next/navigation';

import { ClientForm } from '@/components/clients/client-form';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { WorkspaceRequired } from '@/components/workspace/workspace-required';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useSession } from '@/hooks/use-session';
import { createClient } from '@/lib/api/clients';
import { ApiRequestError } from '@/lib/api/errors';
import { isAuthFailureCode } from '@/lib/clients/client-error-handling';
import type { NormalizedClientInput } from '@/lib/clients/client-validation';

const EMPTY_VALUES = { name: '', email: '', company: '', phone: '', notes: '' };

export function CreateClientView() {
  const router = useRouter();
  const { accessToken, handleAuthenticationFailure } = useSession();
  const { status, activeWorkspace, reportWorkspaceAccessDenied } = useActiveWorkspace();

  if (status !== 'ready' || activeWorkspace === null || accessToken === null) {
    return <WorkspaceRequired />;
  }

  const workspaceId = activeWorkspace.id;
  const currentAccessToken = accessToken;

  async function handleSubmit(values: NormalizedClientInput) {
    try {
      const client = await createClient({ accessToken: currentAccessToken, workspaceId }, values);
      router.push(`/clients/${client.id}?status=created`);
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
      }

      throw error;
    }
  }

  return (
    <div className="max-w-2xl">
      <ClientForm
        mode="create"
        initialValues={EMPTY_VALUES}
        onSubmit={handleSubmit}
        submitLabel="Create client"
      />
      <div className="mt-6">
        <ButtonLink href="/clients" variant="secondary">
          Cancel
        </ButtonLink>
      </div>
    </div>
  );
}
