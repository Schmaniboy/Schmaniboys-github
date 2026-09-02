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

export const metadata: Metadata = { title: 'Konto erstellen' };

export default function RegisterPage() {
  return (
    <div className="auth-bg flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-8">
      <div className="glass-card w-full max-w-md rounded-xl p-8">
        <div className="accent-rule mb-6" />
        <h1 className="text-2xl font-semibold text-ink">Konto erstellen</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Bereits registriert?{' '}
          <Link href="/anmelden" className="text-accent hover:text-accent-strong">
            Anmelden
          </Link>
        </p>

        <div className="mt-8">
          <AuthForm mode="registrieren" />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink-subtle">
          Hinweis: Die Bestätigung der E-Mail-Adresse ist noch nicht aktiv, weil
          kein Versandweg festgelegt ist. Konten sind deshalb sofort nutzbar.
        </p>
      </div>
    </div>
  );
}
