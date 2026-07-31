import { ButtonLink } from '@/components/ui/ButtonLink';

interface ClientErrorStateProps {
  message?: string;
  onRetry: () => void;
  backHref?: string;
}

/** Generic recoverable-error panel: network failures, timeouts, and unexpected server errors. */
export function ClientErrorState({ message, onRetry, backHref }: ClientErrorStateProps) {
  return (
    <div
      role="alert"
      className="border-border bg-surface flex flex-col items-center gap-3 rounded-lg border px-6 py-12 text-center"
    >
      <h2 className="text-foreground text-sm font-medium">Something went wrong</h2>
      <p className="text-muted max-w-sm text-sm">
        {message ?? 'We could not load this data. Please try again.'}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="bg-accent text-accent-foreground focus-visible:ring-accent rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:outline-none"
        >
          Try again
        </button>
        {backHref !== undefined ? (
          <ButtonLink href={backHref} variant="secondary">
            Back to clients
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}
