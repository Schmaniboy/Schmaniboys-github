import type { Metadata } from 'next';

import { TokenFormular } from '@/components/auth/TokenFormular';

/*
 * Dynamisch, damit die Seite den Nonce der strengen Content-Security-Policy
 * tragen kann -- wie die Anmeldeseite.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Passwort vergessen' };

export default async function Seite({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const roh = params.token;
  const token = (Array.isArray(roh) ? roh[0] : roh)?.trim();

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="accent-rule mb-6" />
      <h1 className="text-2xl font-semibold text-ink">Passwort vergessen</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Geben Sie Ihre E-Mail-Adresse ein. Wenn dazu ein Konto besteht, schicken wir einen Link zum Zurücksetzen.
      </p>

      <div className="mt-8">
        <TokenFormular modus="vergessen" token={token} />
      </div>
    </div>
  );
}
