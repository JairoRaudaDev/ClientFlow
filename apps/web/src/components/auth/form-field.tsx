import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

export function FormField({
  id,
  label,
  error,
  description,
  className,
  ...inputProps
}: FormFieldProps) {
  const descriptionId = description !== undefined ? `${id}-description` : undefined;
  const errorId = error !== undefined ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        {label}
      </label>
      {description !== undefined ? (
        <p id={descriptionId} className="text-muted text-xs">
          {description}
        </p>
      ) : null}
      <input
        id={id}
        aria-invalid={error !== undefined}
        aria-describedby={describedBy}
        className={cn(
          'border-border bg-surface text-foreground placeholder:text-muted w-full rounded-md border px-3 py-2 text-sm transition-colors',
          'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error !== undefined && 'border-red-400 focus-visible:ring-red-400',
          className,
        )}
        {...inputProps}
      />
      {error !== undefined ? (
        <p id={errorId} className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
