import type { Metadata } from 'next';

import { KaufvertragFormular } from '@/components/dokumente/KaufvertragFormular';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Kaufvertrag — Vorlage',
  description:
    'Vorlage für einen Gebrauchtwagen-Kaufvertrag zwischen Privatpersonen. Ausfüllen, drucken, unterschreiben.',
};

export default function KaufvertragPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:py-4">
      <div className="print:hidden">
        <Breadcrumbs items={[{ href: '/dokumente', label: 'Dokumente' }, { label: 'Kaufvertrag' }]} />
      </div>
      <div className="accent-rule mb-6 print:hidden" />
      <p className="eyebrow mb-2 print:hidden">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Kaufvertrag
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Vorlage für den privaten Gebrauchtwagenverkauf. Felder ausfüllen, dann
        über die Druckfunktion des Browsers als PDF speichern oder direkt
        ausdrucken.
      </p>

      <div className="mt-8">
        <KaufvertragFormular />
      </div>

      <div className="mt-10 rounded-lg border border-line bg-surface-1 p-6 print:hidden">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Rechtshinweis:</strong> Diese Vorlage ist eine Arbeitshilfe und
          ersetzt keine individuelle Rechtsberatung. CARONEX übernimmt keine Gewähr
          für die rechtliche Vollständigkeit oder Richtigkeit. Insbesondere kann
          diese Vorlage regionale Besonderheiten nicht berücksichtigen. Im
          Zweifelsfall ziehen Sie eine Rechtsanwältin oder einen Rechtsanwalt hinzu.
        </p>
      </div>
    </div>
  );
}
