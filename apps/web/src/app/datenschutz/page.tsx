import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung.',
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">Datenschutzerklärung</h1>
      <div className="mt-6 rounded-lg border border-line bg-surface-2 p-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          Die Datenschutzerklärung nach Art. 13 DSGVO wird vom Betreiber
          erstellt und hier veröffentlicht, bevor personenbezogene Daten
          verarbeitet werden. Bis dahin ist diese Seite ein Platzhalter.
        </p>
      </div>
    </div>
  );
}
