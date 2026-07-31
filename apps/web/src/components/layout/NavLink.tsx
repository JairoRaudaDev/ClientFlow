'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

export function NavLink({ href, className, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-accent-muted text-accent'
          : 'text-muted hover:bg-accent-muted hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}
