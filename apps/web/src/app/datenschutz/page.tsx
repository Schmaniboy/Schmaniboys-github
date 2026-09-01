import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung.',
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Rechtliches</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Datenschutzerklärung</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Informationen zur Verarbeitung personenbezogener Daten nach Art. 13 DSGVO.
      </p>

      <div className="mt-8 rounded-lg border border-line bg-surface-2 p-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          Die Datenschutzerklärung wird vom Betreiber erstellt und hier
          veröffentlicht, bevor personenbezogene Daten verarbeitet werden.
          Bis dahin ist diese Seite ein Platzhalter.
        </p>
      </div>
    </div>
  );
}
