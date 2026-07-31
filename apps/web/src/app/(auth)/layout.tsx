import Link from 'next/link';
import type { ReactNode } from 'react';

import { Brand } from '@/components/layout/Brand';
import { Container } from '@/components/ui/Container';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="py-6">
        <Container>
          <Brand />
        </Container>
      </header>
      <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
      <footer className="py-6 text-center">
        <Link href="/" className="text-muted hover:text-foreground text-sm font-medium">
          Back to ClientFlow
        </Link>
      </footer>
    </div>
  );
}
