import type { Metadata } from 'next';

import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ClientFlow',
    template: '%s | ClientFlow',
  },
  description:
    'A secure client management workspace for freelancers and small service businesses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <a
            href="#main-content"
            className="bg-accent text-accent-foreground focus-visible:ring-accent sr-only rounded-md px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus-visible:ring-2 focus-visible:outline-none"
          >
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
