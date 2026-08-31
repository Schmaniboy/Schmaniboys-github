import type { Metadata } from 'next';

import { TokenFormular } from '@/components/auth/TokenFormular';

/*
 * Dynamisch, damit die Seite den Nonce der strengen Content-Security-Policy
 * tragen kann -- wie die Anmeldeseite.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Neues Passwort' };

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
      <h1 className="text-2xl font-semibold text-ink">Neues Passwort</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Vergeben Sie ein neues Passwort. Der Link aus der E-Mail lässt sich nur einmal verwenden.
      </p>

      <div className="mt-8">
        <TokenFormular modus="neu" token={token} />
      </div>
    </div>
  );
}
