import type { Metadata } from 'next';

import { FahrzeugberichtFormular } from '@/components/dokumente/FahrzeugberichtFormular';

export const metadata: Metadata = {
  title: 'Fahrzeugbericht — Vorlage',
  description:
    'Zusammenfassung aller relevanten Daten zu einem Fahrzeug: Generation, Motor, Ausstattung, Schwachstellen, Wartung, Kosten.',
};

export default function FahrzeugberichtPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Fahrzeugbericht
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Alle wichtigen Daten zu einem Fahrzeug auf einen Blick. Vor dem Kauf
        ausfüllen und mit dem Angebot abgleichen.
      </p>

      <div className="mt-8">
        <FahrzeugberichtFormular />
      </div>

      <div className="mt-10 rounded-lg border border-line bg-surface-1 p-6 print:hidden">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Hinweis:</strong> Dieser Bericht ist eine Arbeitshilfe. Technische
          Daten sind vor dem Kauf immer anhand der Fahrzeugpapiere und einer
          professionellen Prüfung zu verifizieren. CARONEX übernimmt keine Gewähr
          für Vollständigkeit oder Richtigkeit.
        </p>
      </div>
    </div>
  );
}
