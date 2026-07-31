import Link from 'next/link';
import type { ReactNode } from 'react';

import { Brand } from '@/components/layout/Brand';
import { Container } from '@/components/ui/Container';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border border-b">
        <Container className="flex items-center justify-between gap-4 py-4">
          <Brand />
          <nav aria-label="Primary" className="flex items-center gap-6">
            <Link href="/login" className="text-muted hover:text-foreground text-sm font-medium">
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-accent text-accent-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:bg-indigo-700"
            >
              Sign up
            </Link>
          </nav>
        </Container>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <footer className="border-border border-t">
        <Container className="text-muted flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ClientFlow.</p>
          <nav aria-label="Footer" className="flex items-center gap-4">
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
          </nav>
        </Container>
      </footer>
    </div>
  );
}
