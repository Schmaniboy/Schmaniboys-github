import { LinkButton } from '@/components/ui/Button';

/**
 * Diese Seite wird bei jedem Aufruf erzeugt, nicht vorab.
 *
 * Der Grund ist die Sicherheitsrichtlinie: Unter /admin, /konto, /haendler
 * und den Anmeldeseiten bekommt jede Antwort einen frischen Nonce, und nur
 * Skripte mit genau diesem Nonce duerfen laufen. Eine vorab erzeugte Seite
 * traegt den Nonce von damals -- also keinen gueltigen.
 *
 * Die Folge war eine 404-Seite, auf der der Browser saemtliche 21 Skripte
 * ablehnte: Sie sah richtig aus, aber nichts daran funktionierte, und die
 * Konsole stand voll. Aufgefallen im Browserrundgang, nicht in den Tests --
 * die Fachtests pruefen den Statuscode, und der war korrekt 404.
 */
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-24">
      <div className="accent-rule" />
      <p className="eyebrow">Fehler 404</p>
      <h1 className="text-2xl font-semibold text-ink">Diese Seite gibt es nicht</h1>
      <p className="text-sm leading-relaxed text-ink-muted">
        Möglicherweise wurde der Inhalt entfernt oder die Adresse enthält einen
        Tippfehler.
      </p>
      <LinkButton href="/" variant="secondary">Zur Startseite</LinkButton>
    </div>
  );
}
