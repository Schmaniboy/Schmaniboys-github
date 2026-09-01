import type { Metadata } from 'next';

import { UebergabeprotokollFormular } from '@/components/dokumente/UebergabeprotokollFormular';

export const metadata: Metadata = {
  title: 'Übergabeprotokoll — Vorlage',
  description:
    'Zustand des Fahrzeugs bei Übergabe dokumentieren: Mängel, Kratzer, Zubehör, Kilometerstand.',
};

export default function UebergabeprotokollPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Übergabeprotokoll
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Dokumentiert den Zustand des Fahrzeugs bei Übergabe. Drucken,
        gemeinsam ausfüllen, beide unterschreiben.
      </p>

      <div className="mt-8">
        <UebergabeprotokollFormular />
      </div>

      <div className="mt-10 rounded-lg border border-line bg-surface-1 p-6 print:hidden">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Rechtshinweis:</strong> Dieses Protokoll ist eine Arbeitshilfe
          und ersetzt keine individuelle Rechtsberatung. CARONEX übernimmt keine
          Gewähr für Vollständigkeit oder Richtigkeit.
        </p>
      </div>
    </div>
  );
}
