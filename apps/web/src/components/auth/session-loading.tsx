export function SessionLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <p role="status" aria-live="polite" className="text-muted flex items-center gap-3 text-sm">
        <span
          aria-hidden="true"
          className="border-border border-t-accent h-4 w-4 animate-spin rounded-full border-2"
        />
        Checking your session...
      </p>
    </div>
  );
}
