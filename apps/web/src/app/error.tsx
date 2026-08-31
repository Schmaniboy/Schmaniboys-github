'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/Button';

/**
 * Auffangnetz fuer Fehler beim Rendern.
 *
 * Die technische Ursache wird protokolliert, nicht angezeigt. `digest` ist die
 * Kennung, die Next.js serverseitig demselben Fehler zuordnet -- damit laesst
 * sich eine Meldung im Log wiederfinden, ohne dem Besucher Interna zu zeigen.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[render]', error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-24">
      <div className="accent-rule" />
      <h1 className="text-2xl font-semibold text-ink">Da ist etwas schiefgelaufen</h1>
      <p className="text-sm leading-relaxed text-ink-muted">
        Der Vorgang wurde nicht ausgeführt. Bitte versuchen Sie es erneut. Bleibt
        der Fehler bestehen, hilft die folgende Kennung bei der Suche.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-ink-subtle">Kennung: {error.digest}</p>
      ) : null}
      <Button variant="primary" onClick={reset}>
        Erneut versuchen
      </Button>
    </div>
  );
}
