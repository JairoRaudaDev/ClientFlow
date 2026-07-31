import { ButtonLink } from '@/components/ui/ButtonLink';

interface ClientNoClientsStateProps {
  createHref: string;
}

export function ClientNoClientsState({ createHref }: ClientNoClientsStateProps) {
  return (
    <div className="border-border flex flex-col items-center gap-4 rounded-lg border border-dashed px-6 py-16 text-center">
      <div>
        <h2 className="text-foreground text-sm font-medium">No clients yet</h2>
        <p className="text-muted mt-1 max-w-sm text-sm">
          Add your first client to start tracking who you work with.
        </p>
      </div>
      <ButtonLink href={createHref}>Add client</ButtonLink>
    </div>
  );
}

interface ClientNoResultsStateProps {
  onClear: () => void;
}

export function ClientNoResultsState({ onClear }: ClientNoResultsStateProps) {
  return (
    <div className="border-border flex flex-col items-center gap-4 rounded-lg border border-dashed px-6 py-16 text-center">
      <div>
        <h2 className="text-foreground text-sm font-medium">No clients match your search</h2>
        <p className="text-muted mt-1 max-w-sm text-sm">
          Try a different search term or clear your filters.
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-accent focus-visible:ring-accent rounded-md text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
      >
        Clear search and filters
      </button>
    </div>
  );
}
