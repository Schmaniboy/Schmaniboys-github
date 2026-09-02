import type { Metadata } from 'next';

import { KaeuferCheckliste } from '@/components/dokumente/KaeuferCheckliste';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Kaeufer-Checkliste — Vorlage',
  description:
    'Worauf vor dem Kauf eines Gebrauchtwagens zu achten ist: Pruefpunkte fuer Papiere, Probefahrt und Zustand.',
};

export default async function KaeuferChecklistePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const istDemo = params.demo !== undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:py-4">
      <div className="print:hidden">
        <Breadcrumbs items={[{ href: '/dokumente', label: 'Dokumente' }, { label: 'Kaeufer-Checkliste' }]} />
      </div>
      <div className="accent-rule mb-6 print:hidden" />
      <p className="eyebrow mb-2 print:hidden">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink print:hidden">
        Kaeufer-Checkliste
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted print:hidden">
        Nehmen Sie diese Liste zur Besichtigung mit. Systematisch pruefen statt
        im Nachhinein aergern.
      </p>

      <div className="mt-8">
        <KaeuferCheckliste istDemo={istDemo} />
      </div>

      <div className="mt-10 rounded-lg border border-line bg-surface-1 p-6 print:hidden">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Hinweis:</strong> Diese Checkliste ist eine Orientierungshilfe
          und erhebt keinen Anspruch auf Vollstaendigkeit. Sie ersetzt keine
          technische Untersuchung, keine Diagnose und kein
          Sachverstaendigengutachten. CARONEX uebernimmt keine Gewaehr. Die
          Kaufentscheidung liegt beim Nutzer.
        </p>
      </div>
    </div>
  );
}
