interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="border-border flex flex-col items-center gap-1 rounded-lg border border-dashed px-6 py-16 text-center">
      <p className="text-foreground text-sm font-medium">{title}</p>
      <p className="text-muted max-w-sm text-sm">{description}</p>
    </div>
  );
}
