import type { Metadata, Viewport } from 'next';

import { darfIndexiertWerden } from '@/lib/env';

import { ClientProviders } from '@/components/layout/ClientProviders';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CARONEX — Fahrzeugwissen und Fahrzeugverkauf',
    template: '%s · CARONEX',
  },
  description:
    'CARONEX: Belegtes Fahrzeugwissen zu Modellen, Generationen, Motoren und Ausstattung — und ein Weg, ein Fahrzeug ohne Ratespiel zu verkaufen.',
  manifest: '/manifest.json',
  robots: {
    index: darfIndexiertWerden,
    follow: darfIndexiertWerden,
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'CARONEX',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: '#08090a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col">
        <ClientProviders>
          {/* Erster Fokuspunkt der Seite: ohne ihn muss man sich per Tastatur
              durch die gesamte Navigation arbeiten. */}
          <a
            href="#inhalt"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
          >
            Zum Inhalt springen
          </a>

          <SiteHeader />
          <main id="inhalt" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </ClientProviders>
      </body>
    </html>
  );
}
