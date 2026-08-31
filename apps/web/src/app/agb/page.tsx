import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen',
  description: 'AGB der Plattform.',
};

export default function AgbPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">
        Allgemeine Geschäftsbedingungen
      </h1>
      <div className="mt-6 rounded-lg border border-line bg-surface-2 p-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          Die AGB werden vom Betreiber erstellt und hier veröffentlicht, bevor
          entgeltliche Leistungen angeboten werden. Bis dahin ist diese Seite
          ein Platzhalter.
        </p>
      </div>
    </div>
  );
}
