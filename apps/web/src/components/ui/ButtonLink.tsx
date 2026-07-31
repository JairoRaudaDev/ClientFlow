import Link from 'next/link';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary';

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:bg-indigo-700',
  secondary: 'border-border bg-surface text-foreground hover:bg-accent-muted border',
};

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        'focus-visible:ring-accent inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
