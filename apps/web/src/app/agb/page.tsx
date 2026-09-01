import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen',
  description: 'AGB der Plattform.',
};

export default function AgbPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Rechtliches</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Allgemeine Geschäftsbedingungen
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Nutzungsbedingungen der Plattform.
      </p>

      <div className="mt-8 rounded-lg border border-line bg-surface-2 p-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          Die AGB werden vom Betreiber erstellt und hier veröffentlicht, bevor
          entgeltliche Leistungen angeboten werden. Bis dahin ist diese Seite
          ein Platzhalter.
        </p>
      </div>
    </div>
  );
}
