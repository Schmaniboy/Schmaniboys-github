import type { Metadata } from 'next';

import { FahrzeugberichtFormular } from '@/components/dokumente/FahrzeugberichtFormular';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Fahrzeugbericht — Vorlage',
  description:
    'Zusammenfassung aller relevanten Daten zu einem Fahrzeug: Generation, Motor, Ausstattung, Schwachstellen, Wartung, Kosten.',
};

export default async function FahrzeugberichtPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const istDemo = params.demo !== undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:py-4">
      <div className="print:hidden">
        <Breadcrumbs items={[{ href: '/dokumente', label: 'Dokumente' }, { label: 'Fahrzeugbericht' }]} />
      </div>
      <div className="accent-rule mb-6 print:hidden" />
      <p className="eyebrow mb-2 print:hidden">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink print:hidden">
        Fahrzeugbericht
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted print:hidden">
        Alle wichtigen Daten zu einem Fahrzeug auf einen Blick. Vor dem Kauf
        ausfuellen und mit dem Angebot abgleichen.
      </p>

      <div className="mt-8">
        <FahrzeugberichtFormular istDemo={istDemo} />
      </div>

      <div className="mt-10 glass-card rounded-xl p-6 print:hidden">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Hinweis:</strong> Dieser Bericht ist eine Arbeitshilfe. Technische
          Daten sind vor dem Kauf immer anhand der Fahrzeugpapiere und einer
          professionellen Pruefung zu verifizieren. CARONEX uebernimmt keine Gewaehr
          fuer Vollstaendigkeit oder Richtigkeit.
        </p>
      </div>
    </div>
  );
}
