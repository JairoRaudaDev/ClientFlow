import Link from 'next/link';
import type { ReactNode } from 'react';

import { Brand } from '@/components/layout/Brand';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { SidebarNavigation } from '@/components/layout/SidebarNavigation';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-border bg-surface border-b">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Brand />
          <Link href="/" className="text-muted hover:text-foreground text-sm font-medium">
            Back to site
          </Link>
        </div>
        <MobileNavigation />
      </header>
      <div className="mx-auto flex w-full max-w-6xl">
        <aside
          aria-label="Workspace navigation"
          className="border-border hidden w-56 shrink-0 border-r px-4 py-6 md:block"
        >
          <SidebarNavigation />
        </aside>
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
