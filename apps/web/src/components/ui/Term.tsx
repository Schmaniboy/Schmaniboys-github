import type { ReactNode } from 'react';

import { GLOSSARY, type GlossaryEntry, type GlossaryKey } from '@ap/core';

/**
 * Fachbegriff mit Erklaerung.
 *
 * Der MASTERPLAN verlangt Verstaendlichkeit fuer Menschen ohne Vorwissen.
 * Ein `<abbr>` mit `title` erreicht das ohne JavaScript und ohne Ueberlagerung,
 * die auf dem Telefon im Weg steht. Der gepunktete Unterstrich zeigt, dass
 * eine Erklaerung dahintersteckt.
 */
export function Term({ term, children }: { term: GlossaryKey; children?: ReactNode }) {
  /*
   * Ausdrueckliche Typangabe: Ohne sie verengt TypeScript den Eintrag im
   * else-Zweig auf `never`, weil derzeit jeder Glossareintrag ein
   * `whyItMatters` besitzt. Das waere ein Fehler, der beim ersten Eintrag
   * ohne dieses Feld verschwindet -- also einer, der spaeter verwirrt.
   */
  const eintrag: GlossaryEntry = GLOSSARY[term];
  const erklaerung = eintrag.whyItMatters
    ? `${eintrag.plain} ${eintrag.whyItMatters}`
    : eintrag.plain;

  return (
    <abbr
      title={erklaerung}
      className="cursor-help underline decoration-line-interactive decoration-dotted underline-offset-4"
    >
      {children ?? eintrag.term}
    </abbr>
  );
}

/** Vollstaendige Erklaerung als Block -- fuer eine Glossarseite. */
export function TermCard({ term }: { term: GlossaryKey }) {
  const eintrag: GlossaryEntry = GLOSSARY[term];
  return (
    <div className="border-t border-line py-4">
      <h3 className="text-sm font-semibold text-ink">{eintrag.term}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{eintrag.plain}</p>
      {eintrag.whyItMatters ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-subtle">{eintrag.whyItMatters}</p>
      ) : null}
    </div>
  );
}
