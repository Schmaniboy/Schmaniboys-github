import type { Metadata } from 'next';

import { KaeuferCheckliste } from '@/components/dokumente/KaeuferCheckliste';

export const metadata: Metadata = {
  title: 'Käufer-Checkliste — Vorlage',
  description:
    'Worauf vor dem Kauf eines Gebrauchtwagens zu achten ist: Prüfpunkte für Papiere, Probefahrt und Zustand.',
};

export default function KaeuferChecklistePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Käufer-Checkliste
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Nehmen Sie diese Liste zur Besichtigung mit. Systematisch prüfen statt
        im Nachhinein ärgern.
      </p>

      <div className="mt-8">
        <KaeuferCheckliste />
      </div>

      <div className="mt-10 rounded-lg border border-line bg-surface-1 p-6 print:hidden">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Hinweis:</strong> Diese Checkliste erhebt keinen Anspruch auf
          Vollständigkeit. Sie ersetzt keine professionelle Fahrzeugbegutachtung
          durch eine Prüforganisation.
        </p>
      </div>
    </div>
  );
}
