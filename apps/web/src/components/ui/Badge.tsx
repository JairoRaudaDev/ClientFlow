import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'bg-accent-muted text-accent inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        className,
      )}
      {...props}
    />
  );
}
