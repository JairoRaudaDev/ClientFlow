import { ButtonLink } from '@/components/ui/ButtonLink';

/** Rendered for an invalid route id or a `CLIENT_NOT_FOUND` response. Never reveals which case. */
export function ClientNotFoundState() {
  return (
    <div className="border-border bg-surface flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
      <h2 className="text-foreground text-sm font-medium">Client not found</h2>
      <p className="text-muted max-w-sm text-sm">
        This client does not exist or may have been removed.
      </p>
      <ButtonLink href="/clients" variant="secondary">
        Back to clients
      </ButtonLink>
    </div>
  );
}
