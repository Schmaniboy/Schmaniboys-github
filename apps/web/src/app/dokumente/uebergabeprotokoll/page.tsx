import type { Metadata } from 'next';

import { UebergabeprotokollFormular } from '@/components/dokumente/UebergabeprotokollFormular';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Uebergabeprotokoll — Vorlage',
  description:
    'Zustand des Fahrzeugs bei Uebergabe dokumentieren: Maengel, Kratzer, Zubehoer, Kilometerstand.',
};

export default async function UebergabeprotokollPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const istDemo = params.demo !== undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:py-4">
      <div className="print:hidden">
        <Breadcrumbs items={[{ href: '/dokumente', label: 'Dokumente' }, { label: 'Uebergabeprotokoll' }]} />
      </div>
      <div className="accent-rule mb-6 print:hidden" />
      <p className="eyebrow mb-2 print:hidden">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink print:hidden">
        Uebergabeprotokoll
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted print:hidden">
        Dokumentiert den Zustand des Fahrzeugs bei Uebergabe. Drucken,
        gemeinsam ausfuellen, beide unterschreiben.
      </p>

      <div className="mt-8">
        <UebergabeprotokollFormular istDemo={istDemo} />
      </div>

      <div className="mt-10 rounded-lg border border-line bg-surface-1 p-6 print:hidden">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Rechtshinweis:</strong> Dieses Protokoll ist eine Arbeitshilfe
          und ersetzt keine individuelle Rechtsberatung. CARONEX ist nicht
          Vertragspartei und uebernimmt keine Gewaehr fuer Vollstaendigkeit
          oder Richtigkeit.
        </p>
      </div>
    </div>
  );
}
