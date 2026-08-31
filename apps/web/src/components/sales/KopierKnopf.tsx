'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Text in die Zwischenablage kopieren.
 *
 * Der Grund fuer die Umstaendlichkeit: `navigator.clipboard` gibt es nur in
 * einem "sicheren Kontext" -- https oder localhost. Wer die Anwendung im
 * eigenen Netz ueber http://192.168.x.x aufruft (also genau der Weg vom
 * Telefon aus), hat die Schnittstelle nicht. Ein Knopf, der dort einfach
 * nichts tut, ist schlimmer als keiner: Man drueckt, sieht keine Rueckmeldung
 * und fuegt dann eine alte Zwischenablage ein.
 *
 * Deshalb drei Stufen, in dieser Reihenfolge:
 *   1. `navigator.clipboard.writeText` -- der richtige Weg.
 *   2. Ein unsichtbares Textfeld plus `document.execCommand('copy')` --
 *      veraltet, aber ohne sicheren Kontext das Einzige, was noch geht.
 *   3. Klappt beides nicht: den Text markieren und sagen, dass jetzt
 *      Strg+C beziehungsweise langes Antippen dran ist.
 */
export function KopierKnopf({
  text,
  bezeichnung,
  zielId,
}: {
  text: string;
  /** Was kopiert wird -- steht in der Rueckmeldung und im Vorlesetext. */
  bezeichnung: string;
  /** Element, das bei Stufe 3 markiert wird. */
  zielId?: string;
}) {
  const [stand, setStand] = useState<'bereit' | 'kopiert' | 'markiert'>('bereit');
  const uhr = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (uhr.current) clearTimeout(uhr.current);
  }, []);

  function zuruecksetzen() {
    if (uhr.current) clearTimeout(uhr.current);
    uhr.current = setTimeout(() => setStand('bereit'), 4000);
  }

  async function kopieren() {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setStand('kopiert');
        zuruecksetzen();
        return;
      } catch {
        // Verweigert (fehlende Berechtigung, kein sicherer Kontext) —
        // weiter zur naechsten Stufe.
      }
    }

    const hilfsfeld = document.createElement('textarea');
    hilfsfeld.value = text;
    // Ausserhalb des Sichtfelds, aber nicht `display: none` -- ein Element,
    // das nicht dargestellt wird, laesst sich auch nicht markieren.
    hilfsfeld.setAttribute('readonly', '');
    hilfsfeld.style.position = 'fixed';
    hilfsfeld.style.top = '-1000px';
    hilfsfeld.style.opacity = '0';
    document.body.appendChild(hilfsfeld);
    hilfsfeld.select();

    let geklappt = false;
    try {
      geklappt = document.execCommand('copy');
    } catch {
      geklappt = false;
    }
    document.body.removeChild(hilfsfeld);

    if (geklappt) {
      setStand('kopiert');
      zuruecksetzen();
      return;
    }

    // Stufe 3: markieren, damit der Mensch selbst kopieren kann.
    const ziel = zielId ? document.getElementById(zielId) : null;
    if (ziel) {
      const bereich = document.createRange();
      bereich.selectNodeContents(ziel);
      const auswahl = window.getSelection();
      auswahl?.removeAllRanges();
      auswahl?.addRange(bereich);
    }
    setStand('markiert');
    zuruecksetzen();
  }

  const beschriftung =
    stand === 'kopiert'
      ? 'Kopiert'
      : stand === 'markiert'
        ? 'Markiert — jetzt kopieren'
        : 'Kopieren';

  /*
   * `min-h-10` sind 40px: dieselbe Untergrenze wie bei den Eingabefeldern.
   * Ohne sie war der Knopf 30px hoch -- auf dem Telefon ein Ziel, das man
   * zweimal antippt.
   */
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={kopieren}
        aria-label={`${bezeichnung} kopieren`}
        className="inline-flex min-h-10 shrink-0 items-center rounded-md border border-line-interactive px-3 text-xs font-medium text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        {beschriftung}
      </button>
      {/*
        * `role="status"` statt einer stillen Farbaenderung: Wer nicht sieht,
        * ob sich der Knopf veraendert hat, bekommt es sonst nicht mit.
        */}
      <span role="status" className="text-xs text-ink-subtle">
        {stand === 'kopiert' ? `${bezeichnung} liegt in der Zwischenablage.` : null}
        {stand === 'markiert'
          ? 'Die Zwischenablage ist hier nicht verfügbar (kein https). Der Text ist markiert — mit Strg+C beziehungsweise langem Antippen kopieren.'
          : null}
      </span>
    </div>
  );
}
