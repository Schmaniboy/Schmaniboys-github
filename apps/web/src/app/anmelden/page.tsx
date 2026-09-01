import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthForm } from '@/components/auth/AuthForm';

/*
 * Bewusst dynamisch: Nur dynamisch gerenderte Seiten koennen den Nonce der
 * strengen Content-Security-Policy tragen (siehe lib/csp.ts). Auf einer Seite
 * mit Anmeldeformular ist die strenge Richtlinie den Verzicht auf statische
 * Auslieferung wert.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Anmelden' };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-4 py-8">
      <div className="accent-rule mb-6" />
      <h1 className="text-2xl font-semibold text-ink">Anmelden</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Noch kein Konto?{' '}
        <Link href="/registrieren" className="text-accent hover:text-accent-strong">
          Konto erstellen
        </Link>
      </p>

      <div className="mt-8">
        <AuthForm mode="anmelden" />
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        <Link
          href="/passwort-vergessen"
          className="text-accent underline-offset-4 hover:underline"
        >
          Passwort vergessen?
        </Link>
      </p>
    </div>
  );
}
