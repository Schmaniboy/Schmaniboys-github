import type { Metadata } from 'next';

import { KaufvertragFormular } from '@/components/dokumente/KaufvertragFormular';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Kaufvertrag — Vorlage',
  description:
    'Vorlage fuer einen Gebrauchtwagen-Kaufvertrag. Online ausfuellen, drucken, unterschreiben.',
};

export default async function KaufvertragPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const istDemo = params.demo !== undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:py-4">
      <div className="print:hidden">
        <Breadcrumbs items={[{ href: '/dokumente', label: 'Dokumente' }, { label: 'Kaufvertrag' }]} />
      </div>
      <div className="accent-rule mb-6 print:hidden" />
      <p className="eyebrow mb-2 print:hidden">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink print:hidden">
        Kaufvertrag
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted print:hidden">
        Vorlage fuer den Gebrauchtwagenverkauf — wahlweise zwischen
        Privatpersonen oder von Unternehmer an Verbraucher. Felder online
        ausfuellen, dann ueber die Druckfunktion des Browsers als PDF speichern
        oder direkt ausdrucken.
      </p>

      <div className="mt-8">
        <KaufvertragFormular istDemo={istDemo} />
      </div>

      <div className="mt-10 rounded-lg border border-line bg-surface-1 p-6 print:hidden">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Rechtshinweis:</strong> Diese Vorlage ist eine Arbeitshilfe und
          ersetzt keine individuelle Rechtsberatung. CARONEX ist nicht
          Vertragspartei und uebernimmt keine Gewaehr fuer die rechtliche
          Vollstaendigkeit oder Richtigkeit. Insbesondere kann diese Vorlage
          regionale Besonderheiten nicht beruecksichtigen. Klauseln, die mit
          [RECHTLICH PRUEFEN] gekennzeichnet sind, sollten vor Verwendung von
          einer Rechtsanwaeltin oder einem Rechtsanwalt geprueft werden.
        </p>
      </div>
    </div>
  );
}
